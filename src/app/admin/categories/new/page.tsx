import { supabase } from '@/lib/supabase';
import { CategoryForm } from '@/components/admin/CategoryForm';

export const dynamic = 'force-dynamic';

export default async function NewCategoryPage() {
    const { data: categories } = await supabase
        .from('categories')
        .select('id, name')
        .order('name');

    return <CategoryForm allCategories={categories || []} />;
}
