import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function inspect() {
    const slug = 'dining-hospitality';
    console.log(`Inspecting category: ${slug}`);

    const { data: category, error: catErr } = await supabase
        .from('categories')
        .select('*')
        .eq('slug', slug)
        .single();

    if (catErr) {
        console.error('Category error:', catErr);
        return;
    }

    console.log('Category found:', category);

    const { data: businesses, error: bizErr } = await supabase
        .from('businesses')
        .select('*')
        .eq('category_id', category.id);

    if (bizErr) {
        console.error('Businesses error:', bizErr);
        return;
    }

    console.log(`Found ${businesses.length} businesses.`);
    businesses.forEach(b => {
        console.log(`- ${b.name} (Image: ${b.hero_image_url})`);
    });
}

inspect();
