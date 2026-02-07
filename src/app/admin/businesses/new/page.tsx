import { supabase } from '@/lib/supabase';
import { BusinessForm } from '@/components/admin/BusinessForm';

export const dynamic = 'force-dynamic';

export default async function NewBusinessPage() {
    const { data: categories } = await supabase
        .from('categories')
        .select('id, name')
        .order('name');

    return <BusinessForm categories={categories || []} />;
}
