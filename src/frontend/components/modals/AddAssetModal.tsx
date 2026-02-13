"use client";

import React, { useState, useEffect } from 'react';
import { X, Type, Tag, Calendar, Database, FileText, Repeat } from 'lucide-react';
import Button from '@/frontend/elements/buttons/Button';
import Input from '@/frontend/elements/inputs/Input';
import { Asset, AssetType } from '@/types/finance';

interface AddAssetModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialData?: Asset | null;
}

const DEFAULT_STATE = {
    asset_name: '',
    asset_type: 'stocks' as AssetType,
    current_value: '',
    purchase_value: '',
    purchase_date: new Date().toISOString().split('T')[0],
    is_recurring: false,
    recurring_amount: '',
    notes: '',
};

const ASSET_TYPES: { value: AssetType; label: string }[] = [
    { value: 'gold', label: 'Gold' },
    { value: 'crypto', label: 'Crypto' },
    { value: 'stocks', label: 'Stocks' },
    { value: 'mutual_funds', label: 'Mutual Funds' },
    { value: 'property', label: 'Property' },
    { value: 'cash', label: 'Cash' },
    { value: 'fixed_deposit', label: 'Fixed Deposit' },
    { value: 'ppf', label: 'PPF' },
    { value: 'other', label: 'Other' },
];

export default function AddAssetModal({ isOpen, onClose, initialData }: AddAssetModalProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState(DEFAULT_STATE);

    // Sync state with initialData when modal opens
    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                setFormData({
                    asset_name: initialData.asset_name,
                    asset_type: initialData.asset_type,
                    current_value: initialData.current_value.toString(),
                    purchase_value: initialData.purchase_value.toString(),
                    purchase_date: initialData.purchase_date || new Date().toISOString().split('T')[0],
                    is_recurring: !!initialData.is_recurring,
                    recurring_amount: initialData.recurring_amount?.toString() || '',
                    notes: initialData.notes || '',
                });
            } else {
                setFormData(DEFAULT_STATE);
            }
        }
    }, [isOpen, initialData]);

    const handleClose = () => {
        setFormData(DEFAULT_STATE);
        onClose();
    };

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const data = {
                asset_name: formData.asset_name,
                asset_type: formData.asset_type,
                current_value: parseFloat(formData.current_value) || 0,
                purchase_value: parseFloat(formData.purchase_value) || 0,
                purchase_date: formData.purchase_date,
                is_recurring: formData.is_recurring,
                recurring_amount: formData.is_recurring ? (parseFloat(formData.recurring_amount) || 0) : undefined,
                notes: formData.notes,
            };

            const response = initialData
                ? await fetch(`/api/assets/${initialData.id}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                })
                : await fetch('/api/assets', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });

            const result = await response.json();

            if (result.success) {
                handleClose();
            } else {
                alert('Error: ' + result.error);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={handleClose} />
            <div className="relative w-full max-w-lg frosted-glass rounded-3xl p-8 border border-white/10 shadow-2xl animate-in zoom-in-95 fade-in duration-300 flex flex-col max-h-[90vh]">
                <div className="flex justify-between items-center mb-8 flex-shrink-0">
                    <div>
                        <h2 className="text-2xl font-black text-liquid-gradient uppercase tracking-tight">{initialData ? 'Update Asset' : 'Register Asset'}</h2>
                        <p className="text-white/40 text-sm italic">{initialData ? 'Keep your wealth data accurate.' : 'Inventory your wealth to track growth.'}</p>
                    </div>
                    <button onClick={handleClose} type="button" className="p-2 hover:bg-white/5 rounded-full text-white/40 hover:text-white transition-all">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <form className="flex flex-col flex-grow overflow-hidden" onSubmit={handleSubmit}>
                    <div className="flex-grow overflow-y-auto pr-2 custom-scrollbar space-y-6">
                        <Input
                            label="Asset Name"
                            placeholder="e.g. Reliance Stocks, My Gold, Bitcoin"
                            leftIcon={<Type className="w-4 h-4" />}
                            value={formData.asset_name}
                            onChange={(e) => setFormData({ ...formData, asset_name: e.target.value })}
                            required
                        />

                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-white/50 ml-1">Asset Category</label>
                            <div className="grid grid-cols-3 gap-2">
                                {ASSET_TYPES.slice(0, 9).map((type) => (
                                    <button
                                        key={type.value}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, asset_type: type.value })}
                                        className={`py-2 text-[10px] font-bold uppercase rounded-xl border transition-all ${formData.asset_type === type.value
                                            ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400'
                                            : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                                            }`}
                                    >
                                        {type.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                label="Current Value (₹)"
                                type="number"
                                placeholder="0.00"
                                leftIcon={<Database className="w-4 h-4" />}
                                value={formData.current_value}
                                onChange={(e) => setFormData({ ...formData, current_value: e.target.value })}
                                required
                            />
                            <Input
                                label="Purchase Price (₹)"
                                type="number"
                                placeholder="0.00"
                                leftIcon={<Tag className="w-4 h-4" />}
                                value={formData.purchase_value}
                                onChange={(e) => setFormData({ ...formData, purchase_value: e.target.value })}
                                required
                            />
                        </div>

                        <Input
                            label="Purchase Date"
                            type="date"
                            leftIcon={<Calendar className="w-4 h-4" />}
                            value={formData.purchase_date}
                            onChange={(e) => setFormData({ ...formData, purchase_date: e.target.value })}
                        />

                        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                                        <Repeat className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-200">Set as Recurring SIP</p>
                                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">Auto-invest every month</p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, is_recurring: !formData.is_recurring })}
                                    className={`w-12 h-6 rounded-full transition-all relative ${formData.is_recurring ? 'bg-emerald-500' : 'bg-white/10'}`}
                                >
                                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${formData.is_recurring ? 'left-7' : 'left-1'}`} />
                                </button>
                            </div>

                            {formData.is_recurring && (
                                <div className="pt-2 animate-in slide-in-from-top-2 duration-300">
                                    <Input
                                        label="Monthly Investment Amount (₹)"
                                        type="number"
                                        placeholder="0.00"
                                        leftIcon={<Database className="w-4 h-4" />}
                                        value={formData.recurring_amount}
                                        onChange={(e) => setFormData({ ...formData, recurring_amount: e.target.value })}
                                        required={formData.is_recurring}
                                    />
                                </div>
                            )}
                        </div>

                        <Input
                            label="Notes"
                            placeholder="Optional additional details..."
                            leftIcon={<FileText className="w-4 h-4" />}
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        />
                    </div>

                    <div className="pt-6 flex gap-3 flex-shrink-0">
                        <Button variant="ghost" type="button" className="flex-1" onClick={handleClose}>Cancel</Button>
                        <Button variant="primary" type="submit" className="flex-1 shadow-emerald-500/20" isLoading={loading}>
                            {initialData ? 'Update Asset' : 'Save Asset'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
