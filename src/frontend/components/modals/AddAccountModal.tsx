"use client";

import React, { useState } from 'react';
import { X, Building2, CreditCard, Wallet, Landmark } from 'lucide-react';
import Button from '@/frontend/elements/buttons/Button';
import Input from '@/frontend/elements/inputs/Input';
import { createAccount } from '@/app/actions/accounts';

interface AddAccountModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AddAccountModal({ isOpen, onClose }: AddAccountModalProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        type: 'bank',
        balance: '',
        bank_name: '',
    });

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const result = await createAccount({
                name: formData.name,
                type: formData.type,
                balance: parseFloat(formData.balance) || 0,
                bank_name: formData.bank_name,
            });

            if (result.success) {
                setFormData({ name: '', type: 'bank', balance: '', bank_name: '' });
                onClose();
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
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
                onClick={onClose}
            />

            <div className="relative w-full max-w-lg glass-card rounded-3xl p-8 border border-white/10 shadow-2xl animate-in zoom-in-95 fade-in duration-300">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-2xl font-black text-gradient">Add New Account</h2>
                        <p className="text-white/40 text-sm italic">Connect your assets to see the full picture.</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/5 rounded-full text-white/40 hover:text-white transition-all"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-white/50 ml-1">Account Type</label>
                        <div className="grid grid-cols-4 gap-3">
                            {[
                                { id: 'bank', icon: Landmark, label: 'Bank' },
                                { id: 'credit', icon: CreditCard, label: 'Credit' },
                                { id: 'cash', icon: Wallet, label: 'Cash' },
                                { id: 'invest', icon: Building2, label: 'Invest' },
                            ].map((item) => (
                                <label key={item.id} className="cursor-pointer group">
                                    <input
                                        type="radio"
                                        name="accountType"
                                        className="hidden peer"
                                        checked={formData.type === item.id}
                                        onChange={() => setFormData({ ...formData, type: item.id })}
                                    />
                                    <div className="flex flex-col items-center gap-2 p-3 rounded-2xl border border-white/10 bg-white/5 peer-checked:bg-indigo-500/10 peer-checked:border-indigo-500/50 peer-checked:text-indigo-400 transition-all hover:bg-white/10">
                                        <item.icon className="w-6 h-6" />
                                        <span className="text-[10px] font-bold uppercase tracking-wider">{item.label}</span>
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>

                    <Input
                        label="Account Name"
                        placeholder="e.g. Chase Checkings, Personal Savings"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Starting Balance"
                            type="number"
                            placeholder="0.00"
                            value={formData.balance}
                            onChange={(e) => setFormData({ ...formData, balance: e.target.value })}
                            required
                        />
                        <Input
                            label="Bank/Institution"
                            placeholder="e.g. JPMorgan Chase"
                            value={formData.bank_name}
                            onChange={(e) => setFormData({ ...formData, bank_name: e.target.value })}
                        />
                    </div>

                    <div className="pt-4 flex gap-3">
                        <Button variant="ghost" type="button" className="flex-1" onClick={onClose}>Cancel</Button>
                        <Button variant="primary" type="submit" className="flex-1 shadow-indigo-500/20" isLoading={loading}>
                            Add Account
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
