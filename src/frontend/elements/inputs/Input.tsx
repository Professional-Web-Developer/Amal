"use client";

import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    containerClassName?: string;
}

export default function Input({
    label,
    error,
    leftIcon,
    rightIcon,
    className,
    containerClassName,
    ...props
}: InputProps) {
    return (
        <div className={cn("space-y-2 w-full", containerClassName)}>
            {label && (
                <label className="text-sm font-semibold text-slate-300 ml-1 flex items-center gap-2">
                    {label}
                </label>
            )}
            <div className="relative group">
                {leftIcon && (
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-400 transition-all duration-300 z-10">
                        {leftIcon}
                    </div>
                )}
                <input
                    className={cn(
                        "w-full bg-slate-900/60 border border-slate-700/50 px-4 py-3.5 text-sm text-slate-100 outline-none transition-all duration-300 rounded-2xl relative z-10",
                        "placeholder:text-slate-500",
                        "focus:border-transparent focus:bg-slate-900/80 focus:shadow-2xl focus:shadow-emerald-500/10",
                        "hover:border-white/20 hover:bg-slate-900/70",
                        "backdrop-blur-xl",
                        leftIcon && "pl-11",
                        rightIcon && "pr-11",
                        error && "border-red-500/50 focus:border-red-500 focus:shadow-red-500/10",
                        className
                    )}
                    {...props}
                />
                {rightIcon && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 z-20">
                        {rightIcon}
                    </div>
                )}

                {/* Animated Focus Border & Glow */}
                <div className="absolute inset-[-1.5px] rounded-[1.1rem] bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 opacity-0 group-focus-within:opacity-100 transition-all duration-500 z-0 pointer-events-none" />
                <div className="absolute inset-0 rounded-2xl bg-emerald-500/5 scale-95 opacity-0 group-focus-within:scale-105 group-focus-within:opacity-100 transition-all duration-500 -z-10 blur-2xl" />
            </div>
            {error && (
                <p className="text-xs font-semibold text-red-400 ml-1 mt-1.5 animate-in slide-in-from-top-1 fade-in duration-300 flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-red-400" />
                    {error}
                </p>
            )}
        </div>
    );
}
