"use client";

import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface SummaryCardProps {
    title: string;
    value: string;
    icon: LucideIcon;
    trend?: {
        value: string;
        isUp: boolean;
    };
    subtitle?: string;
    variant?: 'balance' | 'income' | 'expense';
    className?: string;
}

export default function SummaryCard({
    title,
    value,
    icon: Icon,
    trend,
    subtitle,
    variant = 'balance',
    className
}: SummaryCardProps) {
    const variantStyles = {
        balance: {
            gradient: 'from-emerald-500/15 via-teal-500/15 to-cyan-500/15',
            iconBg: 'bg-gradient-to-br from-emerald-500 to-teal-500',
            glow: 'shadow-emerald-500/15'
        },
        income: {
            gradient: 'from-emerald-500/15 to-green-500/15',
            iconBg: 'bg-gradient-to-br from-emerald-500 to-green-500',
            glow: 'shadow-emerald-500/15'
        },
        expense: {
            gradient: 'from-cyan-500/15 to-blue-500/15',
            iconBg: 'bg-gradient-to-br from-cyan-500 to-blue-500',
            glow: 'shadow-cyan-500/15'
        }
    };

    const styles = variantStyles[variant];

    return (
        <div className={cn(
            "frosted-glass liquid-glass-hover p-8 rounded-[2rem] group relative overflow-hidden",
            className
        )}>
            {/* Subtle liquid gradient background */}
            <div className={cn(
                "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-3xl",
                styles.gradient
            )} />

            <div className="flex flex-col space-y-6 relative z-10">
                <div className="flex items-center justify-between">
                    <div className={cn(
                        "w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg transition-all duration-500 group-hover:scale-105",
                        styles.iconBg,
                        styles.glow
                    )}>
                        <Icon className="w-7 h-7" strokeWidth={2.5} />
                    </div>
                    {trend && (
                        <div className={cn(
                            "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold backdrop-blur-sm",
                            trend.isUp
                                ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/25"
                                : "bg-cyan-500/15 text-cyan-400 border border-cyan-500/25"
                        )}>
                            {trend.isUp ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                            <span>{trend.value}</span>
                        </div>
                    )}
                </div>

                <div>
                    <p className="text-sm font-medium text-slate-400 tracking-tight mb-2">{title}</p>
                    <h2 className="text-4xl font-bold text-slate-100 tracking-tight group-hover:text-liquid-gradient transition-all duration-500">
                        {value}
                    </h2>
                    {subtitle && (
                        <p className="text-xs font-medium text-slate-500 mt-3 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            {subtitle}
                        </p>
                    )}
                </div>
            </div>

            {/* Bottom glow line */}
            <div className={cn(
                "absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            )} />
        </div>
    );
}
