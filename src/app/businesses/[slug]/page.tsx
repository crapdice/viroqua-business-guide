import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function BusinessDetailPage({ params }: { params: { slug: string } }) {
    const { slug } = await params;

    // Fetch business with its category
    const { data: business, error } = await supabase
        .from('businesses')
        .select('*, categories(name, slug)')
        .eq('slug', slug)
        .single();

    if (error || !business) {
        return notFound();
    }

    return (
        <div className="min-h-screen bg-white dark:bg-zinc-950">
            {/* Hero Header */}
            <div className="relative h-[40vh] min-h-[400px] w-full bg-zinc-900">
                {business.hero_image_url ? (
                    <Image
                        src={business.hero_image_url}
                        alt={business.name}
                        fill
                        className="object-cover opacity-60"
                        priority
                    />
                ) : (
                    <div className="absolute inset-0 bg-emerald-950/20" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950  to-transparent" />
                <div className="absolute inset-x-0 bottom-0 px-6 pb-12">
                    <div className="mx-auto max-w-7xl">
                        <Link
                            href={`/categories/${business.categories?.slug}`}
                            className="mb-4 inline-block rounded-full bg-emerald-500/20 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-400 backdrop-blur-md"
                        >
                            {business.categories?.name}
                        </Link>
                        <h1 className="text-4xl font-extrabold text-white sm:text-6xl">
                            {business.name}
                        </h1>
                    </div>
                </div>
            </div>

            <main className="mx-auto max-w-7xl px-6 py-12">
                <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
                    {/* Main Info */}
                    <div className="lg:col-span-2 space-y-8">
                        <section>
                            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-4">About</h2>
                            <div className="prose prose-zinc dark:prose-invert max-w-none">
                                <p className="text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
                                    {business.description || 'No description available for this business.'}
                                </p>
                            </div>
                        </section>

                        {/* Structured Info / Features */}
                        <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Could add more structured fields here later */}
                        </section>
                    </div>

                    {/* Sidebar Info */}
                    <aside className="space-y-6">
                        <div className="rounded-3xl bg-zinc-50 p-8 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 mb-6 font-mono uppercase tracking-widest text-xs opacity-50">Contact info</h3>

                            <div className="space-y-6">
                                {business.address && (
                                    <div className="flex items-start gap-4">
                                        <span className="text-xl">📍</span>
                                        <div>
                                            <p className="font-semibold text-zinc-900 dark:text-zinc-50">Address</p>
                                            <p className="text-zinc-600 dark:text-zinc-400">{business.address}</p>
                                        </div>
                                    </div>
                                )}

                                {business.phone && (
                                    <div className="flex items-start gap-4">
                                        <span className="text-xl">📞</span>
                                        <div>
                                            <p className="font-semibold text-zinc-900 dark:text-zinc-50">Phone</p>
                                            <a href={`tel:${business.phone}`} className="text-emerald-600 hover:underline">
                                                {business.phone}
                                            </a>
                                        </div>
                                    </div>
                                )}

                                {business.email && (
                                    <div className="flex items-start gap-4">
                                        <span className="text-xl">✉️</span>
                                        <div>
                                            <p className="font-semibold text-zinc-900 dark:text-zinc-50">Email</p>
                                            <a href={`mailto:${business.email}`} className="text-emerald-600 hover:underline">
                                                {business.email}
                                            </a>
                                        </div>
                                    </div>
                                )}

                                {business.website && (
                                    <div className="mt-8">
                                        <a
                                            href={business.website}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="block w-full rounded-2xl bg-emerald-600 py-4 text-center font-bold text-white shadow-lg transition-transform hover:-translate-y-0.5"
                                        >
                                            Visit Website
                                        </a>
                                    </div>
                                )}

                                {/* Social Links */}
                                <div className="flex items-center gap-4 mt-4">
                                    {business.facebook_url && (
                                        <a href={business.facebook_url} target="_blank" rel="noopener noreferrer" className="text-2xl hover:scale-110 transition-transform">
                                            📘
                                        </a>
                                    )}
                                    {business.instagram_url && (
                                        <a href={business.instagram_url} target="_blank" rel="noopener noreferrer" className="text-2xl hover:scale-110 transition-transform">
                                            📸
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Hours Section (if available) */}
                        {business.opening_hours && (
                            <div className="rounded-3xl bg-zinc-900 p-8 text-white">
                                <h3 className="text-xs font-mono uppercase tracking-widest opacity-50 mb-6">Opening Hours</h3>
                                <pre className="text-sm font-sans whitespace-pre-wrap opacity-80">
                                    {JSON.stringify(business.opening_hours, null, 2)}
                                </pre>
                            </div>
                        )}
                    </aside>
                </div>
            </main>
        </div>
    );
}
