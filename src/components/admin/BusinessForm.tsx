'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { ImageUpload } from '@/components/admin/ImageUpload';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface BusinessFormProps {
    business?: {
        id: string;
        name: string;
        slug: string;
        description: string | null;
        address: string | null;
        city: string | null;
        state: string | null;
        zip: string | null;
        phone: string | null;
        email: string | null;
        website: string | null;
        hero_image_url: string | null;
        logo_url: string | null;
        category_id: string | null;
        is_active: boolean | null;
        instagram_url: string | null;
        facebook_url: string | null;
    };
    categories: { id: string; name: string }[];
}

export function BusinessForm({ business, categories }: BusinessFormProps) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        name: business?.name || '',
        slug: business?.slug || '',
        description: business?.description || '',
        address: business?.address || '',
        city: business?.city || 'Viroqua',
        state: business?.state || 'WI',
        zip: business?.zip || '',
        phone: business?.phone || '',
        email: business?.email || '',
        website: business?.website || '',
        hero_image_url: business?.hero_image_url || '',
        logo_url: business?.logo_url || '',
        category_id: business?.category_id || '',
        is_active: business?.is_active ?? true,
        instagram_url: business?.instagram_url || '',
        facebook_url: business?.facebook_url || '',
    });

    const generateSlug = (name: string) => {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    };

    const handleNameChange = (name: string) => {
        setFormData(prev => ({
            ...prev,
            name,
            slug: business ? prev.slug : generateSlug(name),
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            const payload = {
                name: formData.name,
                slug: formData.slug,
                description: formData.description || null,
                address: formData.address || null,
                city: formData.city || null,
                state: formData.state || null,
                zip: formData.zip || null,
                phone: formData.phone || null,
                email: formData.email || null,
                website: formData.website || null,
                hero_image_url: formData.hero_image_url || null,
                logo_url: formData.logo_url || null,
                category_id: formData.category_id || null,
                is_active: formData.is_active,
                instagram_url: formData.instagram_url || null,
                facebook_url: formData.facebook_url || null,
            };

            if (business) {
                const { error } = await supabase
                    .from('businesses')
                    .update(payload)
                    .eq('id', business.id);
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('businesses')
                    .insert(payload);
                if (error) throw error;
            }

            router.push('/admin/businesses');
            router.refresh();
        } catch (err: any) {
            console.error('Save error:', err);
            setError(err.message || 'Failed to save business');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-4xl">
            <div className="flex items-center gap-4 mb-8">
                <Link
                    href="/admin/businesses"
                    className="p-2 text-[#6B5E55] hover:text-[#2D2825] hover:bg-[#E2E8D4] rounded-lg transition-colors"
                >
                    <ArrowLeft size={20} />
                </Link>
                <div>
                    <h1 className="font-serif text-3xl font-bold text-[#2D2825]">
                        {business ? 'Edit Business' : 'New Business'}
                    </h1>
                </div>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Info */}
                <div className="lg:col-span-2 space-y-6 bg-white rounded-2xl p-8 border border-[#EBE3D5]">
                    <h2 className="font-serif text-xl font-bold text-[#2D2825] pb-4 border-b border-[#EBE3D5]">Basic Information</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-[#2D2825] mb-2">Business Name *</label>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => handleNameChange(e.target.value)}
                                className="w-full px-4 py-3 border border-[#EBE3D5] rounded-xl focus:outline-none focus:border-[#3E5C3D]"
                                placeholder="e.g., The Driftless Cafe"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[#2D2825] mb-2">Slug *</label>
                            <input
                                type="text"
                                required
                                value={formData.slug}
                                onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                                className="w-full px-4 py-3 border border-[#EBE3D5] rounded-xl font-mono text-sm focus:outline-none focus:border-[#3E5C3D]"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[#2D2825] mb-2">Category</label>
                            <select
                                value={formData.category_id}
                                onChange={(e) => setFormData(prev => ({ ...prev, category_id: e.target.value }))}
                                className="w-full px-4 py-3 border border-[#EBE3D5] rounded-xl focus:outline-none focus:border-[#3E5C3D]"
                            >
                                <option value="">Select a category...</option>
                                {categories.map(c => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[#2D2825] mb-2">Description</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                            rows={4}
                            className="w-full px-4 py-3 border border-[#EBE3D5] rounded-xl resize-none focus:outline-none focus:border-[#3E5C3D]"
                            placeholder="Tell the story of this business..."
                        />
                    </div>

                    <h2 className="font-serif text-xl font-bold text-[#2D2825] pb-4 border-b border-[#EBE3D5] pt-4">Location & Contact</h2>

                    <div>
                        <label className="block text-sm font-medium text-[#2D2825] mb-2">Street Address</label>
                        <input
                            type="text"
                            value={formData.address}
                            onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                            className="w-full px-4 py-3 border border-[#EBE3D5] rounded-xl focus:outline-none focus:border-[#3E5C3D]"
                            placeholder="123 Main St"
                        />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-[#2D2825] mb-2">City</label>
                            <input
                                type="text"
                                value={formData.city}
                                onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                                className="w-full px-4 py-3 border border-[#EBE3D5] rounded-xl focus:outline-none focus:border-[#3E5C3D]"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[#2D2825] mb-2">State</label>
                            <input
                                type="text"
                                value={formData.state}
                                onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
                                className="w-full px-4 py-3 border border-[#EBE3D5] rounded-xl focus:outline-none focus:border-[#3E5C3D]"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[#2D2825] mb-2">ZIP</label>
                            <input
                                type="text"
                                value={formData.zip}
                                onChange={(e) => setFormData(prev => ({ ...prev, zip: e.target.value }))}
                                className="w-full px-4 py-3 border border-[#EBE3D5] rounded-xl focus:outline-none focus:border-[#3E5C3D]"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-[#2D2825] mb-2">Phone</label>
                            <input
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                                className="w-full px-4 py-3 border border-[#EBE3D5] rounded-xl focus:outline-none focus:border-[#3E5C3D]"
                                placeholder="(608) 555-0123"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[#2D2825] mb-2">Email</label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                                className="w-full px-4 py-3 border border-[#EBE3D5] rounded-xl focus:outline-none focus:border-[#3E5C3D]"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[#2D2825] mb-2">Website</label>
                        <input
                            type="url"
                            value={formData.website}
                            onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                            className="w-full px-4 py-3 border border-[#EBE3D5] rounded-xl focus:outline-none focus:border-[#3E5C3D]"
                            placeholder="https://..."
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-[#2D2825] mb-2">Instagram URL</label>
                            <input
                                type="url"
                                value={formData.instagram_url}
                                onChange={(e) => setFormData(prev => ({ ...prev, instagram_url: e.target.value }))}
                                className="w-full px-4 py-3 border border-[#EBE3D5] rounded-xl focus:outline-none focus:border-[#3E5C3D]"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[#2D2825] mb-2">Facebook URL</label>
                            <input
                                type="url"
                                value={formData.facebook_url}
                                onChange={(e) => setFormData(prev => ({ ...prev, facebook_url: e.target.value }))}
                                className="w-full px-4 py-3 border border-[#EBE3D5] rounded-xl focus:outline-none focus:border-[#3E5C3D]"
                            />
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <div className="bg-white rounded-2xl p-6 border border-[#EBE3D5]">
                        <h3 className="font-medium text-[#2D2825] mb-4">Status</h3>
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={formData.is_active}
                                onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                                className="w-5 h-5 rounded border-[#EBE3D5] text-[#3E5C3D] focus:ring-[#3E5C3D]"
                            />
                            <span className="text-sm text-[#2D2825]">Active (visible on site)</span>
                        </label>
                    </div>

                    <div className="bg-white rounded-2xl p-6 border border-[#EBE3D5]">
                        <h3 className="font-medium text-[#2D2825] mb-4">Hero Image</h3>
                        <ImageUpload
                            value={formData.hero_image_url}
                            onChange={(url) => setFormData(prev => ({ ...prev, hero_image_url: url }))}
                            folder="hero-images"
                            label="Upload Hero Image"
                        />
                    </div>

                    <div className="bg-white rounded-2xl p-6 border border-[#EBE3D5]">
                        <h3 className="font-medium text-[#2D2825] mb-4">Business Logo</h3>
                        <ImageUpload
                            value={formData.logo_url}
                            onChange={(url) => setFormData(prev => ({ ...prev, logo_url: url }))}
                            folder="logos"
                            label="Upload Logo"
                        />
                    </div>

                    <div className="flex flex-col gap-3">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex items-center justify-center gap-2 px-6 py-3 bg-[#3E5C3D] text-white rounded-xl font-medium hover:bg-[#2D2825] transition-colors disabled:opacity-50"
                        >
                            {isSubmitting ? (
                                <Loader2 size={18} className="animate-spin" />
                            ) : (
                                <Save size={18} />
                            )}
                            {business ? 'Save Changes' : 'Create Business'}
                        </button>
                        <Link
                            href="/admin/businesses"
                            className="text-center px-6 py-3 text-[#6B5E55] hover:text-[#2D2825] transition-colors"
                        >
                            Cancel
                        </Link>
                    </div>
                </div>
            </div>
        </form>
    );
}
