'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Instagram, Facebook, ArrowUpRight } from 'lucide-react';
import { SocialPost } from '../../data/mock-social';

interface PulseCardProps {
    post: SocialPost;
}

export const PulseCard = ({ post }: PulseCardProps) => {
    const SourceIcon = post.source === 'instagram' ? Instagram : Facebook;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            whileHover={{ y: -4 }}
            className="group bg-white border border-stone-200 rounded-2xl overflow-hidden paper-shadow mb-6 flex flex-col"
        >
            {/* Header */}
            <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10 rounded-full overflow-hidden border border-stone-100 bg-stone-50">
                        <Image
                            src={post.avatarUrl}
                            alt={post.businessName}
                            fill
                            unoptimized={post.avatarUrl.includes('dicebear.com')}
                            className="object-cover"
                        />
                    </div>
                    <div className="flex flex-col">
                        <h3 className="text-sm font-bold text-foreground leading-tight tracking-tight">
                            {post.businessName}
                        </h3>
                        <span className="text-[10px] font-medium text-terracotta uppercase tracking-wide">
                            {post.niche}
                        </span>
                    </div>
                </div>
                <div className="bg-stone-50 p-2 rounded-full">
                    <SourceIcon className="w-4 h-4 text-stone-400 group-hover:text-terracotta transition-colors" />
                </div>
            </div>

            {/* Image Container */}
            <div className="relative aspect-[4/5] bg-stone-100 overflow-hidden">
                <Image
                    src={post.imageUrl}
                    alt=""
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
            </div>

            {/* Content */}
            <div className="p-4">
                <p className="text-sm text-stone-700 leading-relaxed line-clamp-3">
                    {post.caption}
                </p>

                <div className="mt-4 pt-4 border-t border-stone-50 flex items-center justify-between">
                    <span className="text-[10px] font-semibold text-stone-400 uppercase tracking-widest">
                        {post.timestamp}
                    </span>
                    <a
                        href={post.postUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-[11px] font-bold text-foreground hover:text-terracotta transition-colors uppercase tracking-wider cursor-pointer"
                    >
                        View Post
                        <ArrowUpRight className="w-3 h-3" />
                    </a>
                </div>
            </div>
        </motion.div>
    );
};
