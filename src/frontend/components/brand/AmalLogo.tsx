"use client";

import React from 'react';

export default function AmalLogo({ className = "w-8 h-8" }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            <defs>
                <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="50%" stopColor="#14b8a6" />
                    <stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>
            </defs>

            {/* Liquid flow spiral */}
            <path
                d="M50 10 C 70 10, 90 30, 90 50 C 90 70, 70 90, 50 90 C 30 90, 10 70, 10 50 C 10 35, 20 25, 35 20"
                stroke="url(#logoGradient)"
                strokeWidth="8"
                strokeLinecap="round"
                fill="none"
            />
            <path
                d="M40 25 C 50 25, 65 35, 65 50 C 65 60, 55 70, 45 70 C 35 70, 25 60, 25 50 C 25 42, 30 37, 37 35"
                stroke="url(#logoGradient)"
                strokeWidth="7"
                strokeLinecap="round"
                fill="none"
                opacity="0.8"
            />
            <path
                d="M45 40 C 50 40, 55 45, 55 50 C 55 55, 50 60, 45 60"
                stroke="url(#logoGradient)"
                strokeWidth="6"
                strokeLinecap="round"
                fill="none"
                opacity="0.6"
            />
        </svg>
    );
}
