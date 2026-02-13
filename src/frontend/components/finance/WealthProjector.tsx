"use client";

import React, { useState, useMemo } from 'react';
import { simulateWealthProjection, formatCurrency } from '@/lib/financeEngine';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';
import { Sparkles, TrendingUp, Info } from 'lucide-react';
import Button from '@/frontend/elements/buttons/Button';

interface WealthProjectorProps {
    defaultInitialAmount?: number;
    defaultMonthlySavings?: number;
}

export default function WealthProjector({
    defaultInitialAmount = 0,
    defaultMonthlySavings = 0
}: WealthProjectorProps) {
    const [monthlySavings, setMonthlySavings] = useState(defaultMonthlySavings || 25000);
    const [annualReturn, setAnnualReturn] = useState(12);
    const [duration, setDuration] = useState(10);
    const [initialAmount, setInitialAmount] = useState(defaultInitialAmount || 100000);

    const { projections, milestones } = useMemo(() =>
        simulateWealthProjection(monthlySavings, annualReturn, duration, initialAmount),
        [monthlySavings, annualReturn, duration, initialAmount]);

    const finalWealth = projections[projections.length - 1].projectedWealth;
    const totalInvested = projections[projections.length - 1].totalInvested;
    const totalReturns = finalWealth - totalInvested;

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Inputs */}
                <div className="frosted-glass p-8 rounded-[2.5rem] space-y-8">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-emerald-400" />
                        Simulation Inputs
                    </h3>

                    <div className="space-y-6">
                        <div className="space-y-3">
                            <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                                <span>Initial Capital</span>
                                <span className="text-emerald-400">₹{initialAmount.toLocaleString()}</span>
                            </div>
                            <input
                                type="range" min="0" max="1000000" step="10000"
                                value={initialAmount} onChange={(e) => setInitialAmount(Number(e.target.value))}
                                className="w-full h-1.5 bg-white/5 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                            />
                        </div>

                        <div className="space-y-3">
                            <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                                <span>Monthly Savings</span>
                                <span className="text-emerald-400">₹{monthlySavings.toLocaleString()}</span>
                            </div>
                            <input
                                type="range" min="1000" max="500000" step="1000"
                                value={monthlySavings} onChange={(e) => setMonthlySavings(Number(e.target.value))}
                                className="w-full h-1.5 bg-white/5 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                            />
                        </div>

                        <div className="space-y-3">
                            <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                                <span>Annual Returns</span>
                                <span className="text-emerald-400">{annualReturn}%</span>
                            </div>
                            <input
                                type="range" min="1" max="30" step="0.5"
                                value={annualReturn} onChange={(e) => setAnnualReturn(Number(e.target.value))}
                                className="w-full h-1.5 bg-white/5 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                            />
                        </div>

                        <div className="space-y-3">
                            <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                                <span>Duration</span>
                                <span className="text-emerald-400">{duration} Years</span>
                            </div>
                            <input
                                type="range" min="1" max="40" step="1"
                                value={duration} onChange={(e) => setDuration(Number(e.target.value))}
                                className="w-full h-1.5 bg-white/5 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                            />
                        </div>
                    </div>

                    <div className="pt-4">
                        <div className="p-4 rounded-[1.5rem] bg-emerald-500/5 border border-emerald-500/10 flex items-start gap-3">
                            <Info className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                            <p className="text-[10px] font-medium text-slate-400 leading-relaxed italic">
                                This simulation assumes fixed compounding. Actual market returns will vary. Past performance is not indicative of future results.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Graph */}
                <div className="lg:col-span-2 frosted-glass p-8 rounded-[2.5rem] space-y-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <h3 className="text-2xl font-black text-white">Wealth Trajectory</h3>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Projected growth over {duration} years</p>
                        </div>
                        <div className="text-right">
                            <span className="text-3xl font-black text-emerald-400">{formatCurrency(finalWealth)}</span>
                            <div className="flex items-center gap-1.5 justify-end text-[10px] font-black uppercase text-slate-500 mt-1">
                                <TrendingUp className="w-3 h-3 text-emerald-500" />
                                <span>ROI: {Math.round((totalReturns / totalInvested) * 100)}%</span>
                            </div>
                        </div>
                    </div>

                    <div className="h-[400px] w-full mt-8">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={projections}>
                                <defs>
                                    <linearGradient id="projGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
                                <XAxis
                                    dataKey="year"
                                    tickFormatter={(val) => `Yr ${val}`}
                                    stroke="rgba(255,255,255,0.1)" fontSize={10} fontWeight={700}
                                />
                                <YAxis
                                    tickFormatter={(val) => formatCurrency(val)}
                                    stroke="rgba(255,255,255,0.1)" fontSize={10} fontWeight={700}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'rgba(15, 23, 42, 0.9)',
                                        border: '1px solid rgba(255, 255, 255, 0.1)',
                                        borderRadius: '24px',
                                        padding: '16px',
                                        backdropFilter: 'blur(20px)'
                                    }}
                                    formatter={(val: any) => [formatCurrency(val), 'Projected Wealth']}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="projectedWealth"
                                    stroke="#10b981"
                                    strokeWidth={4}
                                    fill="url(#projGrad)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Milestones */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                {milestones.length > 0 ? milestones.map((m, i) => (
                    <div key={i} className="frosted-glass p-5 rounded-[2rem] flex flex-col items-center text-center space-y-3 hover:bg-white/5 transition-all">
                        <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                            <span className="text-xs font-black">{i + 1}</span>
                        </div>
                        <div>
                            <p className="text-sm font-black text-white">{m.label}</p>
                            <p className="text-[10px] font-bold text-slate-500 uppercase mt-1">{m.estimatedDate}</p>
                        </div>
                    </div>
                )) : (
                    <div className="col-span-full p-12 text-center text-slate-500 font-bold uppercase tracking-widest bg-white/5 rounded-[2rem]">
                        Simulate more savings to see milestones
                    </div>
                )}
            </div>
        </div>
    );
}
