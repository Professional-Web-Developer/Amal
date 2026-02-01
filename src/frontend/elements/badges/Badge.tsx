"use client";

import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { CheckCircle2 } from 'lucide-react';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface BadgeProps {
    children: React.ReactNode;
    variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
    size?: 'sm' | 'md';
    className?: string;
    pulse?: boolean;
}

export default function Badge({
    children,
    variant = 'default',
    size = 'md',
    className,
    pulse = false
}: BadgeProps) {
    const variants = {
        default: 'bg-[#86868b]/10 text-[#86868b] border-[#86868b]/20',
        success: 'bg-[#34C759]/10 text-[#34C759] border-[#34C759]/20 shadow-sm shadow-[#34C759]/10',
        warning: 'bg-[#FF9500]/10 text-[#FF9500] border-[#FF9500]/20 shadow-sm shadow-[#FF9500]/10',
        error: 'bg-[#FF3B30]/10 text-[#FF3B30] border-[#FF3B30]/20 shadow-sm shadow-[#FF3B30]/10',
        info: 'bg-[#007AFF]/10 text-[#007AFF] border-[#007AFF]/20 shadow-sm shadow-[#007AFF]/10',
    };

    const sizes = {
        sm: 'px-2.5 py-1 text-[9px]',
        md: 'px-3 py-1.5 text-[10px]',
    };

    return (
        <span
            className={cn(
                'inline-flex items-center justify-center font-bold uppercase tracking-widest border rounded-full transition-all duration-300 backdrop-blur-sm',
                variants[variant],
                sizes[size],
                className
            )}
        >
            {variant === 'success' && (
                <CheckCircle2 className={cn(
                    "w-3 h-3 mr-1.5",
                    pulse && "animate-pulse"
                )} />
            )}
            {pulse && variant !== 'success' && (
                <span className={cn(
                    "w-1.5 h-1.5 rounded-full mr-2",
                    variant === 'warning' && "bg-[#FF9500] animate-pulse",
                    variant === 'error' && "bg-[#FF3B30] animate-pulse",
                    variant === 'info' && "bg-[#007AFF] animate-pulse"
                )} />
            )}
            {children}
        </span>
    );
}
