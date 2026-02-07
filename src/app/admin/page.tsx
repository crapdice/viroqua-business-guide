import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { FolderTree, Store, MapPin, ArrowRight, AlertTriangle, ExternalLink } from 'lucide-react';

export const dynamic = 'force-dynamic';

// Required fields for a complete business listing (fields shown to users)
const REQUIRED_FIELDS = ['name', 'description', 'address', 'phone', 'category_id'] as const;

interface IncompleteBusiness {
    id: string;
    name: string;
    slug: string;
    missingFields: string[];
}

function getIncompleteListings(businesses: any[]): IncompleteBusiness[] {
    const incomplete: IncompleteBusiness[] = [];

    for (const biz of businesses) {
        const missingFields: string[] = [];

        for (const field of REQUIRED_FIELDS) {
            const value = biz[field];
            if (!value || (typeof value === 'string' && value.trim() === '')) {
                missingFields.push(field);
            }
        }

        if (missingFields.length > 0) {
            incomplete.push({
                id: biz.id,
                name: biz.name || 'Unnamed Business',
                slug: biz.slug,
                missingFields
            });
        }
    }

    return incomplete;
}

function formatFieldName(field: string): string {
    const names: Record<string, string> = {
        name: 'Name',
        description: 'Description',
        address: 'Address',
        phone: 'Phone',
        category_id: 'Category',
    };
    return names[field] || field;
}

export default async function AdminDashboard() {
    const [
        { count: categoryCount },
        { count: businessCount },
        { count: trailCount },
        { data: allBusinesses }
    ] = await Promise.all([
        supabase.from('categories').select('*', { count: 'exact', head: true }),
        supabase.from('businesses').select('*', { count: 'exact', head: true }),
        supabase.from('trails').select('*', { count: 'exact', head: true }),
        supabase.from('businesses').select('id, name, slug, description, address, phone, category_id').eq('is_active', true),
    ]);

    const incompleteListings = getIncompleteListings(allBusinesses || []);

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

            {/* Incomplete Listings Alert */}
            {incompleteListings.length > 0 && (
                <div className="mb-8 bg-amber-50 border border-amber-200 rounded-2xl p-6">
                    <div className="flex items-start gap-4">
                        <div className="bg-amber-500 text-white p-2 rounded-xl">
                            <AlertTriangle size={20} />
                        </div>
                        <div className="flex-1">
                            <h2 className="font-medium text-amber-900 mb-1">
                                {incompleteListings.length} Incomplete Listing{incompleteListings.length !== 1 ? 's' : ''}
                            </h2>
                            <p className="text-sm text-amber-700 mb-4">
                                These active businesses are missing required information that displays to users.
                            </p>
                            <div className="space-y-2 max-h-48 overflow-y-auto">
                                {incompleteListings.slice(0, 10).map((biz) => (
                                    <div
                                        key={biz.id}
                                        className="flex items-center justify-between bg-white rounded-lg px-4 py-2.5 border border-amber-100"
                                    >
                                        <div>
                                            <span className="font-medium text-[#2D2825]">{biz.name}</span>
                                            <span className="text-xs text-amber-600 ml-2">
                                                Missing: {biz.missingFields.map(formatFieldName).join(', ')}
                                            </span>
                                        </div>
                                        <Link
                                            href={`/admin/businesses/${biz.id}`}
                                            className="text-amber-600 hover:text-amber-800 p-1"
                                        >
                                            <ExternalLink size={16} />
                                        </Link>
                                    </div>
                                ))}
                            </div>
                            {incompleteListings.length > 10 && (
                                <p className="text-xs text-amber-600 mt-2">
                                    + {incompleteListings.length - 10} more incomplete listings
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            )}

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

