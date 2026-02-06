'use client';

import { motion } from 'framer-motion';

interface PulseHeaderProps {
    activeNiche: string;
}

export const PulseHeader = ({ activeNiche }: PulseHeaderProps) => {
    return (
        <div className="relative pt-24 pb-12 px-4 md:px-8 max-w-7xl mx-auto overflow-hidden">
            <div className="relative z-10">
                <motion.span
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-block text-terracotta font-bold text-[10px] uppercase tracking-[0.4em] mb-4"
                >
                    Viroqua Social Pulse
                </motion.span>
                <motion.h1
                    key={activeNiche}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="text-5xl md:text-8xl font-editorial font-bold text-foreground leading-[0.9] tracking-tighter mb-8"
                >
                    {activeNiche === 'All' ? (
                        <>
                            The beating heart <br />
                            of our <span className="italic text-stone-400">Driftless</span> community.
                        </>
                    ) : (
                        <>
                            Recent updates: <br />
                            <span className="italic text-stone-400">{activeNiche}</span>
                        </>
                    )}
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="max-w-xl text-stone-500 text-lg leading-relaxed font-light"
                >
                    {activeNiche === 'All'
                        ? "Real-time updates, seasonal specials, and local stories from the makers and curators of Viroqua."
                        : `Exploring local insights and announcements within the ${activeNiche} community.`}
                </motion.p>
            </div>

            <div className="absolute top-0 right-0 w-1/3 h-full topographic-bg opacity-[0.03] pointer-events-none" />
        </div>
    );
};
