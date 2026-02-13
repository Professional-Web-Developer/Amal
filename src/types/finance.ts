// ===== ACCOUNTS =====
export type AccountType = 'bank' | 'cash' | 'wallet' | 'investment' | 'other';

export interface Account {
  id: string;
  user_id: string;
  name: string;
  type: AccountType;
  opening_balance: number;
  balance: number;
  bank_name?: string;
  icon?: string;
  color?: string;
  created_at: string;
  updated_at?: string;
}

// ===== INCOME =====
export type IncomeCategory = 'salary' | 'business' | 'interest' | 'rental' | 'freelance' | 'dividend' | 'other';
export type Frequency = 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'quarterly' | 'yearly' | 'custom';

export interface IncomeRecord {
  id: string;
  user_id: string;
  date: string;
  source_name: string;
  category: IncomeCategory;
  amount: number;
  is_recurring: boolean;
  frequency?: Frequency;
  account_id?: string;
  notes?: string;
  created_at: string;
}

// ===== EXPENSES =====
export type ExpenseCategory =
  | 'food' | 'rent' | 'emi' | 'travel' | 'subscription'
  | 'medical' | 'utilities' | 'shopping' | 'entertainment'
  | 'education' | 'insurance' | 'fuel' | 'groceries' | 'other';

export interface ExpenseRecord {
  id: string;
  user_id: string;
  date: string;
  category: ExpenseCategory;
  description: string;
  amount: number;
  payment_method: string;
  is_recurring: boolean;
  frequency?: Frequency;
  tags?: string[];
  account_id?: string;
  created_at: string;
}

// ===== ASSETS =====
export type AssetType = 'gold' | 'crypto' | 'stocks' | 'mutual_funds' | 'property' | 'cash' | 'fixed_deposit' | 'ppf' | 'other';

export interface Asset {
  id: string;
  user_id: string;
  asset_type: AssetType;
  asset_name: string;
  quantity?: number;
  current_value: number;
  purchase_value: number;
  purchase_date?: string;
  linked_account_id?: string;
  is_recurring?: boolean;
  recurring_amount?: number;
  notes?: string;
  created_at: string;
  updated_at?: string;
}

// ===== LIABILITIES =====
export type LiabilityType = 'personal_loan' | 'home_loan' | 'car_loan' | 'education_loan' | 'emi' | 'credit_card' | 'other';

export interface Liability {
  id: string;
  user_id: string;
  type: LiabilityType;
  name: string;
  outstanding_amount: number;
  original_amount: number;
  interest_rate: number;
  emi_amount: number;
  due_date: string;
  start_date: string;
  end_date?: string;
  linked_account_id?: string;
  is_recurring?: boolean;
  notes?: string;
  created_at: string;
  updated_at?: string;
}

// ===== FINANCIAL GOALS =====
export type GoalCategory = 'emergency_fund' | 'investment' | 'purchase' | 'retirement' | 'education' | 'travel' | 'freedom' | 'other';

export interface FinancialGoal {
  id: string;
  user_id: string;
  goal_name: string;
  target_amount: number;
  target_date: string;
  current_saved: number;
  linked_account_id?: string;
  goal_category: GoalCategory;
  is_recurring?: boolean;
  recurring_amount?: number;
  icon?: string;
  priority: number;
  notes?: string;
  created_at: string;
  updated_at?: string;
}

// ===== TRANSACTIONS (unified) =====
export type TransactionType = 'income' | 'expense' | 'transfer';

export interface Transaction {
  id: string;
  user_id: string;
  name: string;
  amount: number;
  type: TransactionType;
  category: string;
  account_id?: string;
  date?: string;
  icon?: string;
  notes?: string;
  tags?: string[];
  is_recurring?: boolean;
  created_at: string;
}

// ===== CALCULATION RESULTS =====
export interface FinancialSummary {
  totalAssets: number;
  totalLiabilities: number;
  netWorth: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  monthlySurplus: number;
  savingsRate: number;
  expenseRatio: number;
  investmentRatio: number;
  emergencyFundCoverage: number;
  debtToIncomeRatio: number;
  trends: {
    netWorth: { value: string; isUp: boolean };
    income: { value: string; isUp: boolean };
    expenses: { value: string; isUp: boolean };
    surplus: { value: string; isUp: boolean };
  };
}

export interface NetWorthTrend {
  month: string;
  assets: number;
  liabilities: number;
  netWorth: number;
}

export interface ExpenseBreakdown {
  category: string;
  amount: number;
  percentage: number;
  color: string;
}

export interface IncomeVsExpense {
  month: string;
  income: number;
  expense: number;
}

export interface AssetAllocation {
  type: string;
  value: number;
  percentage: number;
  color: string;
}

// ===== FINANCIAL HEALTH SCORE =====
export interface HealthScoreBreakdown {
  savingsRate: { score: number; weight: number; label: string; rawValue: number; unit: string };
  debtToIncome: { score: number; weight: number; label: string; rawValue: number; unit: string };
  emergencyFund: { score: number; weight: number; label: string; rawValue: number; unit: string };
  expenseStability: { score: number; weight: number; label: string; rawValue: number; unit: string };
  goalProgress: { score: number; weight: number; label: string; rawValue: number; unit: string };
}

export interface FinancialHealthScore {
  totalScore: number;
  riskLevel: 'excellent' | 'good' | 'fair' | 'poor' | 'critical';
  riskColor: string;
  breakdown: HealthScoreBreakdown;
  suggestions: string[];
}

// ===== SPENDING ANOMALY =====
export interface SpendingAnomaly {
  category: string;
  currentMonth: number;
  average: number;
  changePercent: number;
  isIncrease: boolean;
  severity: 'low' | 'medium' | 'high';
}

// ===== WEALTH PROJECTION =====
export interface WealthProjection {
  year: number;
  month: number;
  label: string;
  projectedWealth: number;
  totalInvested: number;
  returns: number;
}

export interface ProjectionMilestone {
  amount: number;
  label: string;
  estimatedDate: string;
  monthsToReach: number;
}

// ===== GOAL FEASIBILITY =====
export interface GoalFeasibility {
  goalId: string;
  goalName: string;
  targetAmount: number;
  currentSaved: number;
  percentComplete: number;
  timeRemainingMonths: number;
  requiredMonthlySavings: number;
  isFeasible: boolean;
  currentSurplus: number;
}

// ===== INSIGHTS =====
export interface FinancialInsight {
  id: string;
  type: 'positive' | 'warning' | 'info' | 'critical';
  icon: string;
  title: string;
  message: string;
  metric?: string;
  change?: number;
}

// ===== UI MODE =====
export type ViewMode = 'clean' | 'pro';

// ===== MONTHLY SUMMARY =====
export interface MonthlySummary {
  month: string;
  year: number;
  totalIncome: number;
  totalExpenses: number;
  surplus: number;
  savingsRate: number;
  topExpenseCategory: string;
  topExpenseAmount: number;
}
