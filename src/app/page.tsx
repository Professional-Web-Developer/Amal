"use client";

import React, { useState, useEffect } from 'react';
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  Plus,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';

import Button from '@/frontend/elements/buttons/Button';
import SummaryCard from '@/frontend/components/cards/SummaryCard';
import DashboardChart from '@/frontend/components/charts/DashboardChart';
import AddTransactionModal from '@/frontend/components/modals/AddTransactionModal';
import { getAccounts } from '@/app/actions/accounts';
import { getTransactions } from '@/app/actions/transactions';

export default function Dashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    const [accData, txData] = await Promise.all([
      getAccounts(),
      getTransactions()
    ]);
    setAccounts(accData);
    setTransactions(txData);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const totalBalance = accounts.reduce((sum, a) => sum + parseFloat(a.balance), 0);

  const monthlyIncome = transactions
    .filter(tx => tx.type === 'income')
    .reduce((sum, tx) => sum + parseFloat(tx.amount), 0);

  const monthlyExpenses = transactions
    .filter(tx => tx.type === 'expense')
    .reduce((sum, tx) => sum + parseFloat(tx.amount), 0);

  const chartData = [
    { name: 'Jan', value: 2400 },
    { name: 'Feb', value: 1398 },
    { name: 'Mar', value: 9800 },
    { name: 'Apr', value: 3908 },
    { name: 'May', value: 4800 },
    { name: 'Jun', value: 3800 },
    { name: 'Jul', value: totalBalance || 4300 },
  ];

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:pl-80 lg:pr-8 py-6 lg:py-8">
      <div className="max-w-7xl mx-auto space-y-8 lg:space-y-10 animate-in fade-in duration-1000">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 sm:gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2 lg:mb-3">
              <Sparkles className="w-4 h-4 lg:w-5 lg:h-5 text-emerald-400" />
              <span className="text-xs lg:text-sm font-semibold text-slate-400 tracking-wide">Financial Overview</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-liquid-gradient tracking-tight">Dashboard</h1>
            <p className="text-slate-400 mt-2 lg:mt-3 font-medium text-sm lg:text-base">Track your wealth flow in real-time</p>
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
            <Button variant="glass" size="md" className="flex-1 sm:flex-none">
              <TrendingUp className="w-4 h-4" />
              <span className="hidden sm:inline">Reports</span>
            </Button>
            <Button
              variant="primary"
              size="md"
              leftIcon={<Plus className="w-4 h-4 lg:w-5 lg:h-5" />}
              onClick={() => setIsModalOpen(true)}
              className="flex-1 sm:flex-none"
            >
              Add Transaction
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          <SummaryCard
            title="Total Balance"
            value={`$${totalBalance.toLocaleString()}`}
            icon={Wallet}
            variant="balance"
            trend={{ value: "12.5%", isUp: true }}
            subtitle="Across all accounts"
          />
          <SummaryCard
            title="Monthly Income"
            value={`$${monthlyIncome.toLocaleString()}`}
            icon={TrendingUp}
            variant="income"
            trend={{ value: "8.2%", isUp: true }}
            subtitle="Last 30 days"
          />
          <SummaryCard
            title="Monthly Expenses"
            value={`$${monthlyExpenses.toLocaleString()}`}
            icon={TrendingDown}
            variant="expense"
            trend={{ value: "3.1%", isUp: false }}
            subtitle="Optimized spending"
            className="sm:col-span-2 lg:col-span-1"
          />
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Chart Section */}
          <div className="lg:col-span-2 frosted-glass p-6 lg:p-8 rounded-[2rem] lg:rounded-[2.5rem] liquid-glass-hover">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 lg:mb-8 gap-4">
              <div>
                <h3 className="text-xl lg:text-2xl font-bold text-slate-100 tracking-tight">Cash Flow</h3>
                <p className="text-xs lg:text-sm text-slate-400 mt-1 font-medium">Your financial growth trajectory</p>
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                {['7D', '1M', '3M', '1Y'].map((range) => (
                  <button key={range} className="flex-1 sm:flex-none px-3 py-1.5 text-xs font-bold rounded-full hover:bg-emerald-500/10 text-slate-400 hover:text-emerald-400 transition-all">
                    {range}
                  </button>
                ))}
              </div>
            </div>
            <DashboardChart title="" data={chartData} />
          </div>

          {/* Recent Activity */}
          <div className="frosted-glass p-6 lg:p-8 rounded-[2rem] lg:rounded-[2.5rem] flex flex-col liquid-glass-hover">
            <div className="flex items-center justify-between mb-6 lg:mb-8">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <h3 className="text-lg lg:text-xl font-bold text-slate-100 tracking-tight">Live Activity</h3>
              </div>
              <Link href="/transactions" className="p-2 rounded-full hover:bg-emerald-500/10 transition-all group">
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-400 transition-all group-hover:translate-x-1" />
              </Link>
            </div>

            <div className="space-y-4 lg:space-y-5 flex-1 overflow-y-auto">
              {loading ? (
                <div className="flex flex-col items-center justify-center h-40">
                  <div className="w-8 h-8 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin mb-3" />
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Loading</p>
                </div>
              ) : transactions.length === 0 ? (
                <div className="text-slate-500 text-sm text-center p-8">No recent transactions</div>
              ) : transactions.slice(0, 6).map((tx) => (
                <div key={tx.id} className="flex items-center justify-between group cursor-pointer hover:bg-white/5 p-3 -m-3 rounded-2xl transition-all">
                  <div className="flex items-center gap-3 lg:gap-4 min-w-0">
                    <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-2xl frosted-glass flex items-center justify-center text-lg lg:text-xl group-hover:scale-110 transition-transform flex-shrink-0">
                      {tx.icon || (tx.type === 'income' ? '💰' : '💸')}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-slate-100 text-sm truncate">{tx.name}</p>
                      <p className="text-xs text-slate-500 font-semibold uppercase mt-0.5 truncate">{tx.category}</p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 ml-2">
                    <p className={`font-bold text-sm lg:text-base ${tx.type === 'income' ? 'text-emerald-400' : 'text-slate-300'}`}>
                      {tx.type === 'income' ? '+' : '−'}${Math.abs(parseFloat(tx.amount)).toLocaleString()}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5 hidden sm:block">
                      {new Date(tx.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
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
