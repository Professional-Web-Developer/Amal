"use client";

import React, { useState } from 'react';
import { Sparkles, Mail, Lock, ArrowRight, Github } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Button from '@/frontend/elements/buttons/Button';
import Input from '@/frontend/elements/inputs/Input';
import AmalLogo from '@/frontend/components/brand/AmalLogo';
import { login, signup } from '@/app/actions/auth';

export default function LoginPage() {
    const router = useRouter();
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    React.useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('error') === 'auth_callback_failed') {
            setError("The authorization link has expired or is invalid. Please try logging in again.");
        }
    }, []);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const formData = new FormData(e.currentTarget);

        if (isLogin) {
            const result = await login(formData);
            if (result?.error) {
                setError(result.error);
                setLoading(false);
            }
        } else {
            const result = await signup(formData);
            if (result?.error) {
                setError(result.error);
                setLoading(false);
            } else {
                setError("Check your email for confirmation!");
                setLoading(false);
                setIsLogin(true);
            }
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
            {/* Decorative Orbs */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/10 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-teal-500/10 rounded-full blur-[120px] animate-pulse" />

            <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-1000">
                <div className="frosted-glass p-8 sm:p-12 rounded-[2.5rem] border border-white/10 shadow-2xl relative">
                    {/* Logo Section */}
                    <div className="flex flex-col items-center mb-10">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 backdrop-blur-sm p-3 shadow-lg shadow-emerald-500/20 floating-glass border border-emerald-500/20 flex items-center justify-center mb-6">
                            <AmalLogo className="w-10 h-10" />
                        </div>
                        <h1 className="text-4xl font-bold text-liquid-gradient tracking-tight mb-2">Amal</h1>
                        <p className="text-slate-400 font-medium text-sm lg:text-base text-center">
                            {isLogin ? "Welcome back to radical control" : "Begin your financial transcendence"}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-4">
                            <Input
                                name="email"
                                type="email"
                                placeholder="email@example.com"
                                label="Email Address"
                                required
                                leftIcon={<Mail className="w-4 h-4" />}
                            />
                            <Input
                                name="password"
                                type="password"
                                placeholder="••••••••"
                                label="Password"
                                required
                                leftIcon={<Lock className="w-4 h-4" />}
                            />
                        </div>

                        {error && (
                            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold uppercase tracking-wider text-center animate-in shake duration-500">
                                {error}
                            </div>
                        )}

                        <Button
                            type="submit"
                            variant="primary"
                            className="w-full py-4 text-base"
                            isLoading={loading}
                            rightIcon={<ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
                        >
                            {isLogin ? "Enter Portal" : "Create Account"}
                        </Button>
                    </form>

                    <div className="mt-8 flex flex-col items-center gap-6">
                        <div className="flex items-center gap-4 w-full">
                            <div className="h-px bg-white/5 flex-1" />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Continue with</span>
                            <div className="h-px bg-white/5 flex-1" />
                        </div>

                        <Button variant="glass" className="w-full flex items-center gap-3">
                            <Github className="w-5 h-5" />
                            <span>GitHub</span>
                        </Button>

                        <button
                            onClick={() => setIsLogin(!isLogin)}
                            className="text-slate-400 hover:text-emerald-400 transition-colors text-sm font-semibold group flex items-center gap-2"
                        >
                            {isLogin ? "New to Amal? " : "Already have an account? "}
                            <span className="text-emerald-400 group-hover:underline underline-offset-4 decoration-2">
                                {isLogin ? "Register Access" : "Secure Entry"}
                            </span>
                        </button>
                    </div>

                    <div className="absolute -top-3 -right-3">
                        <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 backdrop-blur-md">
                            <Sparkles className="w-5 h-5 text-emerald-400" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
