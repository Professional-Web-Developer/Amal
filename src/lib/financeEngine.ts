import type {
  Asset,
  Liability,
  IncomeRecord,
  ExpenseRecord,
  FinancialGoal,
  Transaction,
  FinancialSummary,
  ExpenseBreakdown,
  AssetAllocation,
  IncomeVsExpense,
  NetWorthTrend,
  FinancialHealthScore,
  HealthScoreBreakdown,
  SpendingAnomaly,
  WealthProjection,
  ProjectionMilestone,
  GoalFeasibility,
  FinancialInsight,
  MonthlySummary,
} from '@/types/finance';

// ============================
// CATEGORY COLORS
// ============================
const EXPENSE_COLORS: Record<string, string> = {
  food: '#ef4444',
  rent: '#8b5cf6',
  emi: '#f59e0b',
  travel: '#06b6d4',
  subscription: '#ec4899',
  medical: '#14b8a6',
  utilities: '#6366f1',
  shopping: '#f97316',
  entertainment: '#a855f7',
  education: '#3b82f6',
  insurance: '#10b981',
  fuel: '#eab308',
  groceries: '#22c55e',
  other: '#64748b',
};

const ASSET_COLORS: Record<string, string> = {
  gold: '#f59e0b',
  crypto: '#8b5cf6',
  stocks: '#3b82f6',
  mutual_funds: '#06b6d4',
  property: '#10b981',
  cash: '#22c55e',
  fixed_deposit: '#14b8a6',
  ppf: '#6366f1',
  other: '#64748b',
};

// ============================
// CORE CALCULATIONS
// ============================
export function calculateFinancialSummary(
  assets: Asset[],
  liabilities: Liability[],
  incomeRecords: IncomeRecord[],
  expenseRecords: ExpenseRecord[],
  transactions: Transaction[]
): FinancialSummary {
  const totalAssets = assets.reduce((sum, a) => sum + (a.current_value || 0), 0);
  const totalLiabilities = liabilities.reduce((sum, l) => sum + (l.outstanding_amount || 0), 0);
  const netWorth = totalAssets - totalLiabilities;

  // Monthly calculations from dedicated records
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const monthlyIncomeFromRecords = incomeRecords
    .filter(r => {
      const d = new Date(r.date);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    })
    .reduce((sum, r) => sum + r.amount, 0);

  const monthlyExpensesFromRecords = expenseRecords
    .filter(r => {
      const d = new Date(r.date);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    })
    .reduce((sum, r) => sum + r.amount, 0);

  // Also include from unified transactions for the month
  const monthlyIncomeFromTx = transactions
    .filter(tx => {
      const d = new Date(tx.date || tx.created_at);
      return tx.type === 'income' && d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    })
    .reduce((sum, tx) => sum + tx.amount, 0);

  const monthlyExpensesFromTx = transactions
    .filter(tx => {
      const d = new Date(tx.date || tx.created_at);
      return tx.type === 'expense' && d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    })
    .reduce((sum, tx) => sum + tx.amount, 0);

  const monthlyIncome = monthlyIncomeFromRecords + monthlyIncomeFromTx;
  const monthlyExpenses = monthlyExpensesFromRecords + monthlyExpensesFromTx;
  const monthlySurplus = monthlyIncome - monthlyExpenses;
  const savingsRate = monthlyIncome > 0 ? (monthlySurplus / monthlyIncome) * 100 : 0;
  const expenseRatio = monthlyIncome > 0 ? (monthlyExpenses / monthlyIncome) * 100 : 0;

  const investedAssets = assets
    .filter(a => ['stocks', 'mutual_funds', 'crypto', 'gold', 'ppf', 'fixed_deposit'].includes(a.asset_type))
    .reduce((sum, a) => sum + a.current_value, 0);
  const investmentRatio = netWorth > 0 ? (investedAssets / netWorth) * 100 : 0;

  const liquidAssets = assets
    .filter(a => ['cash', 'bank'].includes(a.asset_type) || a.asset_type === 'fixed_deposit')
    .reduce((sum, a) => sum + a.current_value, 0);
  const emergencyFundCoverage = monthlyExpenses > 0 ? liquidAssets / monthlyExpenses : 0;

  const totalEMI = liabilities.reduce((sum, l) => sum + (l.emi_amount || 0), 0);
  const debtToIncomeRatio = monthlyIncome > 0 ? (totalEMI / monthlyIncome) * 100 : 0;

  // TREND CALCULATIONS (MoM)
  const prevMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const prevMonth = prevMonthDate.getMonth();
  const prevYear = prevMonthDate.getFullYear();

  const prevIncome = [
    ...incomeRecords.filter(r => { const d = new Date(r.date); return d.getMonth() === prevMonth && d.getFullYear() === prevYear; }),
    ...transactions.filter(tx => { const d = new Date(tx.date || tx.created_at); return tx.type === 'income' && d.getMonth() === prevMonth && d.getFullYear() === prevYear; })
  ].reduce((sum, r) => sum + r.amount, 0);

  const prevExpenses = [
    ...expenseRecords.filter(r => { const d = new Date(r.date); return d.getMonth() === prevMonth && d.getFullYear() === prevYear; }),
    ...transactions.filter(tx => { const d = new Date(tx.date || tx.created_at); return tx.type === 'expense' && d.getMonth() === prevMonth && d.getFullYear() === prevYear; })
  ].reduce((sum, r) => sum + r.amount, 0);

  const prevSurplus = prevIncome - prevExpenses;

  const calculateTrend = (current: number, previous: number) => {
    if (previous === 0) return { value: '0%', isUp: current >= 0 };
    const diff = ((current - previous) / previous) * 100;
    return {
      value: `${Math.abs(Math.round(diff * 10) / 10)}%`,
      isUp: diff >= 0
    };
  };

  return {
    totalAssets,
    totalLiabilities,
    netWorth,
    monthlyIncome,
    monthlyExpenses,
    monthlySurplus,
    savingsRate: Math.round(savingsRate * 10) / 10,
    expenseRatio: Math.round(expenseRatio * 10) / 10,
    investmentRatio: Math.round(investmentRatio * 10) / 10,
    emergencyFundCoverage: Math.round(emergencyFundCoverage * 10) / 10,
    debtToIncomeRatio: Math.round(debtToIncomeRatio * 10) / 10,
    trends: {
      netWorth: calculateTrend(netWorth, netWorth - monthlySurplus), // Simplified net worth trend
      income: calculateTrend(monthlyIncome, prevIncome),
      expenses: calculateTrend(monthlyExpenses, prevExpenses),
      surplus: calculateTrend(monthlySurplus, prevSurplus),
    }
  };
}

