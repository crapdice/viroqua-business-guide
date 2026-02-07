'use client';

import { useState } from 'react';
import { Globe, Loader2, Sparkles, AlertCircle } from 'lucide-react';

interface ScrapedData {
    name: string | null;
    description: string | null;
    address: string | null;
    city: string | null;
    state: string | null;
    zip: string | null;
    phone: string | null;
    email: string | null;
    website: string;
    hero_image_url: string | null;
    instagram_url: string | null;
    facebook_url: string | null;
    suggested_category_id: string | null;
    suggested_category_name: string | null;
}

interface UrlImportProps {
    onImport: (data: ScrapedData) => void;
}

export function UrlImport({ onImport }: UrlImportProps) {
    const [url, setUrl] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [preview, setPreview] = useState<ScrapedData | null>(null);

    const handleScrape = async () => {
        if (!url.trim()) return;

        setIsLoading(true);
        setError(null);
        setPreview(null);

        try {
            const response = await fetch('/api/admin/scrape-business', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url: url.trim() }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to scrape URL');
            }

            setPreview(data);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch business data');
        } finally {
            setIsLoading(false);
        }
    };

    const handleApply = () => {
        if (preview) {
            onImport(preview);
            setUrl('');
            setPreview(null);
        }
    };

    return (
        <div className="bg-gradient-to-r from-[#3E5C3D]/10 to-[#E2E8D4]/50 rounded-2xl p-6 border border-[#3E5C3D]/20">
            <div className="flex items-center gap-2 mb-4">
                <Sparkles size={18} className="text-[#3E5C3D]" />
                <h3 className="font-medium text-[#2D2825]">Quick Import from URL</h3>
            </div>

            <p className="text-sm text-[#6B5E55] mb-4">
                Paste a business website URL and we&apos;ll auto-fill as much info as possible.
            </p>

            <div className="flex gap-2 mb-4">
                <div className="relative flex-1">
                    <Globe size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9A8F85]" />
                    <input
                        type="url"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleScrape()}
                        placeholder="https://example-business.com"
                        className="w-full pl-10 pr-4 py-2.5 border border-[#EBE3D5] rounded-xl text-sm focus:outline-none focus:border-[#3E5C3D] bg-white"
                    />
                </div>
                <button
                    type="button"
                    onClick={handleScrape}
                    disabled={isLoading || !url.trim()}
                    className="px-4 py-2.5 bg-[#3E5C3D] text-white rounded-xl text-sm font-medium hover:bg-[#2D2825] transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                    {isLoading ? (
                        <>
                            <Loader2 size={16} className="animate-spin" />
                            Scanning...
                        </>
                    ) : (
                        'Scan'
                    )}
                </button>
            </div>

            {error && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm mb-4">
                    <AlertCircle size={16} />
                    {error}
                </div>
            )}

            {preview && (
                <div className="bg-white rounded-xl border border-[#EBE3D5] p-4 space-y-3">
                    <h4 className="font-medium text-[#2D2825] text-sm">Found Data:</h4>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                        {preview.name && (
                            <div><span className="text-[#9A8F85]">Name:</span> <span className="text-[#2D2825] font-medium">{preview.name}</span></div>
                        )}
                        {preview.phone && (
                            <div><span className="text-[#9A8F85]">Phone:</span> <span className="text-[#2D2825]">{preview.phone}</span></div>
                        )}
                        {preview.email && (
                            <div><span className="text-[#9A8F85]">Email:</span> <span className="text-[#2D2825]">{preview.email}</span></div>
                        )}
                        {preview.address && (
                            <div><span className="text-[#9A8F85]">Address:</span> <span className="text-[#2D2825]">{preview.address}</span></div>
                        )}
                        {preview.instagram_url && (
                            <div><span className="text-[#9A8F85]">Instagram:</span> <span className="text-[#2D2825]">✓</span></div>
                        )}
                        {preview.facebook_url && (
                            <div><span className="text-[#9A8F85]">Facebook:</span> <span className="text-[#2D2825]">✓</span></div>
                        )}
                        {preview.hero_image_url && (
                            <div><span className="text-[#9A8F85]">Image:</span> <span className="text-[#2D2825]">✓</span></div>
                        )}
                        {preview.suggested_category_name && (
                            <div className="col-span-2">
                                <span className="text-[#9A8F85]">Suggested Category:</span>{' '}
                                <span className="px-2 py-0.5 bg-[#E2E8D4] text-[#3E5C3D] rounded text-xs font-medium">
                                    {preview.suggested_category_name}
                                </span>
                            </div>
                        )}
                    </div>

                    {preview.description && (
                        <div className="text-xs">
                            <span className="text-[#9A8F85]">Description:</span>
                            <p className="text-[#2D2825] mt-1 line-clamp-2">{preview.description}</p>
                        </div>
                    )}

                    <button
                        type="button"
                        onClick={handleApply}
                        className="w-full mt-2 px-4 py-2 bg-[#3E5C3D] text-white rounded-lg text-sm font-medium hover:bg-[#2D2825] transition-colors"
                    >
                        Apply to Form
                    </button>
                </div>
            )}
        </div>
    );
}
