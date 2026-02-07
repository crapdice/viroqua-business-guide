'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { IconPicker } from '@/components/admin/IconPicker';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface CategoryFormProps {
    category?: {
        id: string;
        name: string;
        slug: string;
        description: string | null;
        icon_text: string | null;
        parent_id: string | null;
    };
    allCategories: { id: string; name: string }[];
}

export function CategoryForm({ category, allCategories }: CategoryFormProps) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        name: category?.name || '',
        slug: category?.slug || '',
        description: category?.description || '',
        icon_text: category?.icon_text || '',
        parent_id: category?.parent_id || '',
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
            slug: category ? prev.slug : generateSlug(name),
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            if (!formData.name.trim()) {
                throw new Error('Category name is required');
            }
            if (!formData.slug.trim()) {
                throw new Error('Slug is required');
            }

            const payload = {
                name: formData.name.trim(),
                slug: formData.slug.trim(),
                description: formData.description?.trim() || null,
                icon_text: formData.icon_text || null,
                parent_id: formData.parent_id || null,
            };

            let result;
            if (category) {
                result = await supabase
                    .from('categories')
                    .update(payload)
                    .eq('id', category.id);
            } else {
                result = await supabase
                    .from('categories')
                    .insert(payload);
            }

            if (result.error) {
                if (result.error.code === '23505') {
                    throw new Error('A category with this slug already exists.');
                }
                throw result.error;
            }

            router.push('/admin/categories');
            router.refresh();
        } catch (err: any) {
            console.error('Save error:', err);
            const errorMessage = err?.message || err?.details || 'Failed to save category. Please try again.';
            setError(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-2xl">
            <div className="flex items-center gap-4 mb-8">
                <Link
                    href="/admin/categories"
                    className="p-2 text-[#6B5E55] hover:text-[#2D2825] hover:bg-[#E2E8D4] rounded-lg transition-colors"
                >
                    <ArrowLeft size={20} />
                </Link>
                <div>
                    <h1 className="font-serif text-3xl font-bold text-[#2D2825]">
                        {category ? 'Edit Category' : 'New Category'}
                    </h1>
                </div>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                    {error}
                </div>
            )}

            <div className="space-y-6 bg-white rounded-2xl p-8 border border-[#EBE3D5]">
                <div>
                    <label className="block text-sm font-medium text-[#2D2825] mb-2">
                        Category Name *
                    </label>
                    <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => handleNameChange(e.target.value)}
                        className="w-full px-4 py-3 border border-[#EBE3D5] rounded-xl focus:outline-none focus:border-[#3E5C3D] transition-colors"
                        placeholder="e.g., Restaurants"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-[#2D2825] mb-2">
                        Slug *
                    </label>
                    <input
                        type="text"
                        required
                        value={formData.slug}
                        onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                        className="w-full px-4 py-3 border border-[#EBE3D5] rounded-xl focus:outline-none focus:border-[#3E5C3D] transition-colors font-mono text-sm"
                        placeholder="e.g., restaurants"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-[#2D2825] mb-2">
                        Icon
                    </label>
                    <IconPicker
                        value={formData.icon_text}
                        onChange={(icon) => setFormData(prev => ({ ...prev, icon_text: icon }))}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-[#2D2825] mb-2">
                        Parent Category
                    </label>
                    <select
                        value={formData.parent_id}
                        onChange={(e) => setFormData(prev => ({ ...prev, parent_id: e.target.value }))}
                        className="w-full px-4 py-3 border border-[#EBE3D5] rounded-xl focus:outline-none focus:border-[#3E5C3D] transition-colors"
                    >
                        <option value="">None (Top Level)</option>
                        {allCategories
                            .filter(c => c.id !== category?.id)
                            .map(c => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))
                        }
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-[#2D2825] mb-2">
                        Description
                    </label>
                    <textarea
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        rows={3}
                        className="w-full px-4 py-3 border border-[#EBE3D5] rounded-xl focus:outline-none focus:border-[#3E5C3D] transition-colors resize-none"
                        placeholder="Brief description of this category..."
                    />
                </div>

                <div className="flex items-center gap-4 pt-4 border-t border-[#EBE3D5]">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex items-center gap-2 px-6 py-3 bg-[#3E5C3D] text-white rounded-xl font-medium hover:bg-[#2D2825] transition-colors disabled:opacity-50"
                    >
                        {isSubmitting ? (
                            <Loader2 size={18} className="animate-spin" />
                        ) : (
                            <Save size={18} />
                        )}
                        {category ? 'Save Changes' : 'Create Category'}
                    </button>
                    <Link
                        href="/admin/categories"
                        className="px-6 py-3 text-[#6B5E55] hover:text-[#2D2825] transition-colors"
                    >
                        Cancel
                    </Link>
                </div>
            </div>
        </form>
    );
}
