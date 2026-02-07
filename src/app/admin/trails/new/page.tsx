import { supabase } from '@/lib/supabase';
import { TrailForm } from '@/components/admin/TrailForm';

export const dynamic = 'force-dynamic';

export default async function NewTrailPage() {
    const { data: businesses } = await supabase
        .from('businesses')
        .select('id, name')
        .eq('is_active', true)
        .order('name');

    return <TrailForm businesses={businesses || []} />;
}
