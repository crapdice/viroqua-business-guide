import { chromium } from 'playwright';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

import { harvestViroquaChamber, harvestVEDA, harvestPublicMarket } from './1-harvest';
import { enrichBusiness } from './2-enrich';
import { cleanAndNormalize } from './3-clean';
import { RawBusiness, ProcessedBusiness } from './types';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
    console.error("❌ Missing Supabase credentials in .env");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Delay helper
const delay = (ms: number) => new Promise(r => setTimeout(r, ms));

async function upsertBusiness(biz: ProcessedBusiness, enriched: any): Promise<{ success: boolean, id?: string, error?: string }> {
    // Check if exists by slug
    const { data: existing } = await supabase
        .from('businesses')
        .select('id')
        .eq('slug', biz.slug)
        .single();

    const payload: any = {
        name: biz.name,
        slug: biz.slug,
        description: biz.description || null,
        address: biz.address || null,
        city: biz.city,
        state: biz.state,
        zip: biz.zip,
        phone: biz.phone || null,
        website: biz.website || null,
        category_id: biz.category_id || null,
        latitude: enriched.lat || null,
        longitude: enriched.lng || null,
        facebook_url: biz.social_links?.facebook || null,
        instagram_url: biz.social_links?.instagram || null,
        hero_image_url: biz.logo_url || null, // Map logo_url to hero_image_url
        opening_hours: biz.opening_hours || null,
        updated_at: new Date().toISOString()
    };

    if (existing?.id) {
        // Update
        const { error } = await supabase.from('businesses').update(payload).eq('id', existing.id);
        if (error) return { success: false, error: error.message };
        return { success: true, id: existing.id };
    } else {
        // Insert
        payload.created_at = new Date().toISOString();
        const { data, error } = await supabase.from('businesses').insert(payload).select('id').single();
        if (error) return { success: false, error: error.message };
        return { success: true, id: data?.id };
    }
}

async function runFullLoad() {
    console.log('\n🚀 ========================================');
    console.log('   VIROQUA BUSINESS DIRECTORY FULL LOAD');
    console.log('========================================\n');

    // --- PHASE 1: HARVEST ---
    console.log('📥 PHASE 1: HARVESTING DATA SOURCES...\n');

    console.log('   [1/3] Viroqua Chamber of Commerce...');
    const chamber = await harvestViroquaChamber(); // Full harvest, no limit
    console.log(`         ✅ Harvested ${chamber.length} businesses.`);

    console.log('   [2/3] VEDA Food Enterprise Center...');
    const veda = await harvestVEDA();
    console.log(`         ✅ Harvested ${veda.length} tenants.`);

    console.log('   [3/3] Viroqua Public Market...');
    const market = await harvestPublicMarket();
    console.log(`         ✅ Harvested ${market.length} merchants.`);

    const allRaw: RawBusiness[] = [...chamber, ...veda, ...market];
    console.log(`\n📊 Total Raw Records: ${allRaw.length}`);

    // --- PHASE 2: ENRICH ---
    console.log('\n🔬 PHASE 2: ENRICHING RECORDS (Geocoding + Social Discovery)...\n');
    const enrichedAll: any[] = [];
    let enrichCount = 0;
    for (const raw of allRaw) {
        enrichCount++;
        console.log(`   [${enrichCount}/${allRaw.length}] Enriching: ${raw.name.substring(0, 30)}...`);
        const enriched = await enrichBusiness(raw);
        enrichedAll.push(enriched);
        // Rate limit between enrichments (2-4s)
        await delay(2000 + Math.random() * 2000);
    }
    console.log(`   ✅ All ${enrichedAll.length} records enriched.`);

    // --- PHASE 3: CLEAN & NORMALIZE ---
    console.log('\n🧹 PHASE 3: CLEANING & NORMALIZING...\n');
    const processedAll: ProcessedBusiness[] = enrichedAll.map(e => cleanAndNormalize(e));
    console.log(`   ✅ ${processedAll.length} records cleaned.`);

    // --- PHASE 4: LOAD TO SUPABASE ---
    console.log('\n💾 PHASE 4: UPSERTING TO SUPABASE...\n');
    let insertCount = 0;
    let updateCount = 0;
    let errorCount = 0;

    for (let i = 0; i < processedAll.length; i++) {
        const biz = processedAll[i];
        const enriched = enrichedAll[i];
        console.log(`   [${i + 1}/${processedAll.length}] ${biz.name.substring(0, 25)}...`);

        const result = await upsertBusiness(biz, enriched);
        if (result.success) {
            if (result.id) {
                // Could be insert or update, we incremented based on existing check inside upsert
                // Simplified: just count success
                insertCount++;
            }
            console.log(`      ✅ OK`);
        } else {
            errorCount++;
            console.log(`      ❌ ${result.error}`);
        }
        await delay(100); // Small delay between DB writes
    }

    // --- SUMMARY ---
    console.log('\n========================================');
    console.log('📈 LOAD COMPLETE');
    console.log('========================================');
    console.log(`   Total Processed: ${processedAll.length}`);
    console.log(`   Successful Upserts: ${insertCount}`);
    console.log(`   Errors: ${errorCount}`);
    console.log('========================================\n');
}

runFullLoad().catch(console.error);