// ============================
// EXPENSE BREAKDOWN
// ============================
export function calculateExpenseBreakdown(
  expenseRecords: ExpenseRecord[],
  transactions: Transaction[]
): ExpenseBreakdown[] {
  const categoryMap = new Map<string, number>();

  expenseRecords.forEach(r => {
    const cat = r.category || 'other';
    categoryMap.set(cat, (categoryMap.get(cat) || 0) + r.amount);
  });

  transactions
    .filter(tx => tx.type === 'expense')
    .forEach(tx => {
      const cat = tx.category || 'other';
      categoryMap.set(cat, (categoryMap.get(cat) || 0) + tx.amount);
    });

  const total = Array.from(categoryMap.values()).reduce((sum, v) => sum + v, 0);

  return Array.from(categoryMap.entries())
    .map(([category, amount]) => ({
      category,
      amount,
      percentage: total > 0 ? Math.round((amount / total) * 1000) / 10 : 0,
      color: EXPENSE_COLORS[category] || EXPENSE_COLORS.other,
    }))
    .sort((a, b) => b.amount - a.amount);
}

// ============================
// ASSET ALLOCATION
// ============================
export function calculateAssetAllocation(assets: Asset[]): AssetAllocation[] {
  const typeMap = new Map<string, number>();

  assets.forEach(a => {
    const type = a.asset_type || 'other';
    typeMap.set(type, (typeMap.get(type) || 0) + a.current_value);
  });

  const total = Array.from(typeMap.values()).reduce((sum, v) => sum + v, 0);

  return Array.from(typeMap.entries())
    .map(([type, value]) => ({
      type,
      value,
      percentage: total > 0 ? Math.round((value / total) * 1000) / 10 : 0,
      color: ASSET_COLORS[type] || ASSET_COLORS.other,
    }))
    .sort((a, b) => b.value - a.value);
}

