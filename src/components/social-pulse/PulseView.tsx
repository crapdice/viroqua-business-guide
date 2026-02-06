'use client';

import { useState, useMemo, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { AnimatePresence, motion } from 'framer-motion';
import { PulseCard } from './PulseCard';
import { PulseFilterBar } from './PulseFilterBar';
import { PulseHeader } from './PulseHeader';
import { MOCK_SOCIAL_POSTS } from '../../data/mock-social';

const Masonry = dynamic(() => import('react-plock').then(mod => mod.Masonry), {
    ssr: false,
    loading: () => <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
        {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-stone-100 rounded-2xl h-96 w-full" />
        ))}
    </div>
});

export const PulseView = () => {
    const [isMounted, setIsMounted] = useState(false);
    const [activeNiche, setActiveNiche] = useState('All');

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Derive unique niches from posts
    const niches = useMemo(() => {
        const set = new Set(MOCK_SOCIAL_POSTS.map(p => p.niche));
        return Array.from(set).sort();
    }, []);

    const filteredPosts = useMemo(() => {
        if (activeNiche === 'All') return MOCK_SOCIAL_POSTS;
        return MOCK_SOCIAL_POSTS.filter(p => p.niche === activeNiche);
    }, [activeNiche]);

    if (!isMounted) return null;

    return (
        <div className="min-h-screen bg-background">
            {/* Replaced Hero Header with PulseHeader component */}
            <PulseHeader activeNiche={activeNiche} />

            <PulseFilterBar
                niches={niches}
                activeNiche={activeNiche}
                onNicheChange={setActiveNiche}
            />

            <main className="max-w-7xl mx-auto px-4 md:px-8 pb-32">
                <AnimatePresence mode="popLayout">
                    <motion.div
                        key={activeNiche}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        <Masonry
                            items={filteredPosts}
                            config={{
                                columns: [1, 2, 3],
                                gap: [24, 24, 24],
                                media: [640, 1024, 1280],
                            }}
                            render={(post: any) => <PulseCard key={post.id} post={post} />}
                        />

                        {filteredPosts.length === 0 && (
                            <div className="py-20 text-center">
                                <p className="font-editorial text-2xl text-stone-400 italic">No updates in this niche yet...</p>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </main>
        </div>
    );
};
