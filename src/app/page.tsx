import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export default async function CategoriesPage() {
  // Fetch categories with business counts
  // Note: Using a join count in Supabase
  const { data: categoriesWithCounts, error } = await supabase
    .from('categories')
    .select(`
      *,
      businesses:businesses(count)
    `)
    .order('name');

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center p-8">
        <p className="text-red-500">Error loading categories: {error.message}</p>
      </div>
    );
  }

  // Filter out categories with 0 businesses for a more "populated" feel, 
  // or keep them all if you want users to see the empty ones. 
  // Let's keep only those with counts > 0 for premium aesthetics.
  const activeCategories = (categoriesWithCounts || [])
    .map(cat => ({
      ...cat,
      count: cat.businesses?.[0]?.count || 0
    }))
    .filter(cat => cat.count > 0);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 px-6 py-16">
      <div className="mx-auto max-w-7xl">
        <header className="mb-16 text-center">
          <h1 className="text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-6xl">
            Viroqua <span className="text-emerald-600">Directory</span>
          </h1>
          <p className="mt-4 text-xl text-zinc-600 dark:text-zinc-400">
            Discover {activeCategories.reduce((acc, c) => acc + c.count, 0)} businesses across {activeCategories.length} categories.
          </p>
        </header>

        <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {activeCategories.map((category) => (
            <Link
              key={category.id}
              href={`/categories/${category.slug}`}
              className="group relative overflow-hidden rounded-2xl bg-white p-8 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl dark:bg-zinc-900 dark:shadow-none dark:ring-1 dark:ring-white/10"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-3xl text-emerald-700 transition-all group-hover:bg-emerald-600 group-hover:text-white dark:bg-emerald-900/30 dark:text-emerald-400">
                {category.icon_text || '🏙️'}
              </div>

              <div className="mt-6 flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 leading-tight">
                    {category.name}
                  </h3>
                  <p className="mt-1 text-xs font-medium uppercase tracking-wider text-emerald-600 dark:text-emerald-500">
                    {category.count} {category.count === 1 ? 'Business' : 'Businesses'}
                  </p>
                </div>
              </div>

              <div className="absolute bottom-4 right-8 translate-x-4 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100">
                <span className="text-2xl text-emerald-600">→</span>
              </div>
            </Link>
          ))}
        </section>

        {activeCategories.length === 0 && (
          <div className="mt-20 text-center">
            <p className="text-zinc-500 dark:text-zinc-400">Initializing directory data...</p>
          </div>
        )}
      </div>
    </div>
  );
}