// ============================
// INCOME VS EXPENSE (6 months)
// ============================
export function calculateIncomeVsExpense(
  incomeRecords: IncomeRecord[],
  expenseRecords: ExpenseRecord[],
  transactions: Transaction[]
): IncomeVsExpense[] {
  const result: IncomeVsExpense[] = [];
  const now = new Date();

  for (let i = 5; i >= 0; i--) {
    const targetDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const month = targetDate.getMonth();
    const year = targetDate.getFullYear();
    const label = targetDate.toLocaleString('default', { month: 'short' });

    let income = incomeRecords
      .filter(r => {
        const d = new Date(r.date);
        return d.getMonth() === month && d.getFullYear() === year;
      })
      .reduce((sum, r) => sum + r.amount, 0);

    let expense = expenseRecords
      .filter(r => {
        const d = new Date(r.date);
        return d.getMonth() === month && d.getFullYear() === year;
      })
      .reduce((sum, r) => sum + r.amount, 0);

    // Add from unified transactions
    income += transactions
      .filter(tx => {
        const d = new Date(tx.date || tx.created_at);
        return tx.type === 'income' && d.getMonth() === month && d.getFullYear() === year;
      })
      .reduce((sum, tx) => sum + tx.amount, 0);

    expense += transactions
      .filter(tx => {
        const d = new Date(tx.date || tx.created_at);
        return tx.type === 'expense' && d.getMonth() === month && d.getFullYear() === year;
      })
      .reduce((sum, tx) => sum + tx.amount, 0);

    result.push({ month: label, income, expense });
  }

  return result;
}

// ============================
// NET WORTH TREND (6 months simulated)
// ============================
export function calculateNetWorthTrend(
  assets: Asset[],
  liabilities: Liability[],
  incomeRecords: IncomeRecord[],
  expenseRecords: ExpenseRecord[],
  transactions: Transaction[]
): NetWorthTrend[] {
  const totalAssets = assets.reduce((sum, a) => sum + a.current_value, 0);
  const totalLiabilities = liabilities.reduce((sum, l) => sum + l.outstanding_amount, 0);
  const currentNetWorth = totalAssets - totalLiabilities;

  const result: NetWorthTrend[] = [];
  const now = new Date();

  // Calculate monthly cash flows for modeling
  const monthlyCashFlows: number[] = [];
  for (let i = 5; i >= 0; i--) {
    const targetDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const month = targetDate.getMonth();
    const year = targetDate.getFullYear();

    let income = incomeRecords
      .filter(r => { const d = new Date(r.date); return d.getMonth() === month && d.getFullYear() === year; })
      .reduce((sum, r) => sum + r.amount, 0);

    let expense = expenseRecords
      .filter(r => { const d = new Date(r.date); return d.getMonth() === month && d.getFullYear() === year; })
      .reduce((sum, r) => sum + r.amount, 0);

    income += transactions.filter(tx => {
      const d = new Date(tx.date || tx.created_at);
      return tx.type === 'income' && d.getMonth() === month && d.getFullYear() === year;
    }).reduce((sum, tx) => sum + tx.amount, 0);

    expense += transactions.filter(tx => {
      const d = new Date(tx.date || tx.created_at);
      return tx.type === 'expense' && d.getMonth() === month && d.getFullYear() === year;
    }).reduce((sum, tx) => sum + tx.amount, 0);

    monthlyCashFlows.push(income - expense);
  }

  // Build net worth backward from current
  let runningNetWorth = currentNetWorth;
  const netWorthValues: number[] = [];
  for (let i = monthlyCashFlows.length - 1; i >= 0; i--) {
    netWorthValues.unshift(runningNetWorth);
    runningNetWorth -= monthlyCashFlows[i];
  }

  for (let i = 0; i < 6; i++) {
    const targetDate = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    const label = targetDate.toLocaleString('default', { month: 'short' });
    const nw = netWorthValues[i] || currentNetWorth;

    result.push({
      month: label,
      assets: totalAssets - (currentNetWorth - nw) * 0.6,
      liabilities: totalLiabilities - (currentNetWorth - nw) * 0.4,
      netWorth: nw,
    });
  }

  return result;
}

