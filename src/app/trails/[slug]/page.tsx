import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, Clock, MapPin, Sparkles, ArrowRight } from 'lucide-react';
import SmartImage from '@/components/SmartImage';
import { Metadata } from 'next';

// ISR: Revalidate trail detail pages every hour (3600 seconds)
export const revalidate = 3600;

export async function generateMetadata(props: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const params = await props.params;
    const { slug } = params;
    const { data: trail } = await supabase
        .from('trails')
        .select('name, description')
        .eq('slug', slug)
        .single();

    return {
        title: `${trail?.name || 'Itinerary'} | Viroqua Trails | Driftless Guide`,
        description: trail?.description || `Follow the ${trail?.name} through Viroqua, Wisconsin. Discover local gems on this curated trail.`,
    };
}

export default async function TrailDetailPage(props: { params: Promise<{ slug: string }> }) {
    const params = await props.params;
    const slug = params.slug;

    const { data: trail, error } = await supabase
        .from('trails')
        .select(`
            *,
            stops:trail_stops(
                *,
                business:businesses(
                    *,
                    categories(name, slug)
                )
            )
        `)
        .eq('slug', slug)
        .order('position', { foreignTable: 'trail_stops' })
        .single();

    if (error || !trail) return notFound();

    return (
        <div className="min-h-screen bg-[#FDFCFB] text-[#3A332E]">
            {/* Immersive Header */}
            <div className="relative h-[60vh] min-h-[500px] w-full bg-[#EBE3D5]">
                <Image
                    src={trail.cover_image_url || '/trails/early-bird.png'}
                    alt={trail.name}
                    fill
                    className="object-cover grayscale-[0.2] sepia-[0.1]"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#FDFCFB] via-[#FDFCFB]/40 to-black/30" />

                <div className="absolute inset-0 flex flex-col justify-between p-8 md:p-16">
                    <Link
                        href="/trails"
                        className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white drop-shadow-md hover:text-[#E2E8D4] transition-colors"
                    >
                        <ChevronLeft size={16} strokeWidth={3} />
                        Back to Trails
                    </Link>

                    <div className="max-w-4xl">
                        <div className="flex items-center gap-4 mb-6">
                            <span className="backdrop-blur-md bg-white/20 border border-white/30 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest text-white shadow-sm flex items-center gap-2">
                                <Clock size={14} />
                                {trail.duration_estimate}
                            </span>
                            <span className="backdrop-blur-md bg-[#3E5C3D]/80 border border-white/30 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest text-white shadow-sm flex items-center gap-2">
                                <Sparkles size={14} />
                                {trail.difficulty}
                            </span>
                        </div>
                        <h1 className="font-serif text-6xl md:text-8xl font-bold text-[#2D2825] leading-tight mb-6">
                            {trail.name}
                        </h1>
                        <p className="text-xl md:text-2xl text-[#3A332E] font-sans max-w-2xl leading-relaxed">
                            {trail.description}
                        </p>
                    </div>
                </div>
            </div>

            <main className="mx-auto max-w-5xl px-6 py-24">
                <div className="space-y-32">
                    {trail.stops && trail.stops.length > 0 ? (
                        trail.stops.map((stop: any, idx: number) => (
                            <div key={stop.id} className="relative">
                                {/* Connector Line */}
                                {idx !== trail.stops.length - 1 && (
                                    <div className="absolute left-6 top-16 bottom-[-8rem] w-[2px] bg-gradient-to-b from-[#3E5C3D] to-[#EBE3D5] hidden md:block" />
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
                                    {/* Timeline Circle */}
                                    <div className="md:col-span-1 hidden md:flex flex-col items-center">
                                        <div className="h-12 w-12 rounded-full bg-[#3E5C3D] text-white flex items-center justify-center font-serif text-xl font-bold shadow-lg ring-8 ring-[#E2E8D4]">
                                            {stop.position}
                                        </div>
                                    </div>

                                    {/* Content Card */}
                                    <div className="md:col-span-11 bg-white border border-[#EBE3D5] rounded-[3rem] p-8 md:p-12 shadow-sm hover:shadow-xl transition-all duration-500">
                                        <div className="flex flex-col lg:flex-row gap-8 lg:items-center">
                                            <div className="flex-1">
                                                <div className="mb-4 flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-[#9A8F85]">
                                                    <span className="text-[#3E5C3D]">Stop {stop.position}</span>
                                                    <span className="h-1 w-1 rounded-full bg-[#EBE3D5]"></span>
                                                    <span>{stop.business.categories?.name || 'Local Gem'}</span>
                                                </div>
                                                <h2 className="font-serif text-4xl font-bold text-[#2D2825] mb-6">
                                                    {stop.business.name}
                                                </h2>

                                                <div className="prose prose-stone mb-8">
                                                    <p className="text-lg text-[#6B5E55] leading-relaxed italic border-l-4 border-[#3E5C3D] pl-6 font-serif">
                                                        “{stop.tip}”
                                                    </p>
                                                </div>

                                                <div className="flex flex-wrap gap-4 items-center">
                                                    <Link
                                                        href={`/businesses/${stop.business.slug}`}
                                                        className="inline-flex items-center gap-3 rounded-2xl bg-[#3E5C3D] px-6 py-3 font-bold text-white hover:bg-[#2D2825] transition-all"
                                                    >
                                                        View Details
                                                        <ArrowRight size={18} />
                                                    </Link>
                                                    {stop.travel_time_to_next && (
                                                        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#9A8F85]">
                                                            <Clock size={14} className="text-[#3E5C3D]" />
                                                            Next Stop: {stop.travel_time_to_next}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="w-full lg:w-1/3 aspect-[4/3] relative rounded-[2rem] overflow-hidden bg-[#FAF9F6]">
                                                <SmartImage
                                                    src={stop.business.hero_image_url || ''}
                                                    alt={stop.business.name}
                                                    fill
                                                    className="object-cover grayscale-[0.2] hover:grayscale-0 transition-all duration-700"
                                                    categorySlug={stop.business.categories?.slug}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-20">
                            <p className="font-serif text-2xl text-[#9A8F85]">This trail is still being mapped.</p>
                            <p className="mt-2 text-[#6B5E55]">Check back soon as we add more stops to this journey.</p>
                        </div>
                    )}
                </div>

                {/* Final Footer */}
                <div className="mt-32 pt-20 border-t border-[#EBE3D5] text-center">
                    <p className="font-serif italic text-3xl text-[#2D2825]">“The trail is the destination.”</p>
                    <Link
                        href="/trails"
                        className="mt-12 inline-flex items-center gap-3 rounded-full border border-[#3E5C3D] px-8 py-4 font-bold text-[#3E5C3D] hover:bg-[#3E5C3D] hover:text-white transition-all"
                    >
                        Explore More Trails
                    </Link>
                </div>
            </main>
        </div>
    );
}
