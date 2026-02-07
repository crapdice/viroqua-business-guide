import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import { CategoryForm } from '@/components/admin/CategoryForm';

export const dynamic = 'force-dynamic';

export default async function EditCategoryPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const { id } = params;

    const [
        { data: category, error },
        { data: allCategories }
    ] = await Promise.all([
        supabase.from('categories').select('*').eq('id', id).single(),
        supabase.from('categories').select('id, name').order('name')
    ]);

    if (error || !category) {
        return notFound();
    }

    // Type assertion to handle database schema variations
    const categoryData = category as typeof category & { icon_text?: string | null };

    return <CategoryForm category={categoryData as any} allCategories={allCategories || []} />;
}