// ============================
// FINANCIAL HEALTH SCORE (0-100)
// ============================
export function calculateHealthScore(summary: FinancialSummary, goals: FinancialGoal[]): FinancialHealthScore {
  // 1. Savings Rate Score (weight 25%)
  let savingsRateScore = 0;
  if (summary.savingsRate >= 30) savingsRateScore = 100;
  else if (summary.savingsRate >= 20) savingsRateScore = 80;
  else if (summary.savingsRate >= 10) savingsRateScore = 60;
  else if (summary.savingsRate >= 5) savingsRateScore = 40;
  else if (summary.savingsRate > 0) savingsRateScore = 20;
  else savingsRateScore = 0;

  // 2. Debt-to-Income Ratio Score (weight 20%)
  let debtScore = 0;
  if (summary.debtToIncomeRatio <= 10) debtScore = 100;
  else if (summary.debtToIncomeRatio <= 20) debtScore = 80;
  else if (summary.debtToIncomeRatio <= 35) debtScore = 60;
  else if (summary.debtToIncomeRatio <= 50) debtScore = 40;
  else debtScore = 20;

  // 3. Emergency Fund Coverage Score (weight 20%)
  let emergencyScore = 0;
  if (summary.emergencyFundCoverage >= 6) emergencyScore = 100;
  else if (summary.emergencyFundCoverage >= 3) emergencyScore = 75;
  else if (summary.emergencyFundCoverage >= 1) emergencyScore = 50;
  else emergencyScore = 20;

  // 4. Expense Stability Score (weight 15%)
  let expenseStabilityScore = 0;
  if (summary.expenseRatio <= 50) expenseStabilityScore = 100;
  else if (summary.expenseRatio <= 70) expenseStabilityScore = 75;
  else if (summary.expenseRatio <= 85) expenseStabilityScore = 50;
  else expenseStabilityScore = 25;

  // 5. Goal Progress Score (weight 20%)
  let goalProgressScore = 0;
  if (goals.length > 0) {
    const avgProgress = goals.reduce((sum, g) => {
      const pct = g.target_amount > 0 ? (g.current_saved / g.target_amount) * 100 : 0;
      return sum + Math.min(pct, 100);
    }, 0) / goals.length;
    goalProgressScore = Math.min(Math.round(avgProgress), 100);
  } else {
    goalProgressScore = 50; // Neutral score if no goals set
  }

  const breakdown: HealthScoreBreakdown = {
    savingsRate: { score: savingsRateScore, weight: 25, label: 'Savings Rate', rawValue: summary.savingsRate, unit: '%' },
    debtToIncome: { score: debtScore, weight: 20, label: 'Debt-to-Income', rawValue: summary.debtToIncomeRatio, unit: '%' },
    emergencyFund: { score: emergencyScore, weight: 20, label: 'Emergency Fund', rawValue: summary.emergencyFundCoverage, unit: 'm' },
    expenseStability: { score: expenseStabilityScore, weight: 15, label: 'Expense Control', rawValue: summary.expenseRatio, unit: '%' },
    goalProgress: { score: goalProgressScore, weight: 20, label: 'Goal Progress', rawValue: goalProgressScore, unit: '%' },
  };

  const totalScore = Math.round(
    (savingsRateScore * 0.25) +
    (debtScore * 0.20) +
    (emergencyScore * 0.20) +
    (expenseStabilityScore * 0.15) +
    (goalProgressScore * 0.20)
  );

  let riskLevel: FinancialHealthScore['riskLevel'];
  let riskColor: string;
  if (totalScore >= 80) { riskLevel = 'excellent'; riskColor = '#10b981'; }
  else if (totalScore >= 65) { riskLevel = 'good'; riskColor = '#22c55e'; }
  else if (totalScore >= 45) { riskLevel = 'fair'; riskColor = '#f59e0b'; }
  else if (totalScore >= 25) { riskLevel = 'poor'; riskColor = '#f97316'; }
  else { riskLevel = 'critical'; riskColor = '#ef4444'; }

  const suggestions: string[] = [];
  if (savingsRateScore < 60) suggestions.push('Aim to save at least 20% of your monthly income.');
  if (debtScore < 60) suggestions.push('Your debt payments are high. Consider debt consolidation or faster payoff.');
  if (emergencyScore < 60) suggestions.push('Build an emergency fund covering at least 3 months of expenses.');
  if (expenseStabilityScore < 60) suggestions.push('Your expenses are too high relative to income. Review subscriptions and discretionary spending.');
  if (goalProgressScore < 60) suggestions.push('You\'re behind on your financial goals. Increase monthly contributions.');
  if (summary.investmentRatio < 30) suggestions.push('Consider investing more of your net worth for long-term growth.');

  return { totalScore, riskLevel, riskColor, breakdown, suggestions };
}

