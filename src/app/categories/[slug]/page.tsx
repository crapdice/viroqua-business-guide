import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function CategoryBusinessesPage({ params }: { params: { slug: string } }) {
    const { slug } = await params;

    // 1. Fetch the category
    const { data: category, error: catError } = await supabase
        .from('categories')
        .select('id, name')
        .eq('slug', slug)
        .single();

    if (catError || !category) {
        return notFound();
    }

    // 2. Fetch businesses in this category
    const { data: businesses, error: bizError } = await supabase
        .from('businesses')
        .select('*')
        .eq('category_id', category.id)
        .eq('is_active', true)
        .order('name');

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 px-6 py-12">
            <div className="mx-auto max-w-7xl">
                <nav className="mb-8">
                    <Link href="/" className="text-sm font-medium text-emerald-600 hover:underline">
                        ← Back to Categories
                    </Link>
                </nav>

                <header className="mb-12 border-b border-zinc-200 pb-8 dark:border-zinc-800">
                    <h1 className="text-4xl font-extrabold text-zinc-900 dark:text-zinc-50">
                        {category.name}
                    </h1>
                    <p className="mt-2 text-zinc-600 dark:text-zinc-400">
                        Found {businesses?.length || 0} local businesses
                    </p>
                </header>

                <section className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {businesses?.map((business) => (
                        <Link
                            key={business.id}
                            href={`/businesses/${business.slug}`}
                            className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm transition-all hover:shadow-lg dark:bg-zinc-900 dark:ring-1 dark:ring-white/10"
                        >
                            <div className="relative h-48 w-full bg-zinc-100 dark:bg-zinc-800">
                                {business.hero_image_url ? (
                                    <Image
                                        src={business.hero_image_url}
                                        alt={business.name}
                                        fill
                                        className="object-cover transition-transform group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center text-zinc-400">
                                        No Image
                                    </div>
                                )}
                                {/* Overlay for glassmorphism effect on text */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                <div className="absolute bottom-4 left-4 right-4">
                                    <h3 className="text-xl font-bold text-white line-clamp-1">
                                        {business.name}
                                    </h3>
                                </div>
                            </div>
                            <div className="flex flex-1 flex-col p-6">
                                <p className="line-clamp-2 text-sm text-zinc-600 dark:text-zinc-400">
                                    {business.description || 'No description available.'}
                                </p>
                                <div className="mt-auto pt-4 flex flex-col gap-1 text-xs text-zinc-500 dark:text-zinc-400">
                                    <div className="flex items-center gap-1">
                                        <span className="text-emerald-500">📍</span>
                                        {business.address || 'Viroqua, WI'}
                                    </div>
                                    {business.phone && (
                                        <div className="flex items-center gap-1">
                                            <span className="text-emerald-500">📞</span>
                                            {business.phone}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Link>
                    ))}
                </section>

                {businesses?.length === 0 && (
                    <div className="mt-20 text-center">
                        <p className="text-zinc-500 dark:text-zinc-400">No businesses found in this category yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
