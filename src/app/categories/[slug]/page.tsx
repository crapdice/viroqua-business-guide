import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import { getCategoryIcon } from '@/lib/icons';
import { ChevronLeft, MapPin, ArrowRight, Landmark } from 'lucide-react';
import SmartImage from '@/components/SmartImage';
import { Metadata } from 'next';

// ISR: Revalidate category pages every hour (3600 seconds)
export const revalidate = 3600;

export async function generateStaticParams() {
    const { data: categories } = await supabase
        .from('categories')
        .select('slug');

    return (categories || []).map((category) => ({
        slug: category.slug,
    }));
}

export async function generateMetadata(props: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const params = await props.params;
    const { slug } = params;

    try {
        const { data: category } = await supabase
            .from('categories')
            .select('name')
            .eq('slug', slug)
            .single();

        return {
            title: `${category?.name || 'Local Businesses'} in Viroqua, WI | Driftless Guide`,
            description: `Explore the best ${category?.name || 'local businesses'} in Viroqua, Wisconsin. Curated listings for the Driftless region.`,
        };
    } catch (e) {
        console.error('Metadata generation error:', e);
        return {
            title: 'Viroqua Business Guide',
        };
    }
}

export default async function CategoryPage(props: { params: Promise<{ slug: string }> }) {
    const params = await props.params;
    const { slug } = params;

    console.log(`[CategoryPage] Loading slug: ${slug}`);

    const { data: category, error: catErr } = await supabase
        .from('categories')
        .select('*')
        .eq('slug', slug)
        .single();

    if (catErr) {
        console.error('[CategoryPage] Supabase Error:', catErr);
    }

    if (catErr || !category) {
        console.warn(`[CategoryPage] Category not found: ${slug}`);
        return notFound();
    }

    const { data: businesses, error: bizErr } = await supabase
        .from('businesses')
        .select('*')
        .eq('category_id', category.id)
        .eq('is_active', true)
        .order('name');

    const Icon = getCategoryIcon(category.slug);

    return (
        <div className="min-h-screen bg-[#FDFCFB] text-[#3A332E]">
            {/* Almanac Header */}
            <div className="border-b border-[#EBE3D5] bg-[#FAF9F6]">
                <div className="mx-auto max-w-7xl px-6 py-16 lg:py-24">
                    <Link
                        href="/"
                        className="mb-8 inline-flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-[#9A8F85] hover:text-[#3E5C3D] transition-colors"
                    >
                        <ChevronLeft size={14} strokeWidth={3} />
                        The Almanac
                    </Link>

                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                        <div className="flex items-center gap-8">
                            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#E2E8D4] text-[#3E5C3D]">
                                <Icon size={32} strokeWidth={1} />
                            </div>
                            <div>
                                <h1 className="font-serif text-5xl font-bold tracking-tight text-[#2D2825] sm:text-6xl">
                                    {category.name}
                                </h1>
                                <p className="mt-3 font-sans text-[#6B5E55] max-w-lg italic">
                                    A curated collection of {businesses?.length || 0} local establishments serving the Driftless region.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <main className="mx-auto max-w-7xl px-6 py-20">
                {businesses && businesses.length > 0 ? (
                    <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-3">
                        {businesses.map((business) => (
                            <Link
                                key={business.id}
                                href={`/businesses/${business.slug}`}
                                className="group flex flex-col transition-all duration-700"
                            >
                                {/* Image Container with Paper Frame */}
                                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[2rem] bg-[#EBE3D5] p-2 shadow-sm group-hover:shadow-xl transition-all">
                                    <div className="relative h-full w-full overflow-hidden rounded-[1.8rem] bg-[#F4F1EA]">
                                        <SmartImage
                                            src={business.hero_image_url || ''}
                                            alt={business.name}
                                            fill
                                            className="object-cover grayscale-[0.3] sepia-[0.1] transition-all duration-1000 group-hover:grayscale-0 group-hover:scale-105"
                                            categorySlug={category.slug}
                                        />
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="mt-8 px-2">
                                    <h3 className="font-serif text-3xl font-bold text-[#2D2825] group-hover:text-[#3E5C3D] transition-colors">
                                        {business.name}
                                    </h3>
                                    <p className="mt-3 line-clamp-2 text-[#6B5E55] leading-relaxed">
                                        {business.description || 'Dedicated local provider serving our Viroqua community with craftsmanship and care.'}
                                    </p>

                                    <div className="mt-6 flex items-center justify-between border-t border-[#EBE3D5] pt-6">
                                        <div className="flex flex-col gap-2">
                                            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#9A8F85]">
                                                <MapPin size={12} className="text-[#3E5C3D]" />
                                                {business.address?.split(',')[0] || 'Viroqua, WI'}
                                            </div>
                                        </div>

                                        <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#EBE3D5] text-[#9A8F85] group-hover:bg-[#3E5C3D] group-hover:text-white group-hover:border-[#3E5C3D] transition-all duration-500">
                                            <ArrowRight size={18} />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center py-32 text-center">
                        <h2 className="font-serif text-3xl font-bold text-[#2D2825]">End of the Trail</h2>
                        <p className="mt-2 text-[#6B5E55]">We are still gathering information for this community sector.</p>
                        <Link
                            href="/"
                            className="mt-12 inline-flex border-b border-[#3E5C3D] pb-1 font-bold text-[#3E5C3D] hover:text-[#2D2825] hover:border-[#2D2825] transition-all"
                        >
                            Return to Catalog
                        </Link>
                    </div>
                )}
            </main>
        </div>
    );
}
