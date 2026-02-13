"use client";

import React, { useState, useEffect } from 'react';
import { X, Type, Tag, Calendar, Shield, CreditCard, FileText, Repeat } from 'lucide-react';
import Button from '@/frontend/elements/buttons/Button';
import Input from '@/frontend/elements/inputs/Input';
import { createLiability, updateLiability } from '@/app/actions/liabilities';
import { Liability, LiabilityType } from '@/types/finance';

interface AddLiabilityModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialData?: Liability | null;
}

const LIABILITY_TYPES: { value: LiabilityType; label: string }[] = [
    { value: 'personal_loan', label: 'Personal Loan' },
    { value: 'home_loan', label: 'Home Loan' },
    { value: 'car_loan', label: 'Car Loan' },
    { value: 'education_loan', label: 'Education Loan' },
    { value: 'emi', label: 'EMI / Installment' },
    { value: 'credit_card', label: 'Credit Card Due' },
    { value: 'other', label: 'Other' },
];

const DEFAULT_STATE = {
    name: '',
    type: 'personal_loan' as LiabilityType,
    outstanding_amount: '',
    original_amount: '',
    interest_rate: '',
    emi_amount: '',
    due_date: new Date().toISOString().split('T')[0],
    start_date: new Date().toISOString().split('T')[0],
    is_recurring: true,
    notes: '',
};

export default function AddLiabilityModal({ isOpen, onClose, initialData }: AddLiabilityModalProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState(DEFAULT_STATE);

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                setFormData({
                    name: initialData.name,
                    type: initialData.type,
                    outstanding_amount: initialData.outstanding_amount.toString(),
                    original_amount: initialData.original_amount.toString(),
                    interest_rate: initialData.interest_rate.toString(),
                    emi_amount: initialData.emi_amount.toString(),
                    due_date: initialData.due_date || new Date().toISOString().split('T')[0],
                    start_date: initialData.start_date || new Date().toISOString().split('T')[0],
                    is_recurring: !!initialData.is_recurring,
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
                name: formData.name,
                type: formData.type,
                outstanding_amount: parseFloat(formData.outstanding_amount) || 0,
                original_amount: parseFloat(formData.original_amount) || 0,
                interest_rate: parseFloat(formData.interest_rate) || 0,
                emi_amount: parseFloat(formData.emi_amount) || 0,
                due_date: formData.due_date,
                start_date: formData.start_date,
                is_recurring: formData.is_recurring,
                notes: formData.notes,
            };

            const result = initialData
                ? await updateLiability(initialData.id, data)
                : await createLiability(data);

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
                        <h2 className="text-2xl font-black text-rose-500 uppercase tracking-tight">{initialData ? 'Update Liability' : 'Register Liability'}</h2>
                        <p className="text-white/40 text-sm italic">{initialData ? 'Keep your debt plan accurate.' : 'Track your debts to plan your freedom.'}</p>
                    </div>
                    <button onClick={handleClose} type="button" className="p-2 hover:bg-white/5 rounded-full text-white/40 hover:text-white transition-all">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <form className="flex flex-col flex-grow overflow-hidden" onSubmit={handleSubmit}>
                    <div className="flex-grow overflow-y-auto pr-2 custom-scrollbar space-y-6">
                        <Input
                            label="Liability Name"
                            placeholder="e.g. HDFC Home Loan, Tesla EMI"
                            leftIcon={<Type className="w-4 h-4" />}
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />

                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-white/50 ml-1">Debt Category</label>
                            <div className="flex flex-wrap gap-2">
                                {LIABILITY_TYPES.map((type) => (
                                    <button
                                        key={type.value}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, type: type.value })}
                                        className={`px-3 py-2 text-[10px] font-bold uppercase rounded-xl border transition-all ${formData.type === type.value
                                            ? 'bg-rose-500/10 border-rose-500/50 text-rose-400'
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
                                label="Current Owed (₹)"
                                type="number"
                                placeholder="0.00"
                                leftIcon={<Shield className="w-4 h-4" />}
                                value={formData.outstanding_amount}
                                onChange={(e) => setFormData({ ...formData, outstanding_amount: e.target.value })}
                                required
                            />
                            <Input
                                label="Original Loan (₹)"
                                type="number"
                                placeholder="0.00"
                                leftIcon={<Tag className="w-4 h-4" />}
                                value={formData.original_amount}
                                onChange={(e) => setFormData({ ...formData, original_amount: e.target.value })}
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                label="Monthly EMI (₹)"
                                type="number"
                                placeholder="0.00"
                                leftIcon={<CreditCard className="w-4 h-4" />}
                                value={formData.emi_amount}
                                onChange={(e) => setFormData({ ...formData, emi_amount: e.target.value })}
                                required
                            />
                            <Input
                                label="Interest Rate (%)"
                                type="number"
                                step="0.1"
                                placeholder="8.5"
                                leftIcon={<Tag className="w-4 h-4" />}
                                value={formData.interest_rate}
                                onChange={(e) => setFormData({ ...formData, interest_rate: e.target.value })}
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                label="Start Date"
                                type="date"
                                leftIcon={<Calendar className="w-4 h-4" />}
                                value={formData.start_date}
                                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                                required
                            />
                            <Input
                                label="Next Due Date"
                                type="date"
                                leftIcon={<Calendar className="w-4 h-4" />}
                                value={formData.due_date}
                                onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                                required
                            />
                        </div>

                        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                                        <Repeat className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-200">Automate EMI Payments</p>
                                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">Generate expense every month</p>
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
                        <Button variant="primary" type="submit" className="flex-1 bg-gradient-to-r from-rose-500 to-red-600 border-none px-0" isLoading={loading}>
                            {initialData ? 'Update Liability' : 'Save Liability'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
