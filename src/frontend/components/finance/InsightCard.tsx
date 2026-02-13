"use client";

import React from 'react';
import { FinancialInsight } from '@/types/finance';
import { AlertCircle, TrendingUp, TrendingDown, Info, Zap, Star } from 'lucide-react';

interface InsightCardProps {
    insight: FinancialInsight;
}

export default function InsightCard({ insight }: InsightCardProps) {
    const { type, title, message, metric, change } = insight;

    const styles = {
        positive: { bg: 'bg-emerald-500/5', border: 'border-emerald-500/10', icon: Star, color: 'text-emerald-400' },
        warning: { bg: 'bg-amber-500/5', border: 'border-amber-500/10', icon: AlertCircle, color: 'text-amber-400' },
        critical: { bg: 'bg-red-500/5', border: 'border-red-500/10', icon: Zap, color: 'text-red-400' },
        info: { bg: 'bg-blue-500/5', border: 'border-blue-500/10', icon: Info, color: 'text-blue-400' }
    };

    const style = styles[type];
    const Icon = style.icon;

    return (
        <div className={`p-6 rounded-[2rem] border ${style.bg} ${style.border} group transition-all duration-500 hover:scale-[1.02] relative overflow-hidden`}>
            {/* Animated background element */}
            <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full blur-3xl opacity-20 ${style.bg}`} />

            <div className="flex gap-5 relative z-10">
                <div className={`w-12 h-12 rounded-2xl flex-shrink-0 flex items-center justify-center bg-white/5 ${style.color}`}>
                    <Icon className="w-6 h-6" />
                </div>

                <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                        <h4 className={`font-bold tracking-tight ${style.color}`}>{title}</h4>
                        {metric && (
                            <span className="text-xs font-black px-2.5 py-1 rounded-full bg-white/5 text-slate-300">{metric}</span>
                        )}
                    </div>
                    <p className="text-sm text-slate-400 leading-relaxed font-medium">
                        {message}
                    </p>

                    {change !== undefined && (
                        <div className={`flex items-center gap-1.5 text-xs font-bold ${change > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                            {change > 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                            <span>{Math.abs(change)}% from avg</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