// ============================
// SPENDING ANOMALY DETECTION
// ============================
export function detectSpendingAnomalies(
  expenseRecords: ExpenseRecord[],
  transactions: Transaction[],
  threshold: number = 30
): SpendingAnomaly[] {
  const now = new Date();
  const anomalies: SpendingAnomaly[] = [];

  // Get expense data by category for last 4 months
  const monthlyByCategory = new Map<string, number[]>();

  for (let i = 0; i < 4; i++) {
    const targetDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const month = targetDate.getMonth();
    const year = targetDate.getFullYear();

    const monthExpenses = new Map<string, number>();

    expenseRecords
      .filter(r => { const d = new Date(r.date); return d.getMonth() === month && d.getFullYear() === year; })
      .forEach(r => {
        const cat = r.category || 'other';
        monthExpenses.set(cat, (monthExpenses.get(cat) || 0) + r.amount);
      });

    transactions
      .filter(tx => {
        const d = new Date(tx.date || tx.created_at);
        return tx.type === 'expense' && d.getMonth() === month && d.getFullYear() === year;
      })
      .forEach(tx => {
        const cat = tx.category || 'other';
        monthExpenses.set(cat, (monthExpenses.get(cat) || 0) + tx.amount);
      });

    for (const [cat, amount] of monthExpenses.entries()) {
      if (!monthlyByCategory.has(cat)) monthlyByCategory.set(cat, []);
      const arr = monthlyByCategory.get(cat)!;
      while (arr.length < i) arr.push(0);
      arr[i] = amount;
    }
  }

  for (const [category, months] of monthlyByCategory.entries()) {
    if (months.length < 2) continue;

    const currentMonth = months[0] || 0;
    const previousMonths = months.slice(1).filter(v => v > 0);
    if (previousMonths.length === 0) continue;

    const average = previousMonths.reduce((s, v) => s + v, 0) / previousMonths.length;
    if (average === 0) continue;

    const changePercent = ((currentMonth - average) / average) * 100;
    const absChange = Math.abs(changePercent);

    if (absChange >= threshold) {
      let severity: SpendingAnomaly['severity'] = 'low';
      if (absChange >= 80) severity = 'high';
      else if (absChange >= 50) severity = 'medium';

      anomalies.push({
        category,
        currentMonth,
        average: Math.round(average),
        changePercent: Math.round(changePercent),
        isIncrease: changePercent > 0,
        severity,
      });
    }
  }

  return anomalies.sort((a, b) => Math.abs(b.changePercent) - Math.abs(a.changePercent));
}

// ============================
// WEALTH PROJECTION SIMULATOR
// ============================
export function simulateWealthProjection(
  monthlySavings: number,
  annualReturnPercent: number,
  durationYears: number,
  initialAmount: number = 0
): { projections: WealthProjection[]; milestones: ProjectionMilestone[] } {
  const monthlyRate = annualReturnPercent / 100 / 12;
  const totalMonths = durationYears * 12;
  const projections: WealthProjection[] = [];

  let currentWealth = initialAmount;
  const milestoneTargets = [100000, 250000, 500000, 1000000, 2500000, 5000000, 10000000];
  const milestones: ProjectionMilestone[] = [];
  const reachedMilestones = new Set<number>();

  for (let m = 0; m <= totalMonths; m++) {
    const year = Math.floor(m / 12);
    const month = m % 12;

    if (m % 3 === 0 || m === totalMonths) {
      projections.push({
        year,
        month,
        label: m === 0 ? 'Now' : `${year}Y ${month}M`,
        projectedWealth: Math.round(currentWealth),
        totalInvested: initialAmount + monthlySavings * m,
        returns: Math.round(currentWealth - (initialAmount + monthlySavings * m)),
      });
    }

    // Check milestones
    for (const target of milestoneTargets) {
      if (!reachedMilestones.has(target) && currentWealth >= target) {
        reachedMilestones.add(target);
        const futureDate = new Date();
        futureDate.setMonth(futureDate.getMonth() + m);
        milestones.push({
          amount: target,
          label: formatCurrency(target),
          estimatedDate: futureDate.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }),
          monthsToReach: m,
        });
      }
    }

    // Compound
    currentWealth = (currentWealth + monthlySavings) * (1 + monthlyRate);
  }

  return { projections, milestones };
}

