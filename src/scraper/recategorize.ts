import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { resolveCategory } from './3-clean';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

async function recategorize() {
    console.log('🔄 Starting Re-categorization Pass...');

    const { data: businesses, error } = await supabase
        .from('businesses')
        .select('id, name, description, category_id, address');

    if (error || !businesses) {
        console.error('❌ Error fetching businesses:', error);
        return;
    }

    console.log(`📊 Processing ${businesses.length} businesses...`);

    let updatedCount = 0;

    for (const biz of businesses) {
        const rawCat = biz.address?.includes('Market') ? 'Viroqua Public Market Merchants' : '';
        const newCatId = resolveCategory(rawCat, biz.name, biz.description);

        if (newCatId !== biz.category_id) {
            console.log(`   ✨ Updating ${biz.name}: ${biz.category_id} -> ${newCatId}`);
            const { error: upErr } = await supabase
                .from('businesses')
                .update({ category_id: newCatId })
                .eq('id', biz.id);

            if (upErr) console.error(`      ❌ Failed: ${upErr.message}`);
            else updatedCount++;
        }
    }

    console.log(`✅ Done. Updated ${updatedCount} businesses.`);
}

recategorize();
