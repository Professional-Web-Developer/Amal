"use client";

import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'gold' | 'ghost' | 'glass';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    liquid?: boolean;
}

export default function Button({
    className,
    variant = 'primary',
    size = 'md',
    isLoading,
    leftIcon,
    rightIcon,
    children,
    disabled,
    liquid = true,
    ...props
}: ButtonProps) {
    const variants = {
        primary: 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 liquid-glow',
        secondary: 'frosted-glass text-slate-100 hover:text-white hover:bg-white/5',
        gold: 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-900 font-bold gold-glow',
        ghost: 'text-emerald-400 hover:bg-emerald-500/10 border border-emerald-500/20 hover:border-emerald-500/40',
        glass: 'liquid-glass liquid-glass-hover text-slate-100',
    };

    const sizes = {
        sm: 'px-4 py-2 text-xs rounded-full',
        md: 'px-6 py-3 text-sm rounded-full',
        lg: 'px-8 py-4 text-base rounded-full',
    };

    return (
        <button
            className={cn(
                'flex items-center justify-center gap-2.5 font-semibold disabled:opacity-40 disabled:pointer-events-none transition-all duration-300 active:scale-95 cursor-pointer',
                variants[variant],
                sizes[size],
                liquid && 'liquid-ripple',
                className
            )}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading ? (
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : (
                <>
                    {leftIcon && <span className="w-5 h-5 flex items-center justify-center">{leftIcon}</span>}
                    <span className="relative z-10">{children}</span>
                    {rightIcon && <span className="w-5 h-5 flex items-center justify-center">{rightIcon}</span>}
                </>
            )}
        </button>
    );
}
