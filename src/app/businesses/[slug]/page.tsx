import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import { ChevronLeft, MapPin, Phone, Mail, Globe, Facebook, Instagram, Landmark } from 'lucide-react';
import SmartImage from '@/components/SmartImage';
import { Metadata } from 'next';

// ISR: Revalidate business detail pages every hour (3600 seconds)
export const revalidate = 3600;

export async function generateMetadata(props: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const params = await props.params;
    const { slug } = params;
    const { data: business } = await supabase
        .from('businesses')
        .select('name, description')
        .eq('slug', slug)
        .single();

    return {
        title: `${business?.name || 'Local Business'} | Viroqua, WI | Driftless Guide`,
        description: business?.description || `Visit ${business?.name} in Viroqua, Wisconsin. Discover local makers and businesses in the Driftless region.`,
    };
}

export default async function BusinessDetailPage(props: { params: Promise<{ slug: string }> }) {
    const params = await props.params;
    const { slug } = params;

    const { data: business, error } = await supabase
        .from('businesses')
        .select('*, categories(name, slug)')
        .eq('slug', slug)
        .single();

    if (error || !business) {
        return notFound();
    }

    // JSON-LD Structured Data
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'LocalBusiness',
        name: business.name,
        description: business.description,
        address: {
            '@type': 'PostalAddress',
            streetAddress: business.address,
            addressLocality: business.city || 'Viroqua',
            addressRegion: business.state || 'WI',
            postalCode: business.zip,
        },
        telephone: business.phone,
        url: business.website,
        image: business.hero_image_url,
    };

    return (
        <div className="min-h-screen bg-[#FDFCFB] text-[#3A332E]">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            {/* Heritage Header */}
            <div className="relative h-[50vh] min-h-[500px] w-full bg-[#EBE3D5]">
                <SmartImage
                    src={business.hero_image_url || ''}
                    alt={business.name}
                    fill
                    className="object-cover grayscale-[0.2] sepia-[0.1]"
                    priority
                    categorySlug={business.categories?.slug}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#FDFCFB] via-transparent to-transparent" />

                <div className="absolute inset-x-0 bottom-0 px-6 pb-12">
                    <div className="mx-auto max-w-7xl">
                        <Link
                            href={`/categories/${business.categories?.slug}`}
                            className="mb-6 inline-flex items-center gap-2 rounded-full bg-[#E2E8D4]/90 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-[#3E5C3D] backdrop-blur-sm shadow-sm"
                        >
                            {business.categories?.name}
                        </Link>
                        <h1 className="font-serif text-5xl font-bold text-[#2D2825] sm:text-7xl lg:text-8xl leading-tight">
                            {business.name}
                        </h1>
                    </div>
                </div>
            </div>

            <main className="mx-auto max-w-7xl px-6 py-16">
                <div className="grid grid-cols-1 gap-16 lg:grid-cols-3">
                    {/* Narrative Section */}
                    <div className="lg:col-span-2 space-y-12">
                        <section>
                            <h2 className="font-serif text-3xl font-bold text-[#2D2825] mb-6 flex items-center gap-4">
                                <span className="h-[1px] w-8 bg-[#3E5C3D]"></span>
                                Our Story
                            </h2>
                            <div className="prose prose-stone max-w-none">
                                <p className="font-serif text-xl leading-relaxed text-[#6B5E55]">
                                    {business.description || 'This establishment is a proud thread in the fabric of Viroqua, contributing to the unique character and craftsmanship of the Driftless region.'}
                                </p>
                            </div>
                        </section>

                        <section className="grid grid-cols-1 sm:grid-cols-2 gap-8 opacity-50 italic font-serif text-[#6B5E55]">
                            <p>"Viroqua is not just a place on a map, but a community of makers and growers."</p>
                        </section>
                    </div>

                    {/* Registry Info (Sidebar) */}
                    <aside className="space-y-8">
                        <div className="rounded-[2.5rem] bg-[#FAF9F6] p-10 border border-[#EBE3D5] shadow-sm">
                            <h3 className="mb-10 font-sans text-xs font-black uppercase tracking-[0.25em] text-[#9A8F85]">Registry Records</h3>

                            <div className="space-y-8">
                                {business.address && (
                                    <div className="flex items-start gap-4">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#E2E8D4] text-[#3E5C3D]">
                                            <MapPin size={18} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-[#9A8F85] mb-1">Establishment Address</p>
                                            <p className="font-serif text-lg text-[#2D2825]">{business.address}</p>
                                        </div>
                                    </div>
                                )}

                                {business.phone && (
                                    <div className="flex items-start gap-4">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#E2E8D4] text-[#3E5C3D]">
                                            <Phone size={18} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-[#9A8F85] mb-1">Voice Registry</p>
                                            <a href={`tel:${business.phone}`} className="font-serif text-lg text-[#3E5C3D] hover:underline decoration-thickness-2">
                                                {business.phone}
                                            </a>
                                        </div>
                                    </div>
                                )}

                                {business.email && (
                                    <div className="flex items-start gap-4">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#E2E8D4] text-[#3E5C3D]">
                                            <Mail size={18} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-[#9A8F85] mb-1">Direct Correspondence</p>
                                            <a href={`mailto:${business.email}`} className="font-serif text-lg text-[#3E5C3D] hover:underline decoration-thickness-2">
                                                {business.email}
                                            </a>
                                        </div>
                                    </div>
                                )}

                                {business.website && (
                                    <div className="mt-12 pt-8 border-t border-[#EBE3D5]">
                                        <a
                                            href={business.website}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="group flex items-center justify-center gap-3 w-full rounded-2xl bg-[#3E5C3D] py-5 text-center font-bold text-white shadow-lg transition-all hover:bg-[#2D2825]"
                                        >
                                            <Globe size={18} />
                                            Visit Digital Catalog
                                        </a>
                                    </div>
                                )}

                                {/* Social Connection */}
                                {(business.facebook_url || business.instagram_url) && (
                                    <div className="flex items-center justify-center gap-6 mt-6">
                                        {business.facebook_url && (
                                            <a href={business.facebook_url} target="_blank" rel="noopener noreferrer" className="text-[#9A8F85] hover:text-[#3E5C3D] transition-colors">
                                                <Facebook size={24} strokeWidth={1.5} />
                                            </a>
                                        )}
                                        {business.instagram_url && (
                                            <a href={business.instagram_url} target="_blank" rel="noopener noreferrer" className="text-[#9A8F85] hover:text-[#3E5C3D] transition-colors">
                                                <Instagram size={24} strokeWidth={1.5} />
                                            </a>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Hours / Chronometry */}
                        {business.opening_hours && (
                            <div className="rounded-[2.5rem] bg-[#3E5C3D] p-10 text-white shadow-xl">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.25em] opacity-60 mb-8 font-sans">Business Hours</h3>
                                <div className="space-y-4 font-serif text-lg opacity-90">
                                    {/* Simplified view of JSON hours if needed */}
                                    <p>{typeof business.opening_hours === 'string' ? business.opening_hours : 'Open for the community during standard hours.'}</p>
                                </div>
                            </div>
                        )}
                    </aside>
                </div>

                <div className="mt-20 pt-12 border-t border-[#EBE3D5]">
                    <Link href="/" className="font-serif italic text-[#3E5C3D] hover:text-[#2D2825] transition-colors">
                        ← Return to the Driftless Guide
                    </Link>
                </div>
            </main>
        </div>
    );
}
