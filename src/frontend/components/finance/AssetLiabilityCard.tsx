"use client";

import React from 'react';
import { Asset, Liability } from '@/types/finance';
import { Wallet, Landmark, TrendingUp, TrendingDown, Calendar, Percent, Edit2, Trash2 } from 'lucide-react';
import { formatCurrencyFull } from '@/lib/financeEngine';

interface AssetLiabilityCardProps {
    item: Asset | Liability;
    type: 'asset' | 'liability';
    onEdit?: (item: Asset | Liability) => void;
    onDelete?: (id: string) => void;
}

export default function AssetLiabilityCard({ item, type, onEdit, onDelete }: AssetLiabilityCardProps) {
    const isAsset = type === 'asset';
    const asset = item as Asset;
    const liability = item as Liability;

    return (
        <div className="frosted-glass p-6 rounded-[2rem] liquid-glass-hover group transition-all duration-500">
            <div className="flex flex-col space-y-6">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg ${isAsset ? 'bg-gradient-to-br from-emerald-500 to-teal-500' : 'bg-gradient-to-br from-red-500 to-rose-600'
                            }`}>
                            {isAsset ? <TrendingUp className="w-6 h-6" /> : <TrendingDown className="w-6 h-6" />}
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-100 group-hover:text-emerald-400 transition-colors tracking-tight uppercase">
                                {isAsset ? asset.asset_name : liability.name}
                            </h4>
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                                {isAsset ? asset.asset_type.replace('_', ' ') : liability.type.replace('_', ' ')}
                            </span>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        {onEdit && (
                            <button
                                onClick={() => onEdit(item)}
                                className="p-2 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 text-slate-400 hover:text-white transition-all"
                            >
                                <Edit2 className="w-4 h-4" />
                            </button>
                        )}
                        {onDelete && (
                            <button
                                onClick={() => {
                                    if (confirm(`Are you sure you want to delete this ${type}?`)) {
                                        onDelete(item.id.toString());
                                    }
                                }}
                                className="p-2 rounded-xl bg-white/5 border border-red-500/10 hover:bg-red-500/10 hover:border-red-500/20 text-slate-400 hover:text-red-400 transition-all"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex justify-between items-end">
                        <div className="space-y-1">
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                                {isAsset ? 'Current Value' : 'Outstanding'}
                            </p>
                            <p className={`text-2xl font-black ${isAsset ? 'text-slate-100' : 'text-slate-100'}`}>
                                {formatCurrencyFull(isAsset ? asset.current_value : liability.outstanding_amount)}
                            </p>
                        </div>
                        {!isAsset && (
                            <div className="text-right space-y-1">
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Interest</p>
                                <p className="text-sm font-bold text-red-400">{liability.interest_rate}% APR</p>
                            </div>
                        )}
                    </div>

                    <div className="pt-4 border-t border-white/5 grid grid-cols-2 gap-4">
                        {isAsset ? (
                            <>
                                <div className="space-y-1">
                                    <p className="text-[9px] font-black text-slate-500 uppercase">Purchase</p>
                                    <p className="text-xs font-bold text-slate-300">{formatCurrencyFull(asset.purchase_value)}</p>
                                </div>
                                <div className="space-y-1 text-right">
                                    <p className="text-[9px] font-black text-slate-500 uppercase">Growth</p>
                                    <p className={`text-xs font-bold ${asset.current_value >= asset.purchase_value ? 'text-emerald-400' : 'text-red-400'}`}>
                                        {((asset.current_value - asset.purchase_value) / asset.purchase_value * 100).toFixed(1)}%
                                    </p>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="space-y-1">
                                    <p className="text-[9px] font-black text-slate-500 uppercase">EMI</p>
                                    <p className="text-xs font-bold text-slate-300">{formatCurrencyFull(liability.emi_amount)}</p>
                                </div>
                                <div className="space-y-1 text-right">
                                    <p className="text-[9px] font-black text-slate-500 uppercase">Due</p>
                                    <p className="text-xs font-bold text-slate-400">
                                        {new Date(liability.due_date).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}
                                    </p>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
