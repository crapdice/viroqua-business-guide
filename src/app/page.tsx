import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import { getCategoryIcon } from '@/lib/icons';
import { HeroCarousel } from '@/components/HeroCarousel';

// ISR: Revalidate homepage every hour (3600 seconds)
export const revalidate = 3600;

export default async function CategoriesPage() {
  const { data: categoriesWithCounts, error } = await supabase
    .from('categories')
    .select(`
      *,
      businesses:businesses(count)
    `)
    .order('name');

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center p-8 bg-[#FDFCFB]">
        <p className="font-serif text-red-800">Connection to the local registry failed. Please try again.</p>
      </div>
    );
  }

  const activeCategories = (categoriesWithCounts || [])
    .map(cat => ({
      ...cat,
      count: cat.businesses?.[0]?.count || 0
    }))
    .filter(cat => cat.count > 0);

  const totalBusinesses = activeCategories.reduce((acc, c) => acc + c.count, 0);

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-[#3A332E] font-sans">
      {/* Heritage Hero Section */}
      <section className="relative overflow-hidden pt-24 pb-32">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="mb-6 flex items-center gap-3">
                <span className="h-[1px] w-12 bg-[#3E5C3D]"></span>
                <span className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-[#3E5C3D]">Westby & Viroqua, WI</span>
              </div>
              <h1 className="font-serif text-6xl lg:text-8xl font-bold tracking-tight text-[#2D2825] leading-[0.9]">
                The Driftless <br />
                <span className="text-[#3E5C3D]">Guide</span>
              </h1>
              <p className="mt-8 text-xl leading-relaxed text-[#6B5E55] max-w-md">
                A community-sourced almanac of local makers, organic farms, and heritage establishments tucked into the Coulees of Vernon County.
              </p>
              <div className="mt-12 flex items-center gap-8">
                <div>
                  <p className="font-serif text-3xl font-bold text-[#2D2825]">{totalBusinesses}</p>
                  <p className="text-xs uppercase tracking-widest text-[#9A8F85]">Listings</p>
                </div>
                <div className="h-10 w-[1px] bg-[#EBE3D5]"></div>
                <div>
                  <p className="font-serif text-3xl font-bold text-[#2D2825]">{activeCategories.length}</p>
                  <p className="text-xs uppercase tracking-widest text-[#9A8F85]">Sectors</p>
                </div>
              </div>
            </div>

            <div className="relative aspect-[4/5]">
              <HeroCarousel />
              {/* Decorative Earthy Elements */}
              <div className="absolute -bottom-6 -left-6 h-32 w-32 rounded-full bg-[#E2E8D4]/50 blur-3xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Directory Sections */}
      <section className="bg-[#FAF9F6] border-t border-[#EBE3D5] py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-16 flex items-end justify-between">
            <div>
              <h2 className="font-serif text-4xl font-bold text-[#2D2825]">Community Sectors</h2>
              <p className="mt-2 text-[#6B5E55]">Explore the businesses that make our Main Street move.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {activeCategories.map((category) => {
              const Icon = getCategoryIcon(category.slug);
              return (
                <Link
                  key={category.id}
                  href={`/categories/${category.slug}`}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-[#FDFCFB] p-8 border border-[#EBE3D5] transition-all duration-500 hover:bg-[#3E5C3D] hover:border-[#3E5C3D]"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E2E8D4] text-[#3E5C3D] transition-all duration-500 group-hover:bg-white/10 group-hover:text-white">
                    <Icon strokeWidth={1} size={24} />
                  </div>

                  <div className="mt-12">
                    <h3 className="font-serif text-2xl font-bold text-[#2D2825] transition-colors duration-500 group-hover:text-white leading-tight">
                      {category.name}
                    </h3>
                    <p className="mt-2 text-xs font-bold uppercase tracking-[0.1em] text-[#9A8F85] group-hover:text-[#E2E8D4] transition-colors">
                      {category.count} Local Establishments
                    </p>
                  </div>

                  <div className="absolute top-6 right-8 text-[#EBE3D5] opacity-20 group-hover:opacity-100 group-hover:text-white transition-all duration-500 transform translate-x-2 group-hover:translate-x-0">
                    <Icon strokeWidth={0.5} size={64} />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer / Journal Note */}
      <footer className="py-20 border-t border-[#EBE3D5]">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <p className="font-serif italic text-2xl text-[#2D2825]">"Rooted in the ancient, unglaciated soil."</p>
          <p className="mt-4 text-xs uppercase tracking-[0.3em] text-[#9A8F85]">Viroqua, Wisconsin • Since 1846</p>
        </div>
      </footer>
    </div>
  );
}
