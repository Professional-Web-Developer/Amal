"use server";

import { getAccounts } from './accounts';
import { getTransactions } from './transactions';
import { getAssets } from './assets';
import { getLiabilities } from './liabilities';
import { getGoals } from './goals';
import {
    calculateFinancialSummary,
    calculateExpenseBreakdown,
    calculateAssetAllocation,
    calculateIncomeVsExpense,
    calculateNetWorthTrend,
    calculateHealthScore,
    detectSpendingAnomalies,
    analyzeGoalFeasibility,
    generateInsights
} from '@/lib/financeEngine';

import { TransactionService } from '@/backend/services/transactionService';
import { AssetService } from '@/backend/services/assetService';
import { LiabilityService } from '@/backend/services/liabilityService';
import { GoalService } from '@/backend/services/goalService';

export async function processRecurringTransactions() {
    try {
        const [transactions, assets, liabilities, goals] = await Promise.all([
            getTransactions(),
            getAssets(),
            getLiabilities(),
            getGoals()
        ]);

        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        // 1. Process Transaction Templates
        const recurringTemplates = transactions.filter((tx: any) => tx.is_recurring);
        for (const template of recurringTemplates) {
            const templateDate = new Date(template.date || template.created_at);
            const alreadyExists = transactions.some((tx: any) => 
                tx.name === template.name && 
                tx.amount === template.amount &&
                !tx.is_recurring && 
                new Date(tx.date || tx.created_at).getMonth() === currentMonth &&
                new Date(tx.date || tx.created_at).getFullYear() === currentYear
            );

            if (!alreadyExists && (templateDate.getFullYear() < currentYear || templateDate.getMonth() < currentMonth)) {
                await TransactionService.createTransaction({
                    name: template.name,
                    amount: template.amount,
                    category: template.category,
                    type: template.type,
                    date: new Date(currentYear, currentMonth, templateDate.getDate()).toISOString(),
                    is_recurring: false
                });
            }
        }

        // 2. Process Liability EMIs
        for (const liability of liabilities) {
            if (!liability.is_recurring) continue;

            const dueDate = new Date(liability.due_date);
            const alreadyExists = transactions.some((tx: any) => 
                tx.name?.includes(liability.name) && 
                tx.amount === liability.emi_amount &&
                new Date(tx.date || tx.created_at).getMonth() === currentMonth &&
                new Date(tx.date || tx.created_at).getFullYear() === currentYear
            );

            if (!alreadyExists) {
                await TransactionService.createTransaction({
                    name: `Loan EMI: ${liability.name}`,
                    amount: liability.emi_amount,
                    category: 'emi',
                    type: 'expense',
                    date: new Date(currentYear, currentMonth, dueDate.getDate()).toISOString(),
                    is_recurring: false
                });
            }
        }

        // 3. Process Asset SIPs
        for (const asset of assets) {
            if (!asset.is_recurring || !asset.recurring_amount) continue;

            const alreadyExists = transactions.some((tx: any) => 
                tx.name?.includes(asset.asset_name) && 
                tx.amount === asset.recurring_amount &&
                new Date(tx.date || tx.created_at).getMonth() === currentMonth &&
                new Date(tx.date || tx.created_at).getFullYear() === currentYear
            );

            if (!alreadyExists) {
                // Create Transaction
                await TransactionService.createTransaction({
                    name: `SIP Invest: ${asset.asset_name}`,
                    amount: asset.recurring_amount,
                    category: 'investment',
                    type: 'expense',
                    date: new Date(currentYear, currentMonth, 1).toISOString(),
                    is_recurring: false
                });
                // Update Asset Value
                await AssetService.updateAsset(asset.id, {
                    current_value: asset.current_value + asset.recurring_amount
                });
            }
        }

        // 4. Process Goal Contributions
        for (const goal of goals) {
            if (!goal.is_recurring || !goal.recurring_amount) continue;

            const alreadyExists = transactions.some((tx: any) => 
                tx.name?.includes(goal.goal_name) && 
                tx.amount === goal.recurring_amount &&
                new Date(tx.date || tx.created_at).getMonth() === currentMonth &&
                new Date(tx.date || tx.created_at).getFullYear() === currentYear
            );

            if (!alreadyExists) {
                // Create Transaction
                await TransactionService.createTransaction({
                    name: `Goal Save: ${goal.goal_name}`,
                    amount: goal.recurring_amount,
                    category: 'investment',
                    type: 'expense',
                    date: new Date(currentYear, currentMonth, 1).toISOString(),
                    is_recurring: false
                });
                // Update Goal Saved
                await GoalService.updateGoal(goal.id, {
                    current_saved: goal.current_saved + goal.recurring_amount
                });
            }
        }

    } catch (error) {
        console.error('Error processing recurring transactions:', error);
    }
}

export async function getComprehensiveFinanceData() {
    try {
        // Run recurring processor first to ensure data is up to date
        await processRecurringTransactions();
        const [
            accounts,
            transactions,
            assets,
            liabilities,
            goals
        ] = await Promise.all([
            getAccounts(),
            getTransactions(),
            getAssets(),
            getLiabilities(),
            getGoals()
        ]);

        const actualSummary = calculateFinancialSummary(assets, liabilities, [], [], transactions);
        const expenseBreakdown = calculateExpenseBreakdown([], transactions);
        const assetAllocation = calculateAssetAllocation(assets);
        const incomeVsExpense = calculateIncomeVsExpense([], [], transactions);
        const netWorthTrend = calculateNetWorthTrend(assets, liabilities, [], [], transactions);
        const healthScore = calculateHealthScore(actualSummary, goals);
        const anomalies = detectSpendingAnomalies([], transactions);
        const goalFeasibilities = analyzeGoalFeasibility(goals, actualSummary.monthlySurplus);
        const insights = generateInsights(actualSummary, anomalies, goalFeasibilities, healthScore);

        return {
            accounts,
            transactions,
            assets,
            liabilities,
            goals,
            summary: actualSummary,
            expenseBreakdown,
            assetAllocation,
            incomeVsExpense,
            netWorthTrend,
            healthScore,
            anomalies,
            goalFeasibilities,
            insights
        };
    } catch (error) {
        console.error('Error fetching comprehensive finance data:', error);
        throw error;
    }
}
