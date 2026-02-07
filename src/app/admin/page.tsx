import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { FolderTree, Store, MapPin, ArrowRight } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
    const [
        { count: categoryCount },
        { count: businessCount },
        { count: trailCount }
    ] = await Promise.all([
        supabase.from('categories').select('*', { count: 'exact', head: true }),
        supabase.from('businesses').select('*', { count: 'exact', head: true }),
        supabase.from('trails').select('*', { count: 'exact', head: true }),
    ]);

    const stats = [
        { label: 'Categories', count: categoryCount || 0, href: '/admin/categories', icon: FolderTree, color: 'bg-blue-500' },
        { label: 'Businesses', count: businessCount || 0, href: '/admin/businesses', icon: Store, color: 'bg-[#3E5C3D]' },
        { label: 'Trails', count: trailCount || 0, href: '/admin/trails', icon: MapPin, color: 'bg-amber-600' },
    ];

    return (
        <div>
            <div className="mb-8">
                <h1 className="font-serif text-4xl font-bold text-[#2D2825]">Dashboard</h1>
                <p className="mt-2 text-[#6B5E55]">Manage your Viroqua Business Guide content</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                {stats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <Link
                            key={stat.label}
                            href={stat.href}
                            className="group bg-white rounded-2xl p-6 border border-[#EBE3D5] shadow-sm hover:shadow-lg transition-all hover:-translate-y-1"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className={`${stat.color} text-white p-3 rounded-xl`}>
                                    <Icon size={24} />
                                </div>
                                <ArrowRight size={20} className="text-[#9A8F85] group-hover:text-[#3E5C3D] transition-colors" />
                            </div>
                            <p className="text-4xl font-bold text-[#2D2825] font-serif">{stat.count}</p>
                            <p className="text-sm text-[#6B5E55] mt-1">{stat.label}</p>
                        </Link>
                    );
                })}
            </div>

            <div className="bg-white rounded-2xl p-8 border border-[#EBE3D5]">
                <h2 className="font-serif text-2xl font-bold text-[#2D2825] mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Link
                        href="/admin/categories/new"
                        className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#FAF9F6] hover:bg-[#E2E8D4] transition-colors text-sm font-medium text-[#2D2825]"
                    >
                        <FolderTree size={18} className="text-[#3E5C3D]" />
                        Add New Category
                    </Link>
                    <Link
                        href="/admin/businesses/new"
                        className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#FAF9F6] hover:bg-[#E2E8D4] transition-colors text-sm font-medium text-[#2D2825]"
                    >
                        <Store size={18} className="text-[#3E5C3D]" />
                        Add New Business
                    </Link>
                    <Link
                        href="/admin/trails/new"
                        className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#FAF9F6] hover:bg-[#E2E8D4] transition-colors text-sm font-medium text-[#2D2825]"
                    >
                        <MapPin size={18} className="text-[#3E5C3D]" />
                        Add New Trail
                    </Link>
                </div>
            </div>
        </div>
    );
}
