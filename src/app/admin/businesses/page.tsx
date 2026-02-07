import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import { normalizeImageUrl } from '@/lib/utils';
import { Plus, Pencil, ExternalLink } from 'lucide-react';
import { DeleteButton } from '@/components/admin/DeleteButton';

export const dynamic = 'force-dynamic';

export default async function BusinessesPage() {
    const { data: businesses, error } = await supabase
        .from('businesses')
        .select('*, categories(name)')
        .order('name')
        .limit(100);

    if (error) {
        console.error('Error fetching businesses:', error);
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="font-serif text-4xl font-bold text-[#2D2825]">Businesses</h1>
                    <p className="mt-2 text-[#6B5E55]">Manage business listings and their details</p>
                </div>
                <Link
                    href="/admin/businesses/new"
                    className="flex items-center gap-2 px-5 py-3 bg-[#3E5C3D] text-white rounded-xl font-medium hover:bg-[#2D2825] transition-colors"
                >
                    <Plus size={18} />
                    Add Business
                </Link>
            </div>

            <div className="bg-white rounded-2xl border border-[#EBE3D5] overflow-hidden">
                <table className="w-full">
                    <thead className="bg-[#FAF9F6] border-b border-[#EBE3D5]">
                        <tr>
                            <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-[#9A8F85]">Business</th>
                            <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-[#9A8F85]">Category</th>
                            <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-[#9A8F85]">Address</th>
                            <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-[#9A8F85]">Status</th>
                            <th className="text-right px-6 py-4 text-xs font-bold uppercase tracking-wider text-[#9A8F85]">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#EBE3D5]">
                        {businesses?.map((business) => (
                            <tr key={business.id} className="hover:bg-[#FAF9F6] transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-[#FAF9F6] border border-[#EBE3D5]">
                                            {normalizeImageUrl(business.hero_image_url) ? (
                                                <Image
                                                    src={normalizeImageUrl(business.hero_image_url)!}
                                                    alt={business.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-[#9A8F85] text-xs">
                                                    N/A
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-medium text-[#2D2825]">{business.name}</p>
                                            <p className="text-xs text-[#9A8F85] font-mono">{business.slug}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="px-2 py-1 bg-[#E2E8D4] text-[#3E5C3D] text-xs font-medium rounded-lg">
                                        {business.categories?.name || 'Uncategorized'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-[#6B5E55] max-w-xs truncate">
                                    {business.address || '—'}
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 text-xs font-medium rounded-lg ${business.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                        {business.is_active ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center justify-end gap-2">
                                        <Link
                                            href={`/businesses/${business.slug}`}
                                            target="_blank"
                                            className="p-2 text-[#6B5E55] hover:text-[#3E5C3D] hover:bg-[#E2E8D4] rounded-lg transition-colors"
                                            title="View on site"
                                        >
                                            <ExternalLink size={16} />
                                        </Link>
                                        <Link
                                            href={`/admin/businesses/${business.id}`}
                                            className="p-2 text-[#6B5E55] hover:text-[#3E5C3D] hover:bg-[#E2E8D4] rounded-lg transition-colors"
                                        >
                                            <Pencil size={16} />
                                        </Link>
                                        <DeleteButton
                                            table="businesses"
                                            id={business.id}
                                            name={business.name}
                                        />
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {(!businesses || businesses.length === 0) && (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-[#9A8F85]">
                                    No businesses found. Add your first listing!
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
