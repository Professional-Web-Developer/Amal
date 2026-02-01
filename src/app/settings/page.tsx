"use client";

import React, { useState } from 'react';
import {
    Settings,
    User,
    Shield,
    Bell,
    Palette,
    Globe,
    HelpCircle,
    CreditCard,
    ChevronRight,
    Database,
    Smartphone
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import Button from '@/frontend/elements/buttons/Button';
import Input from '@/frontend/elements/inputs/Input';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

const settingsSections = [
    { id: 'profile', icon: User, label: 'Profile Information', description: 'Manage your name, email, and avatar' },
    { id: 'security', icon: Shield, label: 'Security & Privacy', description: 'Password, 2FA, and sessions' },
    { id: 'notifications', icon: Bell, label: 'Notifications', description: 'Configure alerts and reminders' },
    { id: 'appearance', icon: Palette, label: 'Appearance', description: 'Theme, colors, and layout' },
    { id: 'preferences', icon: Globe, label: 'General Preferences', description: 'Language, currency, and region' },
    { id: 'billing', icon: CreditCard, label: 'Billing & Subscriptions', description: 'Manage your plan and payment methods' },
];

export default function SettingsPage() {
    const [activeSection, setActiveSection] = useState('profile');

    return (
        <div className="min-h-screen px-4 sm:px-6 lg:pl-80 lg:pr-8 py-6 lg:py-8">
            <div className="max-w-7xl mx-auto space-y-8 lg:space-y-10 animate-in fade-in duration-1000">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 sm:gap-6">
                    <div>
                        <div className="flex items-center gap-2 mb-2 lg:mb-3">
                            <Settings className="w-4 h-4 lg:w-5 lg:h-5 text-emerald-400" />
                            <span className="text-xs lg:text-sm font-semibold text-slate-400 tracking-wide">System Configuration</span>
                        </div>
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-liquid-gradient tracking-tight">Settings</h1>
                        <p className="text-slate-400 mt-2 lg:mt-3 font-medium text-sm lg:text-base">Configure your personal preferences and system security</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
                    {/* Navigation Sidebar */}
                    <div className="lg:col-span-1 space-y-2">
                        {settingsSections.map((section) => (
                            <button
                                key={section.id}
                                onClick={() => setActiveSection(section.id)}
                                className={cn(
                                    "w-full flex items-center justify-between p-4 rounded-2xl transition-all duration-300 border border-transparent",
                                    activeSection === section.id
                                        ? "frosted-glass border-emerald-500/30 text-emerald-400 shadow-lg shadow-emerald-500/10"
                                        : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
                                )}
                            >
                                <div className="flex items-center gap-3">
                                    <section.icon className="w-5 h-5" />
                                    <span className="font-bold text-sm">{section.label}</span>
                                </div>
                                <ChevronRight className={cn(
                                    "w-4 h-4 transition-transform",
                                    activeSection === section.id ? "rotate-90" : "opacity-40"
                                )} />
                            </button>
                        ))}
                    </div>

                    {/* Content Area */}
                    <div className="lg:col-span-3 frosted-glass p-6 lg:p-10 rounded-[2.5rem] liquid-glass-hover min-h-[500px]">
                        {activeSection === 'profile' && (
                            <div className="space-y-10 animate-in slide-in-from-right-4 duration-500">
                                <div>
                                    <h3 className="text-2xl font-bold text-slate-100 tracking-tight">Profile Details</h3>
                                    <p className="text-slate-400 mt-2 font-medium">This information will be displayed across the platform</p>
                                </div>

                                <div className="flex flex-col sm:flex-row items-center gap-8 py-6 border-y border-white/5">
                                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-4xl shadow-xl shadow-emerald-500/20 floating-glass">
                                        JD
                                    </div>
                                    <div className="space-y-3">
                                        <Button variant="secondary" size="sm">Change Avatar</Button>
                                        <p className="text-xs text-slate-500 font-medium font-mono uppercase tracking-widest">JPG, PNG or GIF. Max size 2MB</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <Input label="Full Name" defaultValue="John Doe" />
                                    <Input label="Email Address" defaultValue="john@amal.ai" type="email" />
                                    <Input label="Professional Title" placeholder="e.g. Software Engineer" />
                                    <Input label="Phone Number" placeholder="+1 (555) 000-0000" />
                                </div>

                                <div className="pt-6 border-t border-white/5 flex gap-4">
                                    <Button variant="primary">Update Profile</Button>
                                    <Button variant="ghost">Cancel Changes</Button>
                                </div>
                            </div>
                        )}

                        {activeSection !== 'profile' && (
                            <div className="py-20 flex flex-col items-center justify-center text-center space-y-4 animate-in fade-in">
                                <div className="p-6 rounded-3xl bg-emerald-500/10 border border-emerald-500/20">
                                    <Smartphone className="w-10 h-10 text-emerald-400" />
                                </div>
                                <h4 className="text-xl font-bold text-slate-100">Section Under Development</h4>
                                <p className="text-slate-400 max-w-xs mx-auto">This part of the configuration system is currently being finalized for a future update.</p>
                                <Button variant="secondary" onClick={() => setActiveSection('profile')}>Back to Profile</Button>
                            </div>
                        )}
                    </div>
                </div>

                {/* System Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="frosted-glass p-6 rounded-3xl flex items-center gap-4 border-white/5">
                        <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-400">
                            <Database className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Storage Status</p>
                            <p className="font-bold text-slate-200">12.4 GB of 50 GB Used</p>
                        </div>
                    </div>
                    <div className="frosted-glass p-6 rounded-3xl flex items-center gap-4 border-white/5">
                        <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-400">
                            <HelpCircle className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Support Access</p>
                            <p className="font-bold text-slate-200">Pro Priority Support active</p>
                        </div>
                    </div>
                    <div className="frosted-glass p-6 rounded-3xl flex items-center gap-4 border-white/5 sm:col-span-2 lg:col-span-1">
                        <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400">
                            <Shield className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Service Status</p>
                            <p className="font-bold text-slate-200">All systems operational</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
