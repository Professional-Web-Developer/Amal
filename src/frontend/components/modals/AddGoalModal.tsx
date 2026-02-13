"use client";

import React, { useState, useEffect } from 'react';
import { X, Type, Target, Calendar, Flag, FileText, Repeat } from 'lucide-react';
import Button from '@/frontend/elements/buttons/Button';
import Input from '@/frontend/elements/inputs/Input';
import { FinancialGoal, GoalCategory } from '@/types/finance';

interface AddGoalModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialData?: FinancialGoal | null;
}

const GOAL_CATEGORIES: { value: GoalCategory; label: string }[] = [
    { value: 'emergency_fund', label: 'Emergency Fund' },
    { value: 'investment', label: 'Investment' },
    { value: 'purchase', label: 'Major Purchase' },
    { value: 'retirement', label: 'Retirement' },
    { value: 'education', label: 'Education' },
    { value: 'travel', label: 'Travel' },
    { value: 'freedom', label: 'Financial Freedom' },
    { value: 'other', label: 'Other' },
];

const DEFAULT_STATE = {
    goal_name: '',
    goal_category: 'investment' as GoalCategory,
    target_amount: '',
    current_saved: '',
    target_date: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
    priority: '1',
    is_recurring: false,
    recurring_amount: '',
    notes: '',
};

export default function AddGoalModal({ isOpen, onClose, initialData }: AddGoalModalProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState(DEFAULT_STATE);

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                setFormData({
                    goal_name: initialData.goal_name,
                    goal_category: initialData.goal_category,
                    target_amount: initialData.target_amount.toString(),
                    current_saved: initialData.current_saved.toString(),
                    target_date: initialData.target_date || new Date().toISOString().split('T')[0],
                    priority: initialData.priority.toString(),
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
                goal_name: formData.goal_name,
                goal_category: formData.goal_category,
                target_amount: parseFloat(formData.target_amount) || 0,
                current_saved: parseFloat(formData.current_saved) || 0,
                target_date: formData.target_date,
                priority: parseInt(formData.priority) || 1,
                is_recurring: formData.is_recurring,
                recurring_amount: formData.is_recurring ? (parseFloat(formData.recurring_amount) || 0) : undefined,
                notes: formData.notes,
            };

            const response = initialData
                ? await fetch(`/api/goals/${initialData.id}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                })
                : await fetch('/api/goals', {
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
                        <h2 className="text-2xl font-black text-emerald-400 uppercase tracking-tight">{initialData ? 'Update Goal' : 'Set Financial Goal'}</h2>
                        <p className="text-white/40 text-sm italic">{initialData ? 'Refine your roadmap to success.' : 'Define your future milestones today.'}</p>
                    </div>
                    <button onClick={handleClose} type="button" className="p-2 hover:bg-white/5 rounded-full text-white/40 hover:text-white transition-all">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <form className="flex flex-col flex-grow overflow-hidden" onSubmit={handleSubmit}>
                    <div className="flex-grow overflow-y-auto pr-2 custom-scrollbar space-y-6">
                        <Input
                            label="Goal Name"
                            placeholder="e.g. Dream House, Bali Trip, Retirement Fund"
                            leftIcon={<Type className="w-4 h-4" />}
                            value={formData.goal_name}
                            onChange={(e) => setFormData({ ...formData, goal_name: e.target.value })}
                            required
                        />

                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-white/50 ml-1">Goal Category</label>
                            <div className="grid grid-cols-2 gap-2">
                                {GOAL_CATEGORIES.map((cat) => (
                                    <button
                                        key={cat.value}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, goal_category: cat.value })}
                                        className={`py-2 text-[10px] font-bold uppercase rounded-xl border transition-all ${formData.goal_category === cat.value
                                            ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400'
                                            : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                                            }`}
                                    >
                                        {cat.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                label="Target Amount (₹)"
                                type="number"
                                placeholder="0.00"
                                leftIcon={<Target className="w-4 h-4" />}
                                value={formData.target_amount}
                                onChange={(e) => setFormData({ ...formData, target_amount: e.target.value })}
                                required
                            />
                            <Input
                                label="Already Saved (₹)"
                                type="number"
                                placeholder="0.00"
                                leftIcon={<Target className="w-4 h-4 text-emerald-400" />}
                                value={formData.current_saved}
                                onChange={(e) => setFormData({ ...formData, current_saved: e.target.value })}
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                label="Target Date"
                                type="date"
                                leftIcon={<Calendar className="w-4 h-4" />}
                                value={formData.target_date}
                                onChange={(e) => setFormData({ ...formData, target_date: e.target.value })}
                                required
                            />
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-white/50 ml-1">Priority</label>
                                <select
                                    className="w-full h-12 bg-white/5 border border-white/10 rounded-2xl px-4 text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                                    value={formData.priority}
                                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                                >
                                    <option value="1">High Priority</option>
                                    <option value="2">Medium Priority</option>
                                    <option value="3">Low Priority</option>
                                </select>
                            </div>
                        </div>

                        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                                        <Repeat className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-200">Set Monthly Contribution</p>
                                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">Auto-save every month</p>
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
                                        label="Monthly Saved Amount (₹)"
                                        type="number"
                                        placeholder="0.00"
                                        leftIcon={<Target className="w-4 h-4" />}
                                        value={formData.recurring_amount}
                                        onChange={(e) => setFormData({ ...formData, recurring_amount: e.target.value })}
                                        required={formData.is_recurring}
                                    />
                                </div>
                            )}
                        </div>

                        <Input
                            label="Notes"
                            placeholder="Why is this goal important?"
                            leftIcon={<FileText className="w-4 h-4" />}
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        />
                    </div>

                    <div className="pt-6 flex gap-3 flex-shrink-0">
                        <Button variant="ghost" type="button" className="flex-1" onClick={handleClose}>Cancel</Button>
                        <Button variant="primary" type="submit" className="flex-1 shadow-emerald-500/20" isLoading={loading}>
                            {initialData ? 'Update Goal' : 'Save Goal'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
