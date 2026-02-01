"use client";

import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Download, List } from 'lucide-react';
import Button from '@/frontend/elements/buttons/Button';
import Input from '@/frontend/elements/inputs/Input';
import TransactionTable from '@/frontend/components/tables/TransactionTable';
import AddTransactionModal from '@/frontend/components/modals/AddTransactionModal';
import { getTransactions } from '@/app/actions/transactions';

export default function TransactionsPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [transactions, setTransactions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    const fetchTransactions = async () => {
        setLoading(true);
        const data = await getTransactions();
        setTransactions(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchTransactions();
    }, []);

    const filteredTransactions = transactions.filter(tx =>
        tx.name.toLowerCase().includes(search.toLowerCase()) ||
        tx.category.toLowerCase().includes(search.toLowerCase())
    ).map(tx => ({
        ...tx,
        date: new Date(tx.created_at).toLocaleDateString()
    }));

    return (
        <div className="min-h-screen px-4 sm:px-6 lg:pl-80 lg:pr-8 py-6 lg:py-8">
            <div className="max-w-7xl mx-auto space-y-8 lg:space-y-10 animate-in fade-in duration-1000">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 sm:gap-6">
                    <div>
                        <div className="flex items-center gap-2 mb-2 lg:mb-3">
                            <List className="w-4 h-4 lg:w-5 lg:h-5 text-emerald-400" />
                            <span className="text-xs lg:text-sm font-semibold text-slate-400 tracking-wide">Ledger History</span>
                        </div>
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-liquid-gradient tracking-tight">Journal</h1>
                        <p className="text-slate-400 mt-2 lg:mt-3 font-medium text-sm lg:text-base">Review and manage your financial records</p>
                    </div>
                    <div className="flex gap-3 w-full sm:w-auto">
                        <Button variant="secondary" size="md" className="flex-1 sm:flex-none" leftIcon={<Download className="w-4 h-4" />}>
                            Export
                        </Button>
                        <Button
                            variant="primary"
                            className="flex-1 sm:flex-none"
                            leftIcon={<Plus className="w-4 h-4 lg:w-5 lg:h-5" strokeWidth={3} />}
                            onClick={() => setIsModalOpen(true)}
                        >
                            Add Transaction
                        </Button>
                    </div>
                </div>

                {/* Filters & Actions */}
                <div className="flex flex-col sm:flex-row gap-6 p-2 rounded-2xl bg-white/[0.02] border border-white/5">
                    <div className="flex-1">
                        <Input
                            placeholder="Search ledger entries..."
                            leftIcon={<Search className="w-4 h-4" />}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="bg-transparent border-none focus:bg-white/[0.02]"
                        />
                    </div>
                    <div className="flex gap-2 p-1">
                        <Button variant="secondary" size="sm" leftIcon={<Filter className="w-3 h-3" />}>
                            Filter
                        </Button>
                    </div>
                </div>

                {/* Main Content */}
                {loading ? (
                    <div className="py-60 text-center text-white/10 font-black uppercase text-[11px] tracking-[0.4em] italic mb-20 animate-pulse">Syncing Ledger...</div>
                ) : (
                    <div className="mb-20">
                        <TransactionTable transactions={filteredTransactions} />
                    </div>
                )}

                {/* Modal */}
                <AddTransactionModal
                    isOpen={isModalOpen}
                    onClose={() => {
                        setIsModalOpen(false);
                        fetchTransactions();
                    }}
                />
            </div>
        </div>
    );
}
