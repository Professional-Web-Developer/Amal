"use client";

import React, { useState, useEffect } from 'react';
import { TrendingUp, Plus, Sparkles, Filter, Search } from 'lucide-react';
import Button from '@/frontend/elements/buttons/Button';
import Input from '@/frontend/elements/inputs/Input';
import AssetLiabilityCard from '@/frontend/components/finance/AssetLiabilityCard';
import AddAssetModal from '@/frontend/components/modals/AddAssetModal';
import { getAssets } from '@/app/actions/assets';
import { Asset } from '@/types/finance';
import { formatCurrencyFull } from '@/lib/financeEngine';

export default function AssetsPage() {
    const [assets, setAssets] = useState<Asset[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAsset, setEditingAsset] = useState<Asset | null>(null);

    const fetchData = async () => {
        setLoading(true);
        const data = await getAssets();
        setAssets(data);
        setLoading(false);
    };

    const handleEdit = (asset: any) => {
        setEditingAsset(asset);
        setIsModalOpen(true);
    };

    const handleOpenAdd = () => {
        setEditingAsset(null);
        setIsModalOpen(true);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const filteredAssets = assets.filter(a =>
        a.asset_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.asset_type.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalAssetsValue = assets.reduce((sum, a) => sum + a.current_value, 0);

    return (
        <div className="min-h-screen px-4 sm:px-6 lg:pl-80 lg:pr-8 py-6 lg:py-8">
            <div className="max-w-7xl mx-auto space-y-10">
                {/* Header */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <TrendingUp className="w-5 h-5 text-emerald-400" />
                            <span className="text-sm font-bold text-slate-400 tracking-wide uppercase">Wealth Inventory</span>
                        </div>
                        <h1 className="text-5xl lg:text-7xl font-black text-liquid-gradient tracking-tighter">Your Assets</h1>
                        <p className="text-slate-500 mt-3 font-semibold text-lg max-w-xl">
                            Everything you own, from gold to digital assets.
                        </p>
                    </div>
                    <Button
                        variant="primary"
                        size="md"
                        leftIcon={<Plus className="w-5 h-5" />}
                        className="w-full lg:w-auto shadow-emerald-500/20"
                        onClick={handleOpenAdd}
                    >
                        Register Asset
                    </Button>
                </div>

                {/* Filter & Search */}
                <div className="flex flex-col md:flex-row gap-4 items-center">
                    <div className="relative flex-1 group w-full">
                        <Input
                            placeholder="Search your portfolio..."
                            leftIcon={<Search className="w-4 h-4" />}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2 w-full md:w-auto">
                        <Button variant="glass" size="md" className="flex-1 md:flex-none">
                            <Filter className="w-4 h-4" />
                            Filter
                        </Button>
                        <div className="px-6 py-3 rounded-2xl bg-white/5 border border-white/5 flex flex-col justify-center min-w-[150px]">
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Total Value</span>
                            <span className="text-xl font-black text-emerald-400">{formatCurrencyFull(totalAssetsValue)}</span>
                        </div>
                    </div>
                </div>

                {/* Assets Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-64 rounded-[2rem] bg-white/5 animate-pulse" />
                        ))}
                    </div>
                ) : filteredAssets.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredAssets.map(asset => (
                            <AssetLiabilityCard
                                key={asset.id}
                                item={asset}
                                type="asset"
                                onEdit={handleEdit}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-24 frosted-glass rounded-[3rem]">
                        <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6">
                            <TrendingUp className="w-10 h-10 text-slate-600" />
                        </div>
                        <h2 className="text-2xl font-black text-slate-300">No assets found</h2>
                        <p className="text-slate-500 mt-2 font-bold">Start tracking your wealth by adding your first asset.</p>
                        <Button variant="ghost" className="mt-8 mx-auto" onClick={handleOpenAdd}>Register Asset</Button>
                    </div>
                )}

                <AddAssetModal
                    isOpen={isModalOpen}
                    initialData={editingAsset}
                    onClose={() => {
                        setIsModalOpen(false);
                        setEditingAsset(null);
                        fetchData();
                    }}
                />
            </div>
        </div>
    );
}
