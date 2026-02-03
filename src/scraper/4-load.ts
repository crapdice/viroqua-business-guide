import { createClient } from '@supabase/supabase-js';
import { ProcessedBusiness } from './types';
import * as dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || '';
// Prefer Service Role for admin tasks, fallback to Anon key if that's all we have
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '';

export async function loadToSupabase(data: ProcessedBusiness[]) {
    if (!supabaseUrl || !supabaseKey) {
        console.error('❌ Missing SUPABASE_URL or SUPABASE_KEY in .env');
        return;
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log(`   Upserting ${data.length} records...`);

    for (const biz of data) {
        const { error } = await supabase
            .from('businesses')
            .upsert({
                name: biz.name,
                slug: biz.slug,
                category_id: biz.category_id,
                address: biz.address,
                city: biz.city,
                state: biz.state,
                zip: biz.zip,
                phone: biz.phone,
                website: biz.website,
                description: biz.description,
                instagram_url: biz.social_links?.instagram,
                facebook_url: biz.social_links?.facebook,
                opening_hours: biz.opening_hours
            }, { onConflict: 'slug' });

        if (error) {
            console.error(`   ❌ Error saving ${biz.name}:`, error.message);
        } else {
            // console.log(`      Saved ${biz.name}`); 
        }
    }

    console.log('   Sync complete.');
}
