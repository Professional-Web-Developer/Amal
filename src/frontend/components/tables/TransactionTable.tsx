"use client";

import React from 'react';
import Badge from '@/frontend/elements/badges/Badge';
import { MoreVertical, Sparkles, Repeat, Trash2 } from 'lucide-react';

export interface Transaction {
    id: string | number;
    name: string;
    category: string;
    amount: number;
    date: string;
    status: 'completed' | 'pending' | 'failed';
    type: 'income' | 'expense';
    icon?: string;
    is_recurring?: boolean;
}

interface TransactionTableProps {
    transactions: Transaction[];
    onDelete?: (id: string) => void;
}

export default function TransactionTable({ transactions, onDelete }: TransactionTableProps) {
    return (
        <div className="glass-card rounded-[2.5rem] overflow-hidden mac-shadow">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-black/5 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02]">
                            <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-[#86868b]">Transaction</th>
                            <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-[#86868b]">Category</th>
                            <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-[#86868b]">Date</th>
                            <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-[#86868b] text-right">Amount</th>
                            <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-[#86868b] text-center">Status</th>
                            <th className="px-8 py-5"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-black/[0.03] dark:divide-white/[0.05]">
                        {transactions.map((tx, index) => (
                            <tr
                                key={tx.id}
                                className="group hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-all duration-300"
                                style={{ animationDelay: `${index * 50}ms` }}
                            >
                                <td className="px-8 py-5">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 rounded-2xl glass-card flex items-center justify-center text-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 relative overflow-hidden">
                                            <div className="absolute inset-0 bg-gradient-to-br from-[#007AFF]/10 to-[#5856D6]/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            <span className="relative z-10">{tx.icon || (tx.type === 'income' ? '💰' : '💸')}</span>
                                        </div>
                                        <div>
                                            <p className="font-bold text-foreground text-sm tracking-tight group-hover:text-[#007AFF] transition-colors">
                                                {tx.name}
                                            </p>
                                            <p className="text-xs text-[#86868b] font-semibold uppercase tracking-wider mt-1 flex items-center gap-1.5">
                                                {tx.type === 'income' && <Sparkles className="w-3 h-3 text-[#34C759]" />}
                                                {tx.type}
                                                {tx.is_recurring && <Repeat className="w-3 h-3 text-emerald-500" />}
                                            </p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-5">
                                    <span className="text-sm font-semibold text-[#86868b] uppercase tracking-tight">
                                        {tx.category}
                                    </span>
                                </td>
                                <td className="px-8 py-5">
                                    <span className="text-sm font-medium text-[#86868b]">{tx.date}</span>
                                </td>
                                <td className="px-8 py-5 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <span className={`font-bold tracking-tight text-lg transition-all group-hover:scale-105 ${tx.type === 'income' ? 'text-[#34C759]' : 'text-foreground'
                                            }`}>
                                            {tx.type === 'income' ? '+' : '−'}${Math.abs(tx.amount).toLocaleString()}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-8 py-5">
                                    <div className="flex justify-center">
                                        <Badge variant={tx.status === 'completed' ? 'success' : tx.status === 'pending' ? 'warning' : 'error'}>
                                            {tx.status}
                                        </Badge>
                                    </div>
                                </td>
                                <td className="px-8 py-5 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button className="p-3 text-[#86868b] hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5 rounded-xl transition-all active:scale-95">
                                            <MoreVertical className="w-4 h-4" />
                                        </button>
                                        {onDelete && (
                                            <button
                                                onClick={() => {
                                                    if (confirm('Are you sure you want to delete this transaction?')) {
                                                        onDelete(tx.id.toString());
                                                    }
                                                }}
                                                className="p-3 text-red-500/50 hover:text-red-500 hover:bg-red-500/5 rounded-xl transition-all active:scale-95"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
