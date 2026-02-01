"use client";

import React, { useState, useEffect } from 'react';
import { Plus, Wallet, ShieldCheck, PieChart, Landmark, ArrowUpRight } from 'lucide-react';
import Button from '@/frontend/elements/buttons/Button';
import AccountCard, { AccountType } from '@/frontend/components/cards/AccountCard';
import AddAccountModal from '@/frontend/components/modals/AddAccountModal';
import { getAccounts } from '@/app/actions/accounts';

export default function AccountsPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [accounts, setAccounts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchAccounts = async () => {
        setLoading(true);
        const data = await getAccounts();
        setAccounts(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchAccounts();
    }, []);

    const totalAssets = accounts
        .filter(a => a.balance > 0)
        .reduce((sum, a) => sum + parseFloat(a.balance), 0);

    const totalDebts = Math.abs(accounts
        .filter(a => a.balance < 0)
        .reduce((sum, a) => sum + parseFloat(a.balance), 0));

    const netWorth = totalAssets - totalDebts;

    return (
        <div className="min-h-screen px-4 sm:px-6 lg:pl-80 lg:pr-8 py-6 lg:py-8">
            <div className="max-w-7xl mx-auto space-y-8 lg:space-y-10">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 sm:gap-6">
                    <div>
                        <div className="flex items-center gap-2 mb-2 lg:mb-3">
                            <Landmark className="w-4 h-4 lg:w-5 lg:h-5 text-emerald-400" />
                            <span className="text-xs lg:text-sm font-semibold text-slate-400 tracking-wide">Asset Management</span>
                        </div>
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-liquid-gradient tracking-tight">Accounts</h1>
                        <p className="text-slate-400 mt-2 lg:mt-3 font-medium text-sm lg:text-base">Manage your financial institutions and balances</p>
                    </div>
                    <Button
                        variant="primary"
                        leftIcon={<Plus className="w-4 h-4" strokeWidth={3} />}
                        onClick={() => setIsModalOpen(true)}
                        className="w-full sm:w-auto"
                    >
                        Create Account
                    </Button>
                </div>

                {/* Stats Summary */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                    <div className="neo-card p-8 rounded-[2rem] flex items-center justify-between border-white/5 bg-white/[0.01]">
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 mb-2">Net Worth</p>
                            <p className="text-4xl font-black text-white tracking-tighter">${netWorth.toLocaleString()}</p>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center">
                            <Wallet className="w-5 h-5 text-white/40" />
                        </div>
                    </div>
                    <div className="neo-card p-8 rounded-[2rem] flex items-center justify-between border-white/5 bg-white/[0.01]">
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 mb-2">Total Assets</p>
                            <p className="text-4xl font-black text-emerald-400 tracking-tighter">${totalAssets.toLocaleString()}</p>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-emerald-500/5 flex items-center justify-center">
                            <ShieldCheck className="w-5 h-5 text-emerald-400/50" />
                        </div>
                    </div>
                    <div className="neo-card p-8 rounded-[2rem] flex items-center justify-between border-white/5 bg-white/[0.01]">
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 mb-2">Total Debt</p>
                            <p className="text-4xl font-black text-rose-500 tracking-tighter">${totalDebts.toLocaleString()}</p>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-rose-500/5 flex items-center justify-center">
                            <PieChart className="w-5 h-5 text-rose-500/50" />
                        </div>
                    </div>
                </div>

                {/* Accounts Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-8">
                    {loading ? (
                        <div className="col-span-full py-40 text-center text-white/10 font-black uppercase text-[11px] tracking-[0.3em] italic">Synchronizing Assets...</div>
                    ) : (
                        <>
                            {accounts.map((account) => (
                                <AccountCard
                                    key={account.id}
                                    name={account.name}
                                    type={account.type as AccountType}
                                    balance={parseFloat(account.balance)}
                                    bankName={account.bank_name}
                                    accountNumber={account.account_number}
                                />
                            ))}

                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="group border-2 border-dashed border-white/10 rounded-[2.5rem] p-10 flex flex-col items-center justify-center gap-6 hover:border-white/20 hover:bg-white/[0.02] transition-all min-h-[280px]"
                            >
                                <div className="w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center group-hover:bg-white transition-all duration-500">
                                    <Plus className="w-8 h-8 text-white/20 group-hover:text-black transition-colors" strokeWidth={3} />
                                </div>
                                <p className="font-black text-[10px] uppercase tracking-[0.3em] text-white/20 group-hover:text-white transition-colors">Register Asset</p>
                            </button>
                        </>
                    )}
                </div>

                <AddAccountModal
                    isOpen={isModalOpen}
                    onClose={() => {
                        setIsModalOpen(false);
                        fetchAccounts();
                    }}
                />
            </div>
        </div>
    );
}
