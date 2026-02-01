"use client";

import React from 'react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';

interface ChartData {
    name: string;
    value: number;
}

interface DashboardChartProps {
    title: string;
    data: ChartData[];
    height?: number;
}

export default function DashboardChart({
    title,
    data,
    height = 300
}: DashboardChartProps) {
    return (
        <div className="w-full">
            {title && (
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-xl font-bold text-slate-100">{title}</h3>
                </div>
            )}
            <div style={{ height: `${height}px` }} className="w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="colorEmerald" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
                        <XAxis
                            dataKey="name"
                            stroke="#475569"
                            fontSize={11}
                            fontWeight={600}
                            tickLine={false}
                            axisLine={false}
                            dy={10}
                        />
                        <YAxis
                            stroke="#475569"
                            fontSize={11}
                            fontWeight={600}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => `$${value}`}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'rgba(15, 23, 42, 0.8)',
                                border: '1px solid rgba(255, 255, 255, 0.08)',
                                borderRadius: '16px',
                                color: '#f1f5f9',
                                backdropFilter: 'blur(20px)',
                                boxShadow: '0 10px 40px rgba(0,0,0,0.5)'
                            }}
                            itemStyle={{
                                color: '#10b981',
                                fontWeight: 'bold',
                                fontSize: '13px'
                            }}
                            labelStyle={{
                                color: '#94a3b8',
                                marginBottom: '4px',
                                fontWeight: 'semibold',
                                fontSize: '11px',
                                textTransform: 'uppercase'
                            }}
                            cursor={{ stroke: 'rgba(16, 185, 129, 0.2)', strokeWidth: 2 }}
                        />
                        <Area
                            type="monotone"
                            dataKey="value"
                            stroke="#10b981"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorEmerald)"
                            animationDuration={2000}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
