"use client";

import React from 'react';
import { FinancialHealthScore } from '@/types/finance';
import { Shield, TrendingUp, AlertTriangle, Zap, Target } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface HealthScoreWidgetProps {
    score: FinancialHealthScore;
}

export default function HealthScoreWidget({ score }: HealthScoreWidgetProps) {
    const { totalScore, riskLevel, riskColor, breakdown, suggestions } = score;

    const getIcon = (label: string) => {
        switch (label) {
            case 'Savings Rate': return TrendingUp;
            case 'Debt-to-Income': return Shield;
            case 'Emergency Fund': return Zap;
            case 'Expense Control': return AlertTriangle;
            case 'Goal Progress': return Target;
            default: return Shield;
        }
    };

    return (
        <div className="frosted-glass p-8 rounded-[2.5rem] relative overflow-hidden group">
            <div className="flex flex-col lg:flex-row gap-10 items-center">
                {/* Score Circle */}
                <div className="relative w-48 h-48 flex-shrink-0">
                    <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
                        {/* Track */}
                        <circle
                            cx="50"
                            cy="50"
                            r="45"
                            fill="transparent"
                            stroke="rgba(255,255,255,0.05)"
                            strokeWidth="8"
                        />
                        {/* Progress */}
                        <circle
                            cx="50"
                            cy="50"
                            r="45"
                            fill="transparent"
                            stroke={riskColor}
                            strokeWidth="8"
                            strokeDasharray="282.7"
                            strokeDashoffset={282.7 - (282.7 * totalScore) / 100}
                            strokeLinecap="round"
                            className="transition-all duration-1000 ease-out"
                        />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-5xl font-black text-white">{totalScore}</span>
                        <span className="text-[10px] font-black uppercase tracking-widest opacity-40 mt-1">Health Score</span>
                    </div>
                    {/* Pulsing Outer Glow */}
                    <div
                        className="absolute inset-0 rounded-full blur-2xl opacity-20 animate-pulse"
                        style={{ backgroundColor: riskColor }}
                    />
                </div>

                {/* Info & Breakdown */}
                <div className="flex-1 space-y-6">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: riskColor }} />
                            <h3 className="text-2xl font-bold text-white capitalize">{riskLevel} Financial Health</h3>
                        </div>
                        <p className="text-slate-400 text-sm leading-relaxed max-w-md">
                            Your financial posture is {riskLevel}. {suggestions[0] || 'Keep monitoring your metrics to stay on track.'}
                        </p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {Object.entries(breakdown).map(([key, item]) => {
                            const Icon = getIcon(item.label);
                            return (
                                <div key={key} className="p-4 rounded-3xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Icon className="w-4 h-4 text-emerald-400" />
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{item.label}</span>
                                    </div>
                                    <div className="flex items-end justify-between">
                                        <span className="text-xl font-black text-slate-100">{item.rawValue}{item.unit}</span>
                                        <div className="w-12 h-1 bg-white/5 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-emerald-500 rounded-full"
                                                style={{ width: `${item.score}%` }}
                                            />
                                        </div>
                                    </div>
                                    <p className="text-[9px] font-bold text-slate-600 uppercase mt-1 tracking-tighter">Score: {item.score}/100</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
