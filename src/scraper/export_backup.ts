import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

async function exportData() {
    console.log('📦 Starting Data Export...');

    // 1. Export Categories
    const { data: categories, error: catErr } = await supabase.from('categories').select('*');
    if (catErr) console.error('❌ Error fetching categories:', catErr);
    else {
        fs.writeFileSync(path.resolve(__dirname, '../../seeds/categories_backup.json'), JSON.stringify(categories, null, 2));
        console.log(`✅ Exported ${categories.length} categories to seeds/categories_backup.json`);
    }

    // 2. Export Businesses
    const { data: businesses, error: bizErr } = await supabase.from('businesses').select('*');
    if (bizErr) console.error('❌ Error fetching businesses:', bizErr);
    else {
        fs.writeFileSync(path.resolve(__dirname, '../../seeds/businesses_backup.json'), JSON.stringify(businesses, null, 2));
        console.log(`✅ Exported ${businesses.length} businesses to seeds/businesses_backup.json`);
    }

    console.log('🏁 Export Complete.');
}

exportData();
