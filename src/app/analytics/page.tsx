"use client";

import React, { useState, useEffect } from 'react';
import {
    PieChart,
    TrendingUp,
    TrendingDown,
    Calendar,
    Sparkles,
    Target,
    BarChart3,
    CreditCard
} from 'lucide-react';
import SummaryCard from '@/frontend/components/cards/SummaryCard';
import DashboardChart from '@/frontend/components/charts/DashboardChart';
import { getTransactions } from '@/app/actions/transactions';
import { getAccounts } from '@/app/actions/accounts';
import { getAssets } from '@/app/actions/assets';
import { getLiabilities } from '@/app/actions/liabilities';
import { getGoals } from '@/app/actions/goals';
import {
    calculateFinancialSummary,
    calculateExpenseBreakdown,
    calculateIncomeVsExpense,
    formatCurrency,
    formatCurrencyFull
} from '@/lib/financeEngine';

export default function AnalyticsPage() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [txs, accs, assets, libs, goals] = await Promise.all([
                getTransactions(),
                getAccounts(),
                getAssets(),
                getLiabilities(),
                getGoals()
            ]);

            const summary = calculateFinancialSummary(assets, libs, [], [], txs);
            const expenseBreakdown = calculateExpenseBreakdown([], txs);
            const incomeVsExpense = calculateIncomeVsExpense([], [], txs);

            setData({
                summary,
                expenseBreakdown,
                incomeVsExpense,
                transactions: txs
            });
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    if (loading || !data) {
        return (
            <div className="min-h-screen px-4 sm:px-6 lg:pl-80 lg:pr-8 py-6 lg:py-8 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 animate-pulse">Analyzing Wealth Patterns</p>
                </div>
            </div>
        );
    }

    const { summary, expenseBreakdown, incomeVsExpense } = data;

    // Use monthly income trend for the chart
    const chartData = incomeVsExpense.map((item: any) => ({
        name: item.month,
        value: item.income
    }));

    return (
        <div className="min-h-screen px-4 sm:px-6 lg:pl-80 lg:pr-8 py-6 lg:py-8">
            <div className="max-w-7xl mx-auto space-y-8 lg:space-y-10 animate-in fade-in duration-1000">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 sm:gap-6">
                    <div>
                        <div className="flex items-center gap-2 mb-2 lg:mb-3">
                            <PieChart className="w-4 h-4 lg:w-5 lg:h-5 text-emerald-400" />
                            <span className="text-xs lg:text-sm font-semibold text-slate-400 tracking-wide uppercase">Advanced Insights</span>
                        </div>
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-liquid-gradient tracking-tight">Analytics</h1>
                        <p className="text-slate-400 mt-2 lg:mt-3 font-medium text-sm lg:text-base">Deep dive into your financial habits and trends</p>
                    </div>
                </div>

                {/* Grid Summary */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                    <SummaryCard
                        title="Savings Rate"
                        value={`${summary.savingsRate}%`}
                        icon={Target}
                        variant="balance"
                        subtitle="Current Month"
                    />
                    <SummaryCard
                        title="Monthly Income"
                        value={formatCurrencyFull(summary.monthlyIncome)}
                        icon={TrendingUp}
                        variant="income"
                        subtitle="Synced Flow"
                    />
                    <SummaryCard
                        title="Monthly Expenses"
                        value={formatCurrencyFull(summary.monthlyExpenses)}
                        icon={TrendingDown}
                        variant="expense"
                        subtitle="Capital Outflow"
                    />
                    <SummaryCard
                        title="Debt-to-Income"
                        value={`${summary.debtToIncomeRatio}%`}
                        icon={Sparkles}
                        variant="balance"
                        subtitle="Liability Health"
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                    {/* Performance Chart */}
                    <div className="lg:col-span-2 frosted-glass p-6 lg:p-8 rounded-[2rem] lg:rounded-[2.5rem] liquid-glass-hover">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="text-xl lg:text-2xl font-black text-slate-100 tracking-tight uppercase">Financial Performance</h3>
                                <p className="text-xs lg:text-sm text-slate-500 mt-1 font-bold uppercase tracking-wider">Historical Income Trend</p>
                            </div>
                            <BarChart3 className="w-6 h-6 text-emerald-500 opacity-50" />
                        </div>
                        <DashboardChart title="" data={chartData} />
                    </div>

                    {/* Category Breakdown */}
                    <div className="frosted-glass p-6 lg:p-8 rounded-[2rem] lg:rounded-[2.5rem] liquid-glass-hover">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-xl lg:text-2xl font-black text-slate-100 tracking-tight uppercase">Top Categories</h3>
                            <CreditCard className="w-5 h-5 text-slate-500" />
                        </div>
                        <div className="space-y-6">
                            {expenseBreakdown.length === 0 ? (
                                <div className="py-20 flex flex-col items-center justify-center opacity-40">
                                    <Target className="w-10 h-10 mb-4" />
                                    <p className="text-xs font-black uppercase tracking-widest text-slate-500">No Expense Mapping</p>
                                </div>
                            ) : expenseBreakdown.slice(0, 5).map((item: any) => (
                                <div key={item.category} className="space-y-2">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="font-bold text-slate-300 uppercase tracking-tight">{item.category}</span>
                                        <span className="font-black text-emerald-400">{formatCurrency(item.amount)}</span>
                                    </div>
                                    <div className="h-2 w-full bg-slate-900/50 rounded-full overflow-hidden border border-white/5">
                                        <div
                                            className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.3)]"
                                            style={{
                                                width: `${item.percentage}%`,
                                                transition: 'width 1s ease-out'
                                            }}
                                        />
                                    </div>
                                    <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">{item.percentage}% of total spend</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
