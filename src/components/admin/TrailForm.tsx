'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Loader2, Plus, Trash2, GripVertical } from 'lucide-react';
import { ImageUpload } from '@/components/admin/ImageUpload';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface TrailStop {
    id?: string;
    position: number;
    business_id: string | null;
    tip: string;
    travel_time_to_next: string;
}

interface TrailFormProps {
    trail?: {
        id: string;
        name: string;
        slug: string;
        description: string | null;
        cover_image_url: string | null;
        duration_estimate: string | null;
        difficulty: string | null;
    };
    stops?: TrailStop[];
    businesses: { id: string; name: string }[];
}

export function TrailForm({ trail, stops: initialStops = [], businesses }: TrailFormProps) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        name: trail?.name || '',
        slug: trail?.slug || '',
        description: trail?.description || '',
        cover_image_url: trail?.cover_image_url || '',
        duration_estimate: trail?.duration_estimate || '',
        difficulty: trail?.difficulty || 'Easy',
    });

    const [stops, setStops] = useState<TrailStop[]>(
        initialStops.length > 0
            ? initialStops
            : [{ position: 1, business_id: '', tip: '', travel_time_to_next: '' }]
    );

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
            slug: trail ? prev.slug : generateSlug(name),
        }));
    };

    const addStop = () => {
        setStops(prev => [...prev, {
            position: prev.length + 1,
            business_id: '',
            tip: '',
            travel_time_to_next: ''
        }]);
    };

    const removeStop = (index: number) => {
        setStops(prev => prev.filter((_, i) => i !== index).map((s, i) => ({ ...s, position: i + 1 })));
    };

    const updateStop = (index: number, field: keyof TrailStop, value: string | number) => {
        setStops(prev => prev.map((s, i) => i === index ? { ...s, [field]: value } : s));
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
                cover_image_url: formData.cover_image_url || null,
                duration_estimate: formData.duration_estimate || null,
                difficulty: formData.difficulty || null,
            };

            let trailId = trail?.id;

            if (trail) {
                const { error } = await supabase
                    .from('trails')
                    .update(payload)
                    .eq('id', trail.id);
                if (error) throw error;
            } else {
                const { data, error } = await supabase
                    .from('trails')
                    .insert(payload)
                    .select('id')
                    .single();
                if (error) throw error;
                trailId = data.id;
            }

            // Handle stops
            if (trailId) {
                // Delete existing stops
                await supabase.from('trail_stops').delete().eq('trail_id', trailId);

                // Insert new stops
                const validStops = stops.filter(s => s.business_id);
                if (validStops.length > 0) {
                    const { error: stopsError } = await supabase
                        .from('trail_stops')
                        .insert(validStops.map(s => ({
                            trail_id: trailId,
                            position: s.position,
                            business_id: s.business_id,
                            tip: s.tip || null,
                            travel_time_to_next: s.travel_time_to_next || null,
                        })));
                    if (stopsError) throw stopsError;
                }
            }

            router.push('/admin/trails');
            router.refresh();
        } catch (err: any) {
            console.error('Save error:', err);
            setError(err.message || 'Failed to save trail');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-4xl">
            <div className="flex items-center gap-4 mb-8">
                <Link
                    href="/admin/trails"
                    className="p-2 text-[#6B5E55] hover:text-[#2D2825] hover:bg-[#E2E8D4] rounded-lg transition-colors"
                >
                    <ArrowLeft size={20} />
                </Link>
                <div>
                    <h1 className="font-serif text-3xl font-bold text-[#2D2825]">
                        {trail ? 'Edit Trail' : 'New Trail'}
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
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-2xl p-8 border border-[#EBE3D5]">
                        <h2 className="font-serif text-xl font-bold text-[#2D2825] pb-4 border-b border-[#EBE3D5] mb-6">Trail Details</h2>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-[#2D2825] mb-2">Trail Name *</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => handleNameChange(e.target.value)}
                                    className="w-full px-4 py-3 border border-[#EBE3D5] rounded-xl focus:outline-none focus:border-[#3E5C3D]"
                                    placeholder="e.g., Early Bird Trail"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
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
                                    <label className="block text-sm font-medium text-[#2D2825] mb-2">Difficulty</label>
                                    <select
                                        value={formData.difficulty}
                                        onChange={(e) => setFormData(prev => ({ ...prev, difficulty: e.target.value }))}
                                        className="w-full px-4 py-3 border border-[#EBE3D5] rounded-xl focus:outline-none focus:border-[#3E5C3D]"
                                    >
                                        <option value="Easy">Easy</option>
                                        <option value="Moderate">Moderate</option>
                                        <option value="Challenging">Challenging</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[#2D2825] mb-2">Duration Estimate</label>
                                <input
                                    type="text"
                                    value={formData.duration_estimate}
                                    onChange={(e) => setFormData(prev => ({ ...prev, duration_estimate: e.target.value }))}
                                    className="w-full px-4 py-3 border border-[#EBE3D5] rounded-xl focus:outline-none focus:border-[#3E5C3D]"
                                    placeholder="e.g., Half Day, 2-3 hours"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[#2D2825] mb-2">Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                    rows={3}
                                    className="w-full px-4 py-3 border border-[#EBE3D5] rounded-xl resize-none focus:outline-none focus:border-[#3E5C3D]"
                                    placeholder="Describe this trail experience..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* Stops */}
                    <div className="bg-white rounded-2xl p-8 border border-[#EBE3D5]">
                        <div className="flex items-center justify-between pb-4 border-b border-[#EBE3D5] mb-6">
                            <h2 className="font-serif text-xl font-bold text-[#2D2825]">Trail Stops</h2>
                            <button
                                type="button"
                                onClick={addStop}
                                className="flex items-center gap-2 px-3 py-2 text-sm bg-[#E2E8D4] text-[#3E5C3D] rounded-lg hover:bg-[#3E5C3D] hover:text-white transition-colors"
                            >
                                <Plus size={16} />
                                Add Stop
                            </button>
                        </div>

                        <div className="space-y-4">
                            {stops.map((stop, index) => (
                                <div key={index} className="flex gap-4 p-4 bg-[#FAF9F6] rounded-xl">
                                    <div className="flex items-center text-[#9A8F85]">
                                        <GripVertical size={20} />
                                    </div>
                                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-medium text-[#6B5E55] mb-1">Business</label>
                                            <select
                                                value={stop.business_id || ''}
                                                onChange={(e) => updateStop(index, 'business_id', e.target.value)}
                                                className="w-full px-3 py-2 border border-[#EBE3D5] rounded-lg text-sm focus:outline-none focus:border-[#3E5C3D]"
                                            >
                                                <option value="">Select a business...</option>
                                                {businesses.map(b => (
                                                    <option key={b.id} value={b.id}>{b.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-[#6B5E55] mb-1">Travel Time to Next</label>
                                            <input
                                                type="text"
                                                value={stop.travel_time_to_next}
                                                onChange={(e) => updateStop(index, 'travel_time_to_next', e.target.value)}
                                                className="w-full px-3 py-2 border border-[#EBE3D5] rounded-lg text-sm focus:outline-none focus:border-[#3E5C3D]"
                                                placeholder="e.g., 2 min walk"
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-xs font-medium text-[#6B5E55] mb-1">Insider Tip</label>
                                            <input
                                                type="text"
                                                value={stop.tip}
                                                onChange={(e) => updateStop(index, 'tip', e.target.value)}
                                                className="w-full px-3 py-2 border border-[#EBE3D5] rounded-lg text-sm focus:outline-none focus:border-[#3E5C3D]"
                                                placeholder="A local tip for visitors..."
                                            />
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => removeStop(index)}
                                        className="p-2 text-[#9A8F85] hover:text-red-500 transition-colors"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <div className="bg-white rounded-2xl p-6 border border-[#EBE3D5]">
                        <h3 className="font-medium text-[#2D2825] mb-4">Cover Image</h3>
                        <ImageUpload
                            value={formData.cover_image_url}
                            onChange={(url) => setFormData(prev => ({ ...prev, cover_image_url: url }))}
                            folder="trail-covers"
                            label="Upload Cover Image"
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
                            {trail ? 'Save Changes' : 'Create Trail'}
                        </button>
                        <Link
                            href="/admin/trails"
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
