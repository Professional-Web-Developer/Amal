"use client";

import React, { useState, useEffect } from 'react';
import { TrendingDown, Plus, Shield, Filter, Search, AlertCircle } from 'lucide-react';
import Button from '@/frontend/elements/buttons/Button';
import Input from '@/frontend/elements/inputs/Input';
import AssetLiabilityCard from '@/frontend/components/finance/AssetLiabilityCard';
import AddLiabilityModal from '@/frontend/components/modals/AddLiabilityModal';
import { getLiabilities } from '@/app/actions/liabilities';
import { Liability } from '@/types/finance';
import { formatCurrencyFull } from '@/lib/financeEngine';

export default function LiabilitiesPage() {
    const [liabilities, setLiabilities] = useState<Liability[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingLiability, setEditingLiability] = useState<Liability | null>(null);

    const fetchData = async () => {
        setLoading(true);
        const data = await getLiabilities();
        setLiabilities(data);
        setLoading(false);
    };

    const handleEdit = (liability: any) => {
        setEditingLiability(liability);
        setIsModalOpen(true);
    };

    const handleOpenAdd = () => {
        setEditingLiability(null);
        setIsModalOpen(true);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const filteredLiabilities = liabilities.filter(l =>
        l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.type.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalLiabilitiesValue = liabilities.reduce((sum, l) => sum + l.outstanding_amount, 0);

    return (
        <div className="min-h-screen px-4 sm:px-6 lg:pl-80 lg:pr-8 py-6 lg:py-8">
            <div className="max-w-7xl mx-auto space-y-10">
                {/* Header */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <TrendingDown className="w-5 h-5 text-red-400" />
                            <span className="text-sm font-bold text-slate-400 tracking-wide uppercase">Debt Tracking</span>
                        </div>
                        <h1 className="text-5xl lg:text-7xl font-black text-liquid-gradient tracking-tighter">Liabilities</h1>
                        <p className="text-slate-500 mt-3 font-semibold text-lg max-w-xl">
                            Track your loans, EMIs, and credit dues to plan your payoff.
                        </p>
                    </div>
                    <Button
                        variant="primary"
                        size="md"
                        leftIcon={<Plus className="w-5 h-5" />}
                        className="w-full lg:w-auto shadow-rose-500/20 bg-gradient-to-r from-rose-500 to-red-600"
                        onClick={handleOpenAdd}
                    >
                        Register Liability
                    </Button>
                </div>

                {/* Filter & Search */}
                <div className="flex flex-col md:flex-row gap-4 items-center">
                    <div className="relative flex-1 group w-full">
                        <Input
                            placeholder="Search your liabilities..."
                            leftIcon={<Search className="w-4 h-4" />}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2 w-full md:w-auto">
                        <div className="px-6 py-3 rounded-2xl bg-white/5 border border-white/5 flex flex-col justify-center min-w-[150px]">
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Total Debt</span>
                            <span className="text-xl font-black text-red-400">{formatCurrencyFull(totalLiabilitiesValue)}</span>
                        </div>
                    </div>
                </div>

                {/* Alert for high debt */}
                {totalLiabilitiesValue > 0 && (
                    <div className="p-6 rounded-[2rem] bg-amber-500/5 border border-amber-500/10 flex items-center gap-4 animate-in fade-in slide-in-from-top-4 duration-700">
                        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500 flex-shrink-0">
                            <AlertCircle className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm font-black text-slate-200 uppercase tracking-tight">Financial Warning</p>
                            <p className="text-xs font-bold text-slate-400 mt-1">
                                You have {liabilities.length} active liabilities. Prioritize high-interest debts to improve your Financial Health Score.
                            </p>
                        </div>
                        <Button variant="ghost" size="sm" className="ml-auto hidden sm:flex text-amber-400 border-amber-500/20">Payoff Strategy</Button>
                    </div>
                )}

                {/* Liabilities Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2].map(i => (
                            <div key={i} className="h-64 rounded-[2rem] bg-white/5 animate-pulse" />
                        ))}
                    </div>
                ) : filteredLiabilities.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredLiabilities.map(liability => (
                            <AssetLiabilityCard
                                key={liability.id}
                                item={liability}
                                type="liability"
                                onEdit={handleEdit}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-24 frosted-glass rounded-[3rem]">
                        <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6">
                            <Shield className="w-10 h-10 text-slate-600" />
                        </div>
                        <h2 className="text-2xl font-black text-slate-300">Debt-Free!</h2>
                        <p className="text-slate-500 mt-2 font-bold">You don't have any registered liabilities. Keep it up!</p>
                        <Button variant="ghost" className="mt-8 mx-auto" onClick={handleOpenAdd}>Add Liability</Button>
                    </div>
                )}

                <AddLiabilityModal
                    isOpen={isModalOpen}
                    initialData={editingLiability}
                    onClose={() => {
                        setIsModalOpen(false);
                        setEditingLiability(null);
                        fetchData();
                    }}
                />
            </div>
        </div>
    );
}
