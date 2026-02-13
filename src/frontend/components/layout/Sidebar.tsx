"use client";

import React, { useState } from 'react';
import {
    LayoutDashboard,
    Wallet,
    ArrowUpRight,
    PieChart,
    Settings,
    LogOut,
    Menu,
    X,
    TrendingUp,
    TrendingDown,
    Target,
    Sparkles,
    Heart
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import AmalLogo from '@/frontend/components/brand/AmalLogo';
import { logout } from '@/app/actions/auth';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/' },
    { icon: Wallet, label: 'Accounts', href: '/accounts' },
    { icon: ArrowUpRight, label: 'Transactions', href: '/transactions' },
    { icon: PieChart, label: 'Analytics', href: '/analytics' },
    { icon: TrendingUp, label: 'Assets', href: '/assets' },
    { icon: TrendingDown, label: 'Liabilities', href: '/liabilities' },
    { icon: Target, label: 'Goals', href: '/goals' },
    { icon: Sparkles, label: 'Projections', href: '/projections' },
    { icon: Heart, label: 'Health Score', href: '/health' },
];

export default function Sidebar() {
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Hide sidebar on login page
    if (pathname === '/login') return null;

    async function handleLogout() {
        await logout();
    }

    return (
        <>
            {/* Mobile Menu Button */}
            <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden fixed top-4 left-4 z-50 w-12 h-12 rounded-2xl frosted-glass flex items-center justify-center text-slate-100 shadow-lg"
            >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Mobile Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div className={cn(
                "w-72 h-[calc(100vh-2rem)] frosted-glass rounded-[2rem] flex flex-col p-6 z-50 shadow-2xl border border-white/10",
                "fixed left-4 top-4",
                "lg:block overflow-y-auto scrollbar-hide",
                isMobileMenuOpen ? "block" : "hidden lg:block"
            )}>
                {/* Logo */}
                <div className="flex items-center gap-4 mb-8 px-2 mt-4 flex-shrink-0">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 backdrop-blur-sm p-2 shadow-lg shadow-emerald-500/20 floating-glass border border-emerald-500/20 flex items-center justify-center flex-shrink-0">
                        <AmalLogo className="w-8 h-8" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-2xl font-bold text-liquid-gradient leading-tight">Amal</span>
                        <span className="text-[10px] uppercase tracking-[0.15em] text-slate-500 font-semibold mt-0.5">Wealth Flow</span>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 space-y-1.5 overflow-y-auto pr-2 custom-scrollbar">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 group relative overflow-hidden",
                                    isActive
                                        ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/20"
                                        : "text-slate-400 hover:text-slate-100 hover:bg-white/5"
                                )}
                            >
                                {isActive && (
                                    <div className="absolute inset-0 liquid-shimmer opacity-30" />
                                )}
                                <item.icon className={cn(
                                    "w-5 h-5 transition-all duration-300 relative z-10",
                                    isActive ? "" : "group-hover:scale-105"
                                )} strokeWidth={isActive ? 2.5 : 2} />
                                <span className="font-semibold text-sm tracking-tight relative z-10">{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Bottom Actions */}
                <div className="mt-auto space-y-1.5 pt-4 border-t border-white/5 flex-shrink-0">
                    <Link
                        href="/settings"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 rounded-2xl text-slate-400 hover:text-slate-100 hover:bg-white/5 transition-all duration-300 group"
                    >
                        <Settings className="w-5 h-5 group-hover:rotate-45 transition-transform duration-500" />
                        <span className="font-semibold text-sm tracking-tight">Settings</span>
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-2.5 rounded-2xl text-red-400 hover:bg-red-500/10 w-full transition-all duration-300 active:scale-98 group cursor-pointer"
                    >
                        <LogOut className="w-5 h-5" />
                        <span className="font-semibold text-sm tracking-tight">Logout</span>
                    </button>
                </div>
            </div>
        </>
    );
}
