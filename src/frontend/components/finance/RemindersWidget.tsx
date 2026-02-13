"use client";

import React from 'react';
import { Calendar, Bell, ArrowRight, CreditCard, Repeat, AlertCircle, Target } from 'lucide-react';
import { formatCurrency } from '@/lib/financeEngine';
import { Liability, Transaction, Asset, FinancialGoal } from '@/types/finance';

interface Reminder {
    id: string;
    title: string;
    amount: number;
    date: string;
    type: 'emi' | 'subscription' | 'recurring' | 'sip' | 'goal';
    daysLeft: number;
}

interface RemindersWidgetProps {
    liabilities?: Liability[];
    transactions?: Transaction[];
    assets?: Asset[];
    goals?: FinancialGoal[];
}

export default function RemindersWidget({
    liabilities = [],
    transactions = [],
    assets = [],
    goals = []
}: RemindersWidgetProps) {
    const liabilityReminders: Reminder[] = liabilities.map(lib => {
        const dueDate = new Date(lib.due_date);
        const now = new Date();
        const diffTime = dueDate.getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        return {
            id: lib.id,
            title: lib.name,
            amount: lib.emi_amount,
            date: lib.due_date,
            type: 'emi' as const,
            daysLeft: Math.max(0, diffDays)
        };
    });

    const recurringReminders: Reminder[] = transactions
        .filter(tx => tx.is_recurring)
        .map(tx => {
            // Find the date for this month
            const now = new Date();
            const originalDate = new Date(tx.date || tx.created_at);
            const dueDate = new Date(now.getFullYear(), now.getMonth(), originalDate.getDate());

            // If the date passed already this month, show next month
            if (dueDate < now) {
                dueDate.setMonth(dueDate.getMonth() + 1);
            }

            const diffTime = dueDate.getTime() - now.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            return {
                id: `recurring-${tx.id}`,
                title: tx.name,
                amount: tx.amount,
                date: dueDate.toISOString(),
                type: 'recurring' as const,
                daysLeft: Math.max(0, diffDays)
            };
        });

    const sipReminders: Reminder[] = assets
        .filter(asset => asset.is_recurring && asset.recurring_amount)
        .map(asset => {
            const now = new Date();
            // Default to 1st of next month for SIPs
            const dueDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);
            const diffTime = dueDate.getTime() - now.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            return {
                id: `sip-${asset.id}`,
                title: `SIP: ${asset.asset_name}`,
                amount: asset.recurring_amount || 0,
                date: dueDate.toISOString(),
                type: 'sip' as const,
                daysLeft: Math.max(0, diffDays)
            };
        });

    const goalReminders: Reminder[] = goals
        .filter(goal => goal.is_recurring && goal.recurring_amount)
        .map(goal => {
            const now = new Date();
            // Default to 1st of next month for Goal savings
            const dueDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);
            const diffTime = dueDate.getTime() - now.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            return {
                id: `goal-${goal.id}`,
                title: `Goal: ${goal.goal_name}`,
                amount: goal.recurring_amount || 0,
                date: dueDate.toISOString(),
                type: 'goal' as const,
                daysLeft: Math.max(0, diffDays)
            };
        });

    const reminders = [...liabilityReminders, ...recurringReminders, ...sipReminders, ...goalReminders]
        .sort((a, b) => a.daysLeft - b.daysLeft)
        .slice(0, 5);

    // If no liabilities, provide an empty state or very minimal helpful message
    if (reminders.length === 0) {
        return (
            <div className="frosted-glass p-8 rounded-[2.5rem] space-y-8">
                <div className="flex items-center justify-between">
                    <h3 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-2">
                        <Bell className="w-5 h-5 text-amber-400" />
                        Upcoming Actions
                    </h3>
                </div>
                <div className="flex flex-col items-center justify-center py-8 text-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-slate-500">
                        <Calendar className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-slate-300 uppercase tracking-tight">All caught up!</p>
                        <p className="text-[10px] font-bold text-slate-500 uppercase mt-1">No upcoming EMIs or bills detected.</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="frosted-glass p-8 rounded-[2.5rem] space-y-8">
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-2">
                    <Bell className="w-5 h-5 text-amber-400" />
                    Upcoming Actions
                </h3>
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{reminders.length} Pending</span>
            </div>

            <div className="space-y-4">
                {reminders.map((reminder) => (
                    <div key={reminder.id} className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-amber-500/20 transition-all group flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${reminder.type === 'emi' ? 'bg-red-500/10 text-red-400' :
                                    reminder.type === 'subscription' ? 'bg-blue-500/10 text-blue-400' :
                                        'bg-emerald-500/10 text-emerald-400'
                                }`}>
                                {reminder.type === 'emi' ? <CreditCard className="w-5 h-5" /> :
                                    reminder.type === 'sip' || reminder.type === 'recurring' || reminder.type === 'subscription' ? <Repeat className="w-5 h-5" /> :
                                        <Target className="w-5 h-5" />}
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-100 uppercase tracking-tight">{reminder.title}</p>
                                <p className="text-[10px] font-bold text-slate-500 uppercase mt-0.5">
                                    {reminder.daysLeft === 0 ? 'Due Today' : `Due in ${reminder.daysLeft} days`}
                                </p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-sm font-black text-slate-200">{formatCurrency(reminder.amount)}</p>
                            <div className="flex items-center gap-1 justify-end mt-1 text-[9px] font-black uppercase tracking-widest">
                                <span className={reminder.daysLeft <= 2 ? 'text-red-400' : 'text-slate-500'}>
                                    {new Date(reminder.date).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <button className="w-full p-4 rounded-xl border border-white/5 bg-white/5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-emerald-400 hover:border-emerald-500/20 transition-all flex items-center justify-center gap-2 group">
                Automation Dashboard
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
        </div>
    );
}
