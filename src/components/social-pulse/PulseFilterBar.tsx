'use client';

import { motion } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Helper for tailwind classes
function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface PulseFilterBarProps {
    niches: string[];
    activeNiche: string;
    onNicheChange: (niche: string) => void;
}

export const PulseFilterBar = ({ niches, activeNiche, onNicheChange }: PulseFilterBarProps) => {
    return (
        <div className="sticky top-20 z-40 w-full overflow-hidden bg-background/80 backdrop-blur-md border-b border-stone-200 mb-8">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                <div className="flex items-center gap-2 py-4 overflow-x-auto no-scrollbar">
                    <button
                        onClick={() => onNicheChange('All')}
                        className={cn(
                            "px-5 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-300 border",
                            activeNiche === 'All'
                                ? "bg-foreground text-background border-foreground"
                                : "bg-white text-stone-500 border-stone-200 hover:border-stone-400"
                        )}
                    >
                        All Updates
                    </button>

                    {niches.map((niche) => (
                        <button
                            key={niche}
                            onClick={() => onNicheChange(niche)}
                            className={cn(
                                "px-5 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-300 border",
                                activeNiche === niche
                                    ? "bg-foreground text-background border-foreground shadow-lg shadow-black/10"
                                    : "bg-white text-stone-500 border-stone-200 hover:border-stone-400"
                            )}
                        >
                            {niche}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};