// ============================
// GOAL FEASIBILITY ANALYSIS
// ============================
export function analyzeGoalFeasibility(
  goals: FinancialGoal[],
  monthlySurplus: number
): GoalFeasibility[] {
  const now = new Date();

  return goals.map(goal => {
    const targetDate = new Date(goal.target_date);
    const monthsRemaining = Math.max(
      1,
      (targetDate.getFullYear() - now.getFullYear()) * 12 + (targetDate.getMonth() - now.getMonth())
    );

    const remaining = Math.max(0, goal.target_amount - goal.current_saved);
    const requiredMonthlySavings = remaining / monthsRemaining;
    const percentComplete = goal.target_amount > 0
      ? Math.min(100, Math.round((goal.current_saved / goal.target_amount) * 1000) / 10)
      : 0;

    return {
      goalId: goal.id,
      goalName: goal.goal_name,
      targetAmount: goal.target_amount,
      currentSaved: goal.current_saved,
      percentComplete,
      timeRemainingMonths: monthsRemaining,
      requiredMonthlySavings: Math.round(requiredMonthlySavings),
      isFeasible: requiredMonthlySavings <= monthlySurplus,
      currentSurplus: monthlySurplus,
    };
  });
}

// ============================
// FINANCIAL INSIGHTS GENERATOR
// ============================
export function generateInsights(
  summary: FinancialSummary,
  anomalies: SpendingAnomaly[],
  goalFeasibilities: GoalFeasibility[],
  healthScore: FinancialHealthScore
): FinancialInsight[] {
  const insights: FinancialInsight[] = [];

  // Savings rate insight
  if (summary.savingsRate > 20) {
    insights.push({
      id: 'savings-positive',
      type: 'positive',
      icon: '🎯',
      title: 'Strong Savings Rate',
      message: `Your savings rate is ${summary.savingsRate}% — above the recommended 20%.`,
      metric: `${summary.savingsRate}%`,
    });
  } else if (summary.savingsRate < 10) {
    insights.push({
      id: 'savings-warning',
      type: 'warning',
      icon: '⚠️',
      title: 'Low Savings Rate',
      message: `Your savings rate is ${summary.savingsRate}%. Aim for at least 20%.`,
      metric: `${summary.savingsRate}%`,
    });
  }

  // Emergency fund insight
  insights.push({
    id: 'emergency-fund',
    type: summary.emergencyFundCoverage >= 3 ? 'positive' : 'warning',
    icon: summary.emergencyFundCoverage >= 3 ? '🛡️' : '🚨',
    title: 'Emergency Fund Coverage',
    message: `Emergency fund covers ${summary.emergencyFundCoverage} months of expenses.`,
    metric: `${summary.emergencyFundCoverage} months`,
  });

  // Spending anomalies
  anomalies.slice(0, 3).forEach(anomaly => {
    const direction = anomaly.isIncrease ? 'increased' : 'decreased';
    insights.push({
      id: `anomaly-${anomaly.category}`,
      type: anomaly.isIncrease && anomaly.severity !== 'low' ? 'warning' : 'info',
      icon: anomaly.isIncrease ? '📈' : '📉',
      title: `${capitalize(anomaly.category)} Spending ${capitalize(direction)}`,
      message: `${capitalize(anomaly.category)} spending ${direction} ${Math.abs(anomaly.changePercent)}% compared to average.`,
      change: anomaly.changePercent,
    });
  });

  // Goal progress
  goalFeasibilities.forEach(goal => {
    if (goal.percentComplete >= 100) {
      insights.push({
        id: `goal-complete-${goal.goalId}`,
        type: 'positive',
        icon: '🏆',
        title: 'Goal Achieved!',
        message: `Congratulations! You've reached your "${goal.goalName}" goal.`,
        metric: '100%',
      });
    } else if (!goal.isFeasible) {
      insights.push({
        id: `goal-warn-${goal.goalId}`,
        type: 'critical',
        icon: '🔴',
        title: 'Goal At Risk',
        message: `"${goal.goalName}" requires ₹${goal.requiredMonthlySavings.toLocaleString()}/month but surplus is ₹${goal.currentSurplus.toLocaleString()}.`,
        metric: `${goal.percentComplete}%`,
      });
    } else if (goal.percentComplete > 0) {
      insights.push({
        id: `goal-progress-${goal.goalId}`,
        type: 'info',
        icon: '🎯',
        title: 'Goal Progress',
        message: `You are ${goal.percentComplete}% closer to "${goal.goalName}".`,
        metric: `${goal.percentComplete}%`,
      });
    }
  });

  // Health score insight
  if (healthScore.totalScore >= 80) {
    insights.push({
      id: 'health-excellent',
      type: 'positive',
      icon: '💪',
      title: 'Excellent Financial Health',
      message: `Your financial health score is ${healthScore.totalScore}/100 — outstanding!`,
      metric: `${healthScore.totalScore}`,
    });
  } else if (healthScore.totalScore < 45) {
    insights.push({
      id: 'health-warning',
      type: 'critical',
      icon: '🏥',
      title: 'Financial Health Needs Attention',
      message: `Your financial health score is ${healthScore.totalScore}/100. Focus on ${healthScore.suggestions[0] || 'improving your finances'}.`,
      metric: `${healthScore.totalScore}`,
    });
  }

  return insights;
}

