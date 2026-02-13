"use client";

import React, { useState, useEffect } from 'react';
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  Plus,
  Sparkles,
  ArrowRight,
  PieChart,
  Target,
  Zap,
  Shield,
  Activity,
  Layers,
  Layout,
  Repeat
} from 'lucide-react';
import Link from 'next/link';

import Button from '@/frontend/elements/buttons/Button';
import SummaryCard from '@/frontend/components/cards/SummaryCard';
import DashboardChart from '@/frontend/components/charts/DashboardChart';
import AddTransactionModal from '@/frontend/components/modals/AddTransactionModal';
import HealthScoreWidget from '@/frontend/components/finance/HealthScoreWidget';
import GoalCard from '@/frontend/components/finance/GoalCard';
import InsightCard from '@/frontend/components/finance/InsightCard';
import RemindersWidget from '@/frontend/components/finance/RemindersWidget';
import { getComprehensiveFinanceData } from '@/app/actions/finance';
import { formatCurrency, formatCurrencyFull } from '@/lib/financeEngine';

export default function Dashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'clean' | 'pro'>('clean');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await getComprehensiveFinanceData();
      setData(result);
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-black uppercase tracking-[0.3em] text-slate-500 animate-pulse">Syncing Financial Universe</p>
        </div>
      </div>
    );
  }

  const { summary, insights, healthScore, goalFeasibilities, netWorthTrend, expenseBreakdown, transactions, goals, liabilities, assets } = data;

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:pl-80 lg:pr-8 py-6 lg:py-8">
      <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in duration-1000">

        {/* Header Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-emerald-400" />
              <span className="text-sm font-bold text-slate-400 tracking-wide uppercase">Unified Command Center</span>
            </div>
            <h1 className="text-5xl lg:text-7xl font-black text-liquid-gradient tracking-tighter">Finance OS</h1>
            <p className="text-slate-500 mt-3 font-semibold text-lg max-w-xl">
              Complete visibility over your assets, liabilities, and financial health.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 w-full lg:w-auto">
            <div className="p-1.5 rounded-2xl bg-white/5 border border-white/5 flex gap-1">
              <button
                onClick={() => setViewMode('clean')}
                className={`px-4 py-2 rounded-xl text-xs font-black uppercase transition-all flex items-center gap-2 ${viewMode === 'clean' ? 'bg-emerald-500 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
              >
                <Layout className="w-3.5 h-3.5" />
                Clean
              </button>
              <button
                onClick={() => setViewMode('pro')}
                className={`px-4 py-2 rounded-xl text-xs font-black uppercase transition-all flex items-center gap-2 ${viewMode === 'pro' ? 'bg-emerald-500 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
              >
                <Layers className="w-3.5 h-3.5" />
                Pro
              </button>
            </div>

            <Button
              variant="primary"
              size="md"
              leftIcon={<Plus className="w-5 h-5" />}
              onClick={() => setIsModalOpen(true)}
              className="flex-1 lg:flex-none shadow-emerald-500/20"
            >
              Sync Wealth Flow
            </Button>
          </div>
        </div>

        {/* Top Section / Quick View */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <SummaryCard
            title="Net Worth"
            value={formatCurrencyFull(summary.netWorth)}
            icon={Shield}
            variant="balance"
            trend={summary.trends.netWorth}
            subtitle={`${assets.length} Active Assets`}
          />
          <SummaryCard
            title="Monthly Income"
            value={formatCurrencyFull(summary.monthlyIncome)}
            icon={TrendingUp}
            variant="income"
            trend={summary.trends.income}
            subtitle="Synced from transactions"
          />
          <SummaryCard
            title="Monthly Expenses"
            value={formatCurrencyFull(summary.monthlyExpenses)}
            icon={TrendingDown}
            variant="expense"
            trend={summary.trends.expenses}
            subtitle={`Outflow from ${transactions.filter((t: any) => t.type === 'expense').length} items`}
          />
          <SummaryCard
            title="Monthly Surplus"
            value={formatCurrencyFull(summary.monthlySurplus)}
            icon={Zap}
            variant="income"
            trend={summary.trends.surplus}
            subtitle={`${summary.savingsRate}% Savings Rate`}
          />
        </div>

        {/* Pro Mode Exclusive Metrics */}
        {viewMode === 'pro' && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 animate-in slide-in-from-top-4 duration-500">
            <div className="frosted-glass p-5 rounded-3xl border border-emerald-500/10 hover:bg-white/5 transition-all group">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Savings Rate</p>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-black text-emerald-400">{summary.savingsRate}%</span>
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <div className="h-1 w-full bg-white/5 rounded-full mt-3 overflow-hidden">
                <div className="h-full bg-emerald-500 transition-all duration-1000" style={{ width: `${Math.min(100, summary.savingsRate * 2)}%` }} />
              </div>
            </div>
            <div className="frosted-glass p-5 rounded-3xl border border-blue-500/10 hover:bg-white/5 transition-all group">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Expense Ratio</p>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-black text-blue-400">{summary.expenseRatio}%</span>
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              </div>
              <div className="h-1 w-full bg-white/5 rounded-full mt-3 overflow-hidden">
                <div className="h-full bg-blue-500 transition-all duration-1000" style={{ width: `${summary.expenseRatio}%` }} />
              </div>
            </div>
            <div className="frosted-glass p-5 rounded-3xl border border-amber-500/10 hover:bg-white/5 transition-all group">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Debt-to-Income</p>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-black text-amber-400">{summary.debtToIncomeRatio}%</span>
                <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              </div>
              <div className="h-1 w-full bg-white/5 rounded-full mt-3 overflow-hidden">
                <div className="h-full bg-amber-500 transition-all duration-1000" style={{ width: `${Math.min(100, summary.debtToIncomeRatio * 2)}%` }} />
              </div>
            </div>
            <div className="frosted-glass p-5 rounded-3xl border border-teal-500/10 hover:bg-white/5 transition-all group">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Emergency Fund</p>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-black text-teal-400">{summary.emergencyFundCoverage}m</span>
                <div className="w-1.5 h-1.5 rounded-full bg-teal-500" />
              </div>
              <div className="h-1 w-full bg-white/5 rounded-full mt-3 overflow-hidden">
                <div className="h-full bg-teal-500 transition-all duration-1000" style={{ width: `${Math.min(100, summary.emergencyFundCoverage * 15)}%` }} />
              </div>
            </div>
          </div>
        )}

        {/* Health Score Main Section */}
        <HealthScoreWidget score={healthScore} />

        {/* Chart and Insights Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Main Trend Chart */}
            <div className="frosted-glass p-8 rounded-[2.5rem] liquid-glass-hover">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
                <div>
                  <h3 className="text-2xl font-black text-slate-100 tracking-tight">Wealth Momentum</h3>
                  <p className="text-xs font-bold text-slate-500 mt-1 uppercase tracking-widest">Growth over last 6 months</p>
                </div>
              </div>
              <div className="h-[350px] w-full">
                <DashboardChart title="" data={netWorthTrend.map((t: any) => ({ name: t.month, value: t.netWorth }))} />
              </div>
            </div>

            {/* Recent Transaction Activity */}
            <div className="frosted-glass p-8 rounded-[2.5rem]">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-black text-slate-100 tracking-tight uppercase">Wealth Flow</h3>
                <Link href="/transactions" className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-emerald-400 transition-all group">
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
              <div className="space-y-4">
                {transactions.slice(0, 5).map((tx: any) => (
                  <div key={tx.id} className="flex items-center justify-between group cursor-pointer hover:bg-white/5 p-4 rounded-2xl transition-all">
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="w-11 h-11 rounded-xl bg-white/5 flex items-center justify-center text-lg group-hover:scale-110 transition-transform flex-shrink-0">
                        {tx.icon || (tx.type === 'income' ? '💰' : '💸')}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-slate-100 text-sm truncate uppercase tracking-tight">{tx.name}</p>
                        <div className="flex items-center gap-2">
                          <p className="text-[9px] text-slate-500 font-black uppercase mt-0.5 truncate tracking-[0.1em]">{tx.category}</p>
                          {tx.is_recurring && <Repeat className="w-2.5 h-2.5 text-emerald-500" />}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-black text-base ${tx.type === 'income' ? 'text-emerald-400' : 'text-slate-300'}`}>
                        {tx.type === 'income' ? '+' : '−'}{formatCurrency(tx.amount)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Smart Insights Panel */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex items-center justify-between px-2">
                <h3 className="text-xl font-black text-slate-100 uppercase tracking-tight flex items-center gap-2">
                  <Activity className="w-5 h-5 text-emerald-400" />
                  Wealth AI
                </h3>
                <span className="px-2 py-1 rounded-lg bg-emerald-500/10 text-[10px] font-black text-emerald-400 uppercase tracking-widest">Active</span>
              </div>
              <div className="grid grid-cols-1 gap-4">
                {insights.slice(0, 3).map((insight: any) => (
                  <InsightCard key={insight.id} insight={insight} />
                ))}
              </div>
            </div>

            {/* Reminders Widget */}
            <RemindersWidget
              liabilities={liabilities}
              transactions={transactions}
              assets={assets}
              goals={goals}
            />
          </div>
        </div>

        {/* Goals Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-2xl font-black text-slate-100 uppercase tracking-tight flex items-center gap-2">
              <Target className="w-6 h-6 text-emerald-400" />
              Financial Ambitions
            </h3>
            <Link href="/goals" className="text-xs font-bold text-emerald-400 hover:underline">View All Goals</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {goals.slice(0, 3).map((goal: any, idx: number) => (
              <GoalCard key={goal.id} goal={goal} feasibility={goalFeasibilities[idx]} />
            ))}
            <Link href="/goals" className="border-2 border-dashed border-white/5 rounded-[2rem] p-8 flex flex-col items-center justify-center gap-4 hover:border-emerald-500/20 hover:bg-white/5 transition-all group">
              <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-slate-500 group-hover:text-emerald-400 transition-colors">
                <Plus className="w-6 h-6" />
              </div>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-500 group-hover:text-slate-300">New Financial Goal</p>
            </Link>
          </div>
        </div>

      </div>

      <AddTransactionModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          fetchData();
        }}
      />
    </div>
  );
}
