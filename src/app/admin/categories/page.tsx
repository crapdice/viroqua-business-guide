import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { DeleteButton } from '@/components/admin/DeleteButton';

export const dynamic = 'force-dynamic';

export default async function CategoriesPage() {
    const { data: categories, error } = await supabase
        .from('categories')
        .select('*')
        .order('name') as { data: any[] | null, error: any };

    if (error) {
        console.error('Error fetching categories:', error);
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="font-serif text-4xl font-bold text-[#2D2825]">Categories</h1>
                    <p className="mt-2 text-[#6B5E55]">Manage business categories and their icons</p>
                </div>
                <Link
                    href="/admin/categories/new"
                    className="flex items-center gap-2 px-5 py-3 bg-[#3E5C3D] text-white rounded-xl font-medium hover:bg-[#2D2825] transition-colors"
                >
                    <Plus size={18} />
                    Add Category
                </Link>
            </div>

            <div className="bg-white rounded-2xl border border-[#EBE3D5] overflow-hidden">
                <table className="w-full">
                    <thead className="bg-[#FAF9F6] border-b border-[#EBE3D5]">
                        <tr>
                            <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-[#9A8F85]">Icon</th>
                            <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-[#9A8F85]">Name</th>
                            <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-[#9A8F85]">Slug</th>
                            <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-[#9A8F85]">Description</th>
                            <th className="text-right px-6 py-4 text-xs font-bold uppercase tracking-wider text-[#9A8F85]">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#EBE3D5]">
                        {categories?.map((category) => {
                            const IconComponent = category.icon_text ? (LucideIcons as any)[category.icon_text] : null;
                            return (
                                <tr key={category.id} className="hover:bg-[#FAF9F6] transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#E2E8D4] text-[#3E5C3D]">
                                            {IconComponent ? <IconComponent size={20} /> : <span className="text-lg">{category.icon_text || '📁'}</span>}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-medium text-[#2D2825]">{category.name}</td>
                                    <td className="px-6 py-4 text-sm text-[#6B5E55] font-mono">{category.slug}</td>
                                    <td className="px-6 py-4 text-sm text-[#6B5E55] max-w-xs truncate">{category.description || '—'}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link
                                                href={`/admin/categories/${category.id}`}
                                                className="p-2 text-[#6B5E55] hover:text-[#3E5C3D] hover:bg-[#E2E8D4] rounded-lg transition-colors"
                                            >
                                                <Pencil size={16} />
                                            </Link>
                                            <DeleteButton
                                                table="categories"
                                                id={category.id}
                                                name={category.name}
                                            />
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                        {(!categories || categories.length === 0) && (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-[#9A8F85]">
                                    No categories found. Create your first one!
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
