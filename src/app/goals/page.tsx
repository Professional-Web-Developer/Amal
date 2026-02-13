"use client";

import React, { useState, useEffect } from 'react';
import { Target, Plus, Sparkles, Filter, Search, Award } from 'lucide-react';
import Button from '@/frontend/elements/buttons/Button';
import Input from '@/frontend/elements/inputs/Input';
import GoalCard from '@/frontend/components/finance/GoalCard';
import AddGoalModal from '@/frontend/components/modals/AddGoalModal';
import { FinancialGoal, GoalFeasibility } from '@/types/finance';

export default function GoalsPage() {
    const [goals, setGoals] = useState<FinancialGoal[]>([]);
    const [feasibilities, setFeasibilities] = useState<GoalFeasibility[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingGoal, setEditingGoal] = useState<FinancialGoal | null>(null);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/finance');
            const result = await response.json();
            if (result.success) {
                setGoals(result.data.goals);
                setFeasibilities(result.data.goalFeasibilities);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (goal: any) => {
        setEditingGoal(goal);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        try {
            const response = await fetch(`/api/goals/${id}`, { method: 'DELETE' });
            const result = await response.json();
            if (result.success) {
                fetchData();
            } else {
                alert('Failed to delete goal: ' + (result.error || 'Unknown error'));
            }
        } catch (error: any) {
            alert('Error deleting goal: ' + error.message);
        }
    };

    const handleOpenAdd = () => {
        setEditingGoal(null);
        setIsModalOpen(true);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const completedGoals = goals.filter(g => g.current_saved >= g.target_amount);
    const activeGoals = goals.filter(g => g.current_saved < g.target_amount);

    return (
        <div className="min-h-screen px-4 sm:px-6 lg:pl-80 lg:pr-8 py-6 lg:py-8">
            <div className="max-w-7xl mx-auto space-y-10">
                {/* Header */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <Target className="w-5 h-5 text-emerald-400" />
                            <span className="text-sm font-bold text-slate-400 tracking-wide uppercase">Financial Ambitions</span>
                        </div>
                        <h1 className="text-5xl lg:text-7xl font-black text-liquid-gradient tracking-tighter">Future Goals</h1>
                        <p className="text-slate-500 mt-3 font-semibold text-lg max-w-xl">
                            Plan your journey to financial freedom and milestones.
                        </p>
                    </div>
                    <Button
                        variant="primary"
                        size="md"
                        leftIcon={<Plus className="w-5 h-5" />}
                        className="w-full lg:w-auto shadow-emerald-500/20"
                        onClick={handleOpenAdd}
                    >
                        Create Financial Goal
                    </Button>
                </div>

                {/* Goals Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-72 rounded-[2rem] bg-white/5 animate-pulse" />
                        ))}
                    </div>
                ) : activeGoals.length > 0 ? (
                    <div className="space-y-12">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {activeGoals.map((goal, idx) => (
                                <GoalCard
                                    key={goal.id}
                                    goal={goal}
                                    feasibility={feasibilities.find(f => f.goalId === goal.id)}
                                    onEdit={handleEdit}
                                    onDelete={handleDelete}
                                />
                            ))}
                        </div>

                        {completedGoals.length > 0 && (
                            <div className="pt-10 border-t border-white/10 space-y-8">
                                <h3 className="text-2xl font-black text-slate-100 flex items-center gap-3">
                                    <Award className="w-6 h-6 text-yellow-500" />
                                    Achieved Milestones
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 opacity-60">
                                    {completedGoals.map(goal => (
                                        <GoalCard
                                            key={goal.id}
                                            goal={goal}
                                            onEdit={handleEdit}
                                            onDelete={handleDelete}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="text-center py-24 frosted-glass rounded-[3rem]">
                        <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6">
                            <Target className="w-10 h-10 text-slate-600" />
                        </div>
                        <h2 className="text-2xl font-black text-slate-300">No active goals</h2>
                        <p className="text-slate-500 mt-2 font-bold">What are you working towards? Set your first goal now.</p>
                        <Button variant="ghost" className="mt-8 mx-auto" onClick={handleOpenAdd}>Create Financial Goal</Button>
                    </div>
                )}

                <AddGoalModal
                    isOpen={isModalOpen}
                    initialData={editingGoal}
                    onClose={() => {
                        setIsModalOpen(false);
                        setEditingGoal(null);
                        fetchData();
                    }}
                />
            </div>
        </div>
    );
}
