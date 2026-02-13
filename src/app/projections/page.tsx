"use client";

import React from 'react';
import { Sparkles, TrendingUp, Info } from 'lucide-react';
import WealthProjector from '@/frontend/components/finance/WealthProjector';

export default function ProjectionsPage() {
    const [data, setData] = React.useState<any>(null);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/api/finance');
                const result = await response.json();
                if (result.success) {
                    setData(result.data);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading || !data) {
        return (
            <div className="min-h-screen px-4 sm:px-6 lg:pl-80 lg:pr-8 py-6 lg:py-8 flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen px-4 sm:px-6 lg:pl-80 lg:pr-8 py-6 lg:py-8">
            <div className="max-w-7xl mx-auto space-y-10">
                {/* Header */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <Sparkles className="w-5 h-5 text-emerald-400" />
                            <span className="text-sm font-bold text-slate-400 tracking-wide uppercase">Wealth Projection</span>
                        </div>
                        <h1 className="text-5xl lg:text-7xl font-black text-liquid-gradient tracking-tighter">Future Wealth</h1>
                        <p className="text-slate-500 mt-3 font-semibold text-lg max-w-xl">
                            Simulate your net worth growth based on savings and market returns.
                        </p>
                    </div>
                </div>

                <WealthProjector
                    defaultInitialAmount={data.summary.netWorth}
                    defaultMonthlySavings={data.summary.monthlySurplus}
                />
            </div>
        </div>
    );
}