// ============================
// MONTHLY SUMMARY
// ============================
export function generateMonthlySummaries(
  incomeRecords: IncomeRecord[],
  expenseRecords: ExpenseRecord[],
  transactions: Transaction[],
  monthsBack: number = 6
): MonthlySummary[] {
  const summaries: MonthlySummary[] = [];
  const now = new Date();

  for (let i = 0; i < monthsBack; i++) {
    const targetDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const month = targetDate.getMonth();
    const year = targetDate.getFullYear();
    const label = targetDate.toLocaleString('default', { month: 'long' });

    let totalIncome = incomeRecords
      .filter(r => { const d = new Date(r.date); return d.getMonth() === month && d.getFullYear() === year; })
      .reduce((sum, r) => sum + r.amount, 0);

    let totalExpenses = expenseRecords
      .filter(r => { const d = new Date(r.date); return d.getMonth() === month && d.getFullYear() === year; })
      .reduce((sum, r) => sum + r.amount, 0);

    totalIncome += transactions.filter(tx => { const d = new Date(tx.date || tx.created_at); return tx.type === 'income' && d.getMonth() === month && d.getFullYear() === year; }).reduce((sum, tx) => sum + tx.amount, 0);
    totalExpenses += transactions.filter(tx => { const d = new Date(tx.date || tx.created_at); return tx.type === 'expense' && d.getMonth() === month && d.getFullYear() === year; }).reduce((sum, tx) => sum + tx.amount, 0);

    // Find top expense category
    const catMap = new Map<string, number>();
    expenseRecords
      .filter(r => { const d = new Date(r.date); return d.getMonth() === month && d.getFullYear() === year; })
      .forEach(r => catMap.set(r.category, (catMap.get(r.category) || 0) + r.amount));
    transactions
      .filter(tx => { const d = new Date(tx.date || tx.created_at); return tx.type === 'expense' && d.getMonth() === month && d.getFullYear() === year; })
      .forEach(tx => catMap.set(tx.category, (catMap.get(tx.category) || 0) + tx.amount));

    let topCat = 'N/A';
    let topAmount = 0;
    for (const [cat, amount] of catMap.entries()) {
      if (amount > topAmount) { topCat = cat; topAmount = amount; }
    }

    const surplus = totalIncome - totalExpenses;
    const savingsRate = totalIncome > 0 ? Math.round((surplus / totalIncome) * 100) : 0;

    summaries.push({
      month: label,
      year,
      totalIncome,
      totalExpenses,
      surplus,
      savingsRate,
      topExpenseCategory: topCat,
      topExpenseAmount: topAmount,
    });
  }

  return summaries;
}

// ============================
// HELPERS
// ============================
function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).replace(/_/g, ' ');
}

export function formatCurrency(amount: number, currency: string = 'INR'): string {
  if (currency === 'INR') {
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)}Cr`;
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
    if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}K`;
    return `₹${amount.toLocaleString('en-IN')}`;
  }
  return `$${amount.toLocaleString()}`;
}

export function formatCurrencyFull(amount: number): string {
  return `₹${amount.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}
