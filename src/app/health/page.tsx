"use client";

import React, { useState, useEffect } from 'react';
import { Heart, Sparkles, TrendingUp, Shield, Zap, AlertTriangle, ArrowRight } from 'lucide-react';
import HealthScoreWidget from '@/frontend/components/finance/HealthScoreWidget';
import InsightCard from '@/frontend/components/finance/InsightCard';
import Button from '@/frontend/elements/buttons/Button';

export default function HealthPage() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/finance');
            const result = await response.json();
            if (result.success) {
                setData(result.data);
            }
        } catch (error) {
            console.error('Error fetching health data:', error);
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
                <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    const { healthScore, insights, summary } = data;

    return (
        <div className="min-h-screen px-4 sm:px-6 lg:pl-80 lg:pr-8 py-6 lg:py-8">
            <div className="max-w-7xl mx-auto space-y-10">
                {/* Header */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <Heart className="w-5 h-5 text-emerald-400" />
                            <span className="text-sm font-bold text-slate-400 tracking-wide uppercase">Financial Diagnosis</span>
                        </div>
                        <h1 className="text-5xl lg:text-7xl font-black text-liquid-gradient tracking-tighter">Health Score</h1>
                        <p className="text-slate-500 mt-3 font-semibold text-lg max-w-xl">
                            A holistic view of your financial stability and growth potential.
                        </p>
                    </div>
                </div>

                {/* Score Widget */}
                <HealthScoreWidget score={healthScore} />

                {/* Detailed Analysis */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    <div className="space-y-8">
                        <h3 className="text-2xl font-black text-slate-100 uppercase tracking-tight">Core Assessments</h3>
                        <div className="space-y-4">
                            {Object.entries(healthScore.breakdown).map(([key, item]: any) => (
                                <div key={key} className="frosted-glass p-6 rounded-[2rem] space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center text-emerald-400">
                                                <TrendingUp className="w-5 h-5" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="font-bold text-slate-200">{item.label}</span>
                                                <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">{item.rawValue}{item.unit} Value</span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-xl font-black text-white">{item.score}/100</span>
                                            <p className="text-[8px] font-black text-slate-600 uppercase tracking-tighter">Metric Score</p>
                                        </div>
                                    </div>
                                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-emerald-500 transition-all duration-1000 shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                                            style={{ width: `${item.score}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-8">
                        <h3 className="text-2xl font-black text-slate-100 uppercase tracking-tight">Prescribed Actions</h3>
                        <div className="space-y-4">
                            {healthScore.suggestions.map((suggestion: string, i: number) => (
                                <div key={i} className="p-6 rounded-[2rem] border border-white/5 bg-white/5 flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 flex-shrink-0">
                                        <Sparkles className="w-5 h-5" />
                                    </div>
                                    <p className="text-slate-300 font-medium leading-relaxed mt-2">{suggestion}</p>
                                </div>
                            ))}
                            {healthScore.suggestions.length === 0 && (
                                <div className="p-12 text-center frosted-glass rounded-[2rem]">
                                    <p className="text-slate-500 font-black uppercase tracking-widest">Your finances are in peak condition!</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Insights Section */}
                <div className="space-y-8 pt-10 border-t border-white/10">
                    <h3 className="text-2xl font-black text-slate-100 uppercase tracking-tight">Vital Insights</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {insights.map((insight: any) => (
                            <InsightCard key={insight.id} insight={insight} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
