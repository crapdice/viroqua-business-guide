
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { enrichBusiness } from './2-enrich';
import { RawBusiness, EnrichedBusiness } from './types';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase Credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function enrichBatch() {
    console.log('🚀 Starting Data Enrichment Pass...');

    // 1. Fetch Incomplete Records (Batch of 10)
    // Supabase .or() syntax: 'column.operator.value,column.operator.value'
    // We want: (address is null OR address eq 'Viroqua, WI' ...) AND (latitude is null ...)
    // It's tricky to mix AND/OR in simple chaining.
    // Let's just grab items with Lat IS NULL for now as the primary target.
    const { data: records, error } = await supabase
        .from('businesses')
        .select('*')
        .is('latitude', null)
        .limit(10);

    if (error) {
        console.error('Error fetching records:', error);
        return;
    }

    if (!records || records.length === 0) {
        console.log('✅ No incomplete records found!');
        return;
    }

    console.log(`📦 Processing batch of ${records.length} records...`);

    for (const record of records) {
        console.log(`   👉 Processing: ${record.name}`);

        // Convert DB record back to "Raw" shape for enrichment utility
        const input: RawBusiness = {
            source_id: record.slug,
            name: record.name,
            raw_address: record.address,
            raw_phone: record.phone,
            website: record.website,
            raw_category: '', // Not needed for enrichment
            description: record.description,
            source_url: ''
        };

        // PRE-FILL Enriched with existing valid data to avoid overwriting
        const existingData: EnrichedBusiness = {
            ...input,
            facebook_url: record.facebook_url,
            instagram_url: record.instagram_url,
            lat: record.latitude,
            lng: record.longitude
        };

        // ENRICH
        const result = await enrichBusiness(existingData);

        // UPDATE DB
        const updates: any = {};
        if (result.lat && result.lng) {
            updates.latitude = result.lat;
            updates.longitude = result.lng;
        }
        if (result.raw_address && result.raw_address !== record.address && result.raw_address.length > (record.address?.length || 0)) {
            // Only update address if it looks "better" or longer (heuristic)
            updates.address = result.raw_address;
            // Also append City/State if missing from the raw Nominatim result? 
            // 2-enrich puts just house/road. We should normalize.
            if (!updates.address.includes('Viroqua')) {
                updates.address = `${updates.address}, Viroqua, WI 54665`;
            }
        }
        if (result.facebook_url && !record.facebook_url) updates.facebook_url = result.facebook_url;
        if (result.instagram_url && !record.instagram_url) updates.instagram_url = result.instagram_url;

        if (Object.keys(updates).length > 0) {
            const { error: updateErr } = await supabase
                .from('businesses')
                .update(updates)
                .eq('id', record.id);

            if (updateErr) console.error(`      ❌ Update failed:`, updateErr.message);
            else console.log(`      💾 Updated!`, JSON.stringify(updates));
        } else {
            console.log(`      Build-complete. No updates needed.`);
        }
    }
}

enrichBatch();
