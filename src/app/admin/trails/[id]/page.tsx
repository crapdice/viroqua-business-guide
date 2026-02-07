import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import { TrailForm } from '@/components/admin/TrailForm';

export const dynamic = 'force-dynamic';

export default async function EditTrailPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const { id } = params;

    const [
        { data: trail, error },
        { data: stops },
        { data: businesses }
    ] = await Promise.all([
        supabase.from('trails').select('*').eq('id', id).single(),
        supabase.from('trail_stops').select('*').eq('trail_id', id).order('position'),
        supabase.from('businesses').select('id, name').eq('is_active', true).order('name')
    ]);

    if (error || !trail) {
        return notFound();
    }

    return <TrailForm trail={trail as any} stops={(stops || []) as any} businesses={businesses || []} />;
}
