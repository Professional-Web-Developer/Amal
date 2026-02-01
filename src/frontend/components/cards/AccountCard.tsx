"use client";

import React from 'react';
import {
    CreditCard,
    Building2,
    Wallet,
    TrendingUp,
    MoreVertical
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export type AccountType = 'bank' | 'credit' | 'cash' | 'investment';

interface AccountCardProps {
    name: string;
    type: AccountType;
    balance: number;
    accountNumber?: string;
    bankName?: string;
    className?: string;
}

export default function AccountCard({
    name,
    type,
    balance,
    accountNumber,
    bankName,
    className
}: AccountCardProps) {
    const icons = {
        bank: Building2,
        credit: CreditCard,
        cash: Wallet,
        investment: TrendingUp,
    };

    const Icon = icons[type];

    const gradients = {
        bank: 'from-emerald-500 via-teal-500 to-cyan-500',
        credit: 'from-teal-500 via-cyan-500 to-blue-500',
        cash: 'from-emerald-500 to-green-500',
        investment: 'from-cyan-500 via-blue-500 to-indigo-500',
    };

    return (
        <div className={cn(
            "frosted-glass liquid-glass-hover p-8 rounded-[2.5rem] relative overflow-hidden group",
            className
        )}>
            {/* Subtle animated liquid gradient orb */}
            <div className={cn(
                "absolute -top-20 -right-20 w-48 h-48 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-all duration-1000",
                `bg-gradient-to-br ${gradients[type]}`
            )} />

            <div className="flex justify-between items-start mb-10 relative z-10">
                <div className="flex items-center gap-4">
                    <div className={cn(
                        "w-16 h-16 rounded-2xl bg-gradient-to-br text-white flex items-center justify-center shadow-xl group-hover:scale-105 transition-all duration-500",
                        gradients[type]
                    )}>
                        <Icon className="w-8 h-8" strokeWidth={2.5} />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg text-slate-100 tracking-tight group-hover:text-liquid-gradient transition-all duration-500">
                            {name}
                        </h3>
                        <p className="text-sm text-slate-400 font-medium mt-0.5">
                            {bankName || type}
                        </p>
                    </div>
                </div>
                <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/5 transition-all duration-300 active:scale-95">
                    <MoreVertical className="w-5 h-5 text-slate-400 hover:text-slate-200 transition-colors" />
                </button>
            </div>

            <div className="relative z-10 mb-8">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Balance</p>
                <h2 className="text-5xl font-bold text-slate-100 tracking-tight group-hover:scale-[1.02] transition-transform duration-500 origin-left">
                    ${balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </h2>
            </div>

            <div className="pt-6 border-t border-white/5 flex justify-between items-center relative z-10">
                <p className="font-mono text-sm text-slate-400 tracking-wider">
                    •••• {accountNumber?.slice(-4) || '6421'}
                </p>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/50 animate-pulse" />
                    <p className="text-xs font-bold text-emerald-400 uppercase">Active</p>
                </div>
            </div>

            {/* Bottom gradient accent */}
            <div className={cn(
                "absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500",
            )} />
        </div>
    );
}
