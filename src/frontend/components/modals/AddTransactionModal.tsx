"use client";

import React, { useState } from 'react';
import { X, DollarSign, Tag, Calendar, Type } from 'lucide-react';
import Button from '@/frontend/elements/buttons/Button';
import Input from '@/frontend/elements/inputs/Input';
import { createTransaction } from '@/app/actions/transactions';

interface AddTransactionModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AddTransactionModal({ isOpen, onClose }: AddTransactionModalProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        amount: '',
        category: '',
        type: 'expense' as 'income' | 'expense',
    });

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const result = await createTransaction({
                name: formData.name,
                amount: parseFloat(formData.amount) || 0,
                category: formData.category,
                type: formData.type,
            });

            if (result.success) {
                setFormData({ name: '', amount: '', category: '', type: 'expense' });
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
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative w-full max-w-lg glass-card rounded-3xl p-8 border border-white/10 shadow-2xl animate-in zoom-in-95 fade-in duration-300">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-2xl font-black text-gradient">New Transaction</h2>
                        <p className="text-white/40 text-sm italic">Tracking every penny helps you grow.</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/5 rounded-full text-white/40 hover:text-white transition-all"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 gap-6">
                        <Input
                            label="Transaction Name"
                            placeholder="e.g. Starbucks, Salary, Rent"
                            leftIcon={<Type className="w-4 h-4" />}
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                label="Amount"
                                type="number"
                                placeholder="0.00"
                                leftIcon={<DollarSign className="w-4 h-4" />}
                                value={formData.amount}
                                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                required
                            />
                            <Input
                                label="Date"
                                type="date"
                                leftIcon={<Calendar className="w-4 h-4" />}
                                defaultValue={new Date().toISOString().split('T')[0]}
                            />
                        </div>

                        <Input
                            label="Category"
                            placeholder="Food, Housing, Tech..."
                            leftIcon={<Tag className="w-4 h-4" />}
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            required
                        />

                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-white/50 ml-1">Type</label>
                            <div className="flex gap-4">
                                <label className="flex-1 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="type"
                                        className="hidden peer"
                                        checked={formData.type === 'expense'}
                                        onChange={() => setFormData({ ...formData, type: 'expense' })}
                                    />
                                    <div className="w-full py-4 text-center rounded-xl border border-white/10 bg-white/5 peer-checked:bg-rose-500/10 peer-checked:border-rose-500/50 peer-checked:text-rose-400 transition-all font-bold">
                                        Expense
                                    </div>
                                </label>
                                <label className="flex-1 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="type"
                                        className="hidden peer"
                                        checked={formData.type === 'income'}
                                        onChange={() => setFormData({ ...formData, type: 'income' })}
                                    />
                                    <div className="w-full py-4 text-center rounded-xl border border-white/10 bg-white/5 peer-checked:bg-emerald-500/10 peer-checked:border-emerald-500/50 peer-checked:text-emerald-400 transition-all font-bold">
                                        Income
                                    </div>
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 flex gap-3">
                        <Button variant="ghost" type="button" className="flex-1" onClick={onClose}>Cancel</Button>
                        <Button variant="primary" type="submit" className="flex-1 shadow-indigo-500/20" isLoading={loading}>
                            Save Transaction
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
