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

export default function AnalyticsPage() {
    const [transactions, setTransactions] = useState<any[]>([]);
    const [accounts, setAccounts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const [txData, accData] = await Promise.all([
                getTransactions(),
                getAccounts()
            ]);
            setTransactions(txData);
            setAccounts(accData);
            setLoading(false);
        };
        fetchData();
    }, []);

    const totalIncome = transactions
        .filter(tx => tx.type === 'income')
        .reduce((sum, tx) => sum + parseFloat(tx.amount), 0);

    const totalExpenses = transactions
        .filter(tx => tx.type === 'expense')
        .reduce((sum, tx) => sum + parseFloat(tx.amount), 0);

    const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;

    // Categories Breakdown (simplified)
    const categoryBreakdown = transactions
        .filter(tx => tx.type === 'expense')
        .reduce((acc: any, tx) => {
            acc[tx.category] = (acc[tx.category] || 0) + Math.abs(parseFloat(tx.amount));
            return acc;
        }, {});

    const sortedCategories = Object.entries(categoryBreakdown)
        .sort(([, a]: any, [, b]: any) => b - a)
        .slice(0, 5);

    const chartData = [
        { name: 'Week 1', value: 1200 },
        { name: 'Week 2', value: 1900 },
        { name: 'Week 3', value: 1500 },
        { name: 'Week 4', value: totalIncome || 2400 },
    ];

    return (
        <div className="min-h-screen px-4 sm:px-6 lg:pl-80 lg:pr-8 py-6 lg:py-8">
            <div className="max-w-7xl mx-auto space-y-8 lg:space-y-10 animate-in fade-in duration-1000">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 sm:gap-6">
                    <div>
                        <div className="flex items-center gap-2 mb-2 lg:mb-3">
                            <PieChart className="w-4 h-4 lg:w-5 lg:h-5 text-emerald-400" />
                            <span className="text-xs lg:text-sm font-semibold text-slate-400 tracking-wide">Advanced Insights</span>
                        </div>
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-liquid-gradient tracking-tight">Analytics</h1>
                        <p className="text-slate-400 mt-2 lg:mt-3 font-medium text-sm lg:text-base">Deep dive into your financial habits and trends</p>
                    </div>
                </div>

                {/* Grid Summary */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                    <SummaryCard
                        title="Savings Rate"
                        value={`${savingsRate.toFixed(1)}%`}
                        icon={Target}
                        variant="balance"
                        subtitle="Current month"
                    />
                    <SummaryCard
                        title="Total Income"
                        value={`$${totalIncome.toLocaleString()}`}
                        icon={TrendingUp}
                        variant="income"
                        subtitle="Growth tracking"
                    />
                    <SummaryCard
                        title="Total Expenses"
                        value={`$${totalExpenses.toLocaleString()}`}
                        icon={TrendingDown}
                        variant="expense"
                        subtitle="Expense control"
                    />
                    <SummaryCard
                        title="Projected"
                        value={`$${(totalIncome * 1.1).toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
                        icon={Sparkles}
                        variant="balance"
                        subtitle="Next month est."
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                    {/* Performance Chart */}
                    <div className="lg:col-span-2 frosted-glass p-6 lg:p-8 rounded-[2rem] lg:rounded-[2.5rem] liquid-glass-hover">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="text-xl lg:text-2xl font-bold text-slate-100 tracking-tight">Financial Performance</h3>
                                <p className="text-xs lg:text-sm text-slate-400 mt-1 font-medium">Income vs Time Analysis</p>
                            </div>
                            <BarChart3 className="w-6 h-6 text-emerald-500 opacity-50" />
                        </div>
                        <DashboardChart title="" data={chartData} />
                    </div>

                    {/* Category Breakdown */}
                    <div className="frosted-glass p-6 lg:p-8 rounded-[2rem] lg:rounded-[2.5rem] liquid-glass-hover">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-xl lg:text-2xl font-bold text-slate-100 tracking-tight">Top Categories</h3>
                            <CreditCard className="w-5 h-5 text-slate-500" />
                        </div>
                        <div className="space-y-6">
                            {loading ? (
                                <div className="py-20 flex flex-col items-center justify-center">
                                    <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4" />
                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Processing</p>
                                </div>
                            ) : sortedCategories.length === 0 ? (
                                <p className="text-center text-slate-500 py-10">No expense data found</p>
                            ) : sortedCategories.map(([category, amount]: any, index) => (
                                <div key={category} className="space-y-2">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="font-bold text-slate-300">{category}</span>
                                        <span className="font-bold text-emerald-400">${amount.toLocaleString()}</span>
                                    </div>
                                    <div className="h-2 w-full bg-slate-900/50 rounded-full overflow-hidden border border-white/5">
                                        <div
                                            className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"
                                            style={{
                                                width: `${(amount / totalExpenses) * 100}%`,
                                                transition: 'width 1s ease-out'
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
