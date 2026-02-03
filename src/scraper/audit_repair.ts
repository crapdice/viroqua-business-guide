
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { enrichBusiness } from './2-enrich';
import { cleanAndNormalize } from './3-clean';
import { RawBusiness } from './types';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
    console.error("❌ Missing Supabase credentials in .env");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function runAudit() {
    console.log('🕵️‍♀️ Starting Data Integrity Audit (Batch: 10)...');

    // 1. Fetch incomplete records (simulated or real)
    // For now we fetch 10 records that need repair (either lat is null OR address is short)
    const { data: businesses, error } = await supabase
        .from('businesses')
        .select('*')
        .or('latitude.is.null,address.ilike.%Viroqua%WI%') // Simple check for likely incomplete or un-geocoded
        .limit(10);

    if (error || !businesses || businesses.length === 0) {
        console.log('No records found requiring audit in this test batch (or DB connection failed).');
        console.log('Error:', error);
        return;
    }

    console.log(`Processing ${businesses.length} records...`);

    const report = [];

    for (const biz of businesses) {
        // Map DB shape to Scraper shape (RawBusiness)
        // Note: DB columns might differ slightly from RawBusiness types, assume close enough for enrich
        const raw: RawBusiness = {
            source_id: biz.id, // using DB ID as source ID context
            name: biz.name,
            raw_address: biz.address, // current address
            raw_phone: biz.phone,
            website: biz.website,
            raw_category: '', // We don't have the original raw cat, usually. Use current cat ID name? 
            // For scoring, we might skip or just use placeholder.
            description: biz.description,
            source_url: '',
            lat: biz.latitude,
            lng: biz.longitude
        };

        const oldAddr = biz.address;
        const oldLat = biz.latitude;

        // Repair / Enrich
        const enriched = await enrichBusiness(raw);
        const processed = cleanAndNormalize(enriched);

        // Calculate Category Score (simulation)
        // We compare the keywords in clean schema with the name/desc
        // Simple heuristic for the report
        let score = 0;
        const checkStr = (processed.name + ' ' + processed.description).toLowerCase();
        if (checkStr.length > 5) score = Math.min(100, checkStr.length + 50); // Dummy score logic for "Completeness"

        report.push({
            "Business Name": biz.name.substring(0, 20),
            "Old Address": oldAddr ? oldAddr.substring(0, 20) : 'N/A',
            "New Verif. Address": processed.address ? processed.address.substring(0, 30) : 'FAILED',
            "Lat/Lng Status": (processed.state && enriched.lat) ? `✅ ${enriched.lat.toFixed(4)}` : (oldLat ? `🆗 Old` : '❌ NONE'),
            "Cat Score": Math.floor(score)
        });
    }

    // Output Table
    console.table(report);

    // Save to file for easy reading
    const fs = require('fs');
    fs.writeFileSync('audit_report_utf8.txt', JSON.stringify(report, null, 2));
    console.log('Report saved to audit_report_utf8.txt');
}

runAudit().catch(console.error);
