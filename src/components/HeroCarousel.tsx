'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

const images = [
    '/hero-1.png',
    '/hero-2.png',
    '/hero-3.png',
];

export function HeroCarousel() {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((current) => (current + 1) % images.length);
        }, 3000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="relative w-full h-full overflow-hidden rounded-[3rem] shadow-2xl rotate-2 grayscale-[0.2] sepia-[0.1]">
            <AnimatePresence initial={false}>
                <motion.div
                    key={index}
                    initial={{ x: '100%', opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: '-100%', opacity: 0 }}
                    transition={{
                        x: { type: "spring", stiffness: 300, damping: 30 },
                        opacity: { duration: 0.5 }
                    }}
                    className="absolute inset-0"
                >
                    <Image
                        src={images[index]}
                        alt="Viroqua Landscape"
                        fill
                        className="object-cover"
                        priority
                    />
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
