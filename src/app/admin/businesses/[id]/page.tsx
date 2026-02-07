import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import { BusinessForm } from '@/components/admin/BusinessForm';

export const dynamic = 'force-dynamic';

export default async function EditBusinessPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const { id } = params;

    const [
        { data: business, error },
        { data: categories }
    ] = await Promise.all([
        supabase.from('businesses').select('*').eq('id', id).single(),
        supabase.from('categories').select('id, name').order('name')
    ]);

    if (error || !business) {
        return notFound();
    }

    return <BusinessForm business={business} categories={categories || []} />;
}
