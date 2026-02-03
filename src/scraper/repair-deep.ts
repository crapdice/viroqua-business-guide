
import { harvestViroquaChamber } from './1-harvest';
import { cleanAndNormalize } from './3-clean';
import { loadToSupabase } from './4-load';
import { enrichBusiness } from './2-enrich';
import { ProcessedBusiness } from './types';

// LIMIT for the repair sample
const LIMIT = 5;

async function runRepairSample() {
    console.log(`🛠️ Starting Deep Repair Sample (Limit: ${LIMIT})...`);

    // Pass LIMIT to the harvester
    console.log('   Harvesting Page 1 (Deep Mode)...');
    const rawData = await harvestViroquaChamber(LIMIT);

    console.log(`   Captured ${rawData.length} items.`);

    const processedData: ProcessedBusiness[] = [];

    for (const biz of rawData) {
        // Enrich (Geocoding Fallback if needed)
        const enriched = await enrichBusiness(biz);

        // Clean
        const clean = cleanAndNormalize(enriched);
        processedData.push(clean);
    }

    if (processedData.length > 0) {
        console.log('   Sample of Repaired Data:');
        console.log(JSON.stringify(processedData[0], null, 2));

        // Upsert to DB
        console.log('   💾 Upserting Sample to Supabase...');
        await loadToSupabase(processedData);
    } else {
        console.log('   ⚠️ No data captured.');
    }

    console.log('✅ Repair Sample Complete.');
}

runRepairSample();
