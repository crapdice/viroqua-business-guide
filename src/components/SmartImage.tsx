'use client';

import { useState } from 'react';
import Image, { ImageProps } from 'next/image';
import { getCategoryIcon } from '@/lib/icons';

interface SmartImageProps extends Omit<ImageProps, 'onError'> {
    categorySlug?: string;
}

export default function SmartImage({ src, alt, categorySlug, className, ...props }: SmartImageProps) {
    const [error, setError] = useState(false);

    // Default to HelpCircle if slug is missing, or use specific category icon
    const Icon = getCategoryIcon(categorySlug || 'default');

    if (error || !src) {
        return (
            <div className={`flex items-center justify-center bg-[#F4F1EA] text-[#9A8F85] ${className}`}>
                <Icon size={48} strokeWidth={0.5} />
            </div>
        );
    }

    return (
        <Image
            src={src}
            alt={alt}
            className={className}
            onError={() => setError(true)}
            {...props}
        />
    );
}
