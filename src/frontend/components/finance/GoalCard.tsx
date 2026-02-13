"use client";

import React from 'react';
import { FinancialGoal, GoalFeasibility } from '@/types/finance';
import { Target, Calendar, ArrowRight, TrendingUp, AlertCircle, Edit2 } from 'lucide-react';
import { formatCurrencyFull } from '@/lib/financeEngine';

interface GoalCardProps {
    goal: FinancialGoal;
    feasibility?: GoalFeasibility;
    onEdit?: (goal: FinancialGoal) => void;
}

export default function GoalCard({ goal, feasibility, onEdit }: GoalCardProps) {
    const { goal_name, target_amount, current_saved, target_date, goal_category } = goal;
    const progress = Math.min(100, (current_saved / target_amount) * 100);

    return (
        <div className="frosted-glass p-6 rounded-[2rem] liquid-glass-hover group relative overflow-hidden">
            <div className="flex flex-col h-full space-y-6 relative z-10">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
                            <Target className="w-6 h-6" />
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-100 group-hover:text-emerald-400 transition-colors uppercase tracking-tight">{goal_name}</h4>
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{goal_category.replace('_', ' ')}</span>
                        </div>
                    </div>
                    {onEdit && (
                        <button
                            onClick={() => onEdit(goal)}
                            className="p-2 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 text-slate-400 hover:text-white transition-all"
                        >
                            <Edit2 className="w-4 h-4" />
                        </button>
                    )}
                </div>

                <div className="space-y-4">
                    <div className="flex justify-between items-end">
                        <div className="space-y-1">
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Progress</p>
                            <p className="text-lg font-black text-slate-100">{progress.toFixed(1)}%</p>
                        </div>
                        <div className="text-right space-y-1">
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Remaining</p>
                            <p className="text-sm font-bold text-slate-400">{formatCurrencyFull(target_amount - current_saved)}</p>
                        </div>
                    </div>

                    <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                        <div
                            className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-1000 ease-out relative"
                            style={{ width: `${progress}%` }}
                        >
                            <div className="absolute inset-0 liquid-shimmer opacity-40" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-2">
                        <div className="flex items-center gap-2 text-slate-400">
                            <Calendar className="w-3.5 h-3.5" />
                            <span className="text-xs font-semibold">{new Date(target_date).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-100 justify-end">
                            <span className="text-xs font-bold">{formatCurrencyFull(target_amount)}</span>
                        </div>
                    </div>
                </div>

                {feasibility && (
                    <div className={`mt-auto p-4 rounded-2xl border ${feasibility.isFeasible ? 'bg-emerald-500/5 border-emerald-500/10' : 'bg-red-500/5 border-red-500/10'}`}>
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Monthly Plan</span>
                            {feasibility.isFeasible ? (
                                <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                                <AlertCircle className="w-3.5 h-3.5 text-red-400" />
                            )}
                        </div>
                        <p className="text-xs font-bold text-slate-300">
                            Save <span className={feasibility.isFeasible ? 'text-emerald-400' : 'text-red-400'}>₹{feasibility.requiredMonthlySavings.toLocaleString()}</span> / month
                        </p>
                        {!feasibility.isFeasible && (
                            <p className="text-[10px] text-red-400/60 mt-1 font-semibold italic">Requires extra surplus</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
