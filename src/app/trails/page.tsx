import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight, Clock, MapPin } from 'lucide-react';

// ISR: Revalidate trails listing every hour (3600 seconds)
export const revalidate = 3600;

export default async function TrailsPage() {
    const { data: trails } = await supabase
        .from('trails')
        .select(`
            *,
            stops:trail_stops(id)
        `)
        .order('name');

    return (
        <div className="min-h-screen bg-[#FDFCFB] text-[#3A332E]">
            {/* Almanac Page Header */}
            <div className="border-b border-[#EBE3D5] bg-[#FAF9F6]">
                <div className="mx-auto max-w-7xl px-6 py-16 lg:py-24">
                    <div className="mb-6 flex items-center gap-3">
                        <span className="h-[1px] w-12 bg-[#3E5C3D]"></span>
                        <span className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-[#3E5C3D]">The Driftless Itineraries</span>
                    </div>
                    <h1 className="font-serif text-6xl lg:text-8xl font-bold tracking-tight text-[#2D2825] leading-none mb-8">
                        Driftless <span className="text-[#3E5C3D] italic">Trails.</span>
                    </h1>
                    <p className="max-w-xl text-xl text-[#6B5E55] font-sans leading-relaxed">
                        Curated journeys through the Coulees. From the first cup of coffee to an evening by the river, these trails lead you to the soul of Viroqua.
                    </p>
                </div>
            </div>

            <main className="mx-auto max-w-7xl px-6 py-20">
                {!trails || trails.length === 0 ? (
                    <div className="text-center py-20 border-2 border-dashed border-[#EBE3D5] rounded-[2.5rem]">
                        <p className="font-serif text-2xl text-[#9A8F85]">The trail is waiting to be blazed.</p>
                        <p className="mt-2 text-[#6B5E55]">We couldn't find any itineraries in the local registry.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {trails.map((trail) => (
                            <Link
                                key={trail.id}
                                href={`/trails/${trail.slug}`}
                                className="group relative flex flex-col md:flex-row bg-white border border-[#EBE3D5] rounded-[2.5rem] overflow-hidden hover:shadow-2xl transition-all duration-700 hover:-translate-y-1"
                            >
                                <div className="relative w-full md:w-2/5 aspect-[4/5] md:aspect-auto">
                                    <Image
                                        src={trail.cover_image_url || '/trails/early-bird.png'}
                                        alt={trail.name}
                                        fill
                                        className="object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/50 to-transparent md:hidden" />
                                </div>

                                <div className="flex-1 p-8 md:p-10 flex flex-col justify-between">
                                    <div>
                                        <div className="flex items-center gap-4 mb-6">
                                            <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-[#9A8F85]">
                                                <Clock size={12} className="text-[#3E5C3D]" />
                                                {trail.duration_estimate}
                                            </span>
                                            <span className="h-4 w-[1px] bg-[#EBE3D5]"></span>
                                            <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-[#9A8F85]">
                                                <MapPin size={12} className="text-[#3E5C3D]" />
                                                {trail.stops?.length || 0} Stops
                                            </span>
                                        </div>
                                        <h2 className="font-serif text-4xl font-bold text-[#2D2825] mb-4 group-hover:text-[#3E5C3D] transition-colors leading-tight">
                                            {trail.name}
                                        </h2>
                                        <p className="text-[#6B5E55] line-clamp-3 leading-relaxed">
                                            {trail.description}
                                        </p>
                                    </div>

                                    <div className="mt-8 flex items-center justify-between">
                                        <span className="font-sans text-xs font-bold uppercase tracking-widest text-[#3E5C3D]">
                                            Explore Path
                                        </span>
                                        <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#EBE3D5] text-[#9A8F85] group-hover:bg-[#3E5C3D] group-hover:text-white group-hover:border-[#3E5C3D] transition-all duration-500">
                                            <ChevronRight size={20} />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
