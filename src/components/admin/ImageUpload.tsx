'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { Upload, X, Loader2, ImageOff } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import { normalizeImageUrl } from '@/lib/utils';

// Client-side Supabase instance for uploads
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface ImageUploadProps {
    value: string;
    onChange: (url: string) => void;
    bucket?: string;
    folder?: string;
    label?: string;
}

export function ImageUpload({
    value,
    onChange,
    bucket = 'business-assets',
    folder = 'logos',
    label = 'Upload Image'
}: ImageUploadProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [imageError, setImageError] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    // Normalize URL for display
    const displayUrl = normalizeImageUrl(value);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            setError('Please select an image file');
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            setError('Image must be less than 5MB');
            return;
        }

        setIsUploading(true);
        setError(null);
        setImageError(false);

        try {
            // Generate unique filename
            const ext = file.name.split('.').pop();
            const filename = `${folder}/${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${ext}`;

            // Upload to Supabase Storage
            const { data, error: uploadError } = await supabase.storage
                .from(bucket)
                .upload(filename, file, {
                    cacheControl: '3600',
                    upsert: false
                });

            if (uploadError) {
                throw uploadError;
            }

            // Get public URL
            const { data: urlData } = supabase.storage
                .from(bucket)
                .getPublicUrl(data.path);

            onChange(urlData.publicUrl);
        } catch (err: any) {
            console.error('Upload error:', err);
            setError(err.message || 'Failed to upload image');
        } finally {
            setIsUploading(false);
        }
    };

    const handleRemove = () => {
        onChange('');
        setImageError(false);
        if (inputRef.current) {
            inputRef.current.value = '';
        }
    };

    // Generate unique ID for file input
    const inputId = `image-upload-${folder}-${Math.random().toString(36).substr(2, 9)}`;

    return (
        <div className="space-y-2">
            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                onChange={handleUpload}
                className="hidden"
                id={inputId}
            />

            {value && displayUrl ? (
                <div className="relative w-full aspect-video bg-[#FAF9F6] rounded-xl overflow-hidden border border-[#EBE3D5]">
                    {imageError ? (
                        <div className="w-full h-full flex flex-col items-center justify-center text-[#9A8F85]">
                            <ImageOff size={32} />
                            <span className="mt-2 text-sm">Image not found</span>
                            <span className="text-xs text-[#6B5E55] mt-1 px-4 truncate max-w-full">{value}</span>
                        </div>
                    ) : (
                        <Image
                            src={displayUrl}
                            alt="Uploaded image"
                            fill
                            className="object-contain"
                            onError={() => setImageError(true)}
                        />
                    )}
                    <button
                        type="button"
                        onClick={handleRemove}
                        className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                    >
                        <X size={16} />
                    </button>
                </div>
            ) : (
                <label
                    htmlFor={inputId}
                    className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-[#EBE3D5] rounded-xl cursor-pointer hover:border-[#3E5C3D] hover:bg-[#FAF9F6] transition-colors"
                >
                    {isUploading ? (
                        <div className="flex flex-col items-center">
                            <Loader2 size={32} className="text-[#3E5C3D] animate-spin" />
                            <span className="mt-2 text-sm text-[#6B5E55]">Uploading...</span>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center">
                            <Upload size={32} className="text-[#9A8F85]" />
                            <span className="mt-2 text-sm font-medium text-[#2D2825]">{label}</span>
                            <span className="mt-1 text-xs text-[#9A8F85]">PNG, JPG up to 5MB</span>
                        </div>
                    )}
                </label>
            )}

            {error && (
                <p className="text-sm text-red-500">{error}</p>
            )}
        </div>
    );
}

