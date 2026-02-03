import { chromium } from 'playwright';
import { RawBusiness, EnrichedBusiness, ProcessedBusiness } from './types';
import { harvestViroquaChamber } from './1-harvest';
import { enrichBusiness } from './2-enrich';
import { cleanAndNormalize } from './3-clean';
import { loadToSupabase } from './4-load';

async function main() {
    console.log('🚀 Starting Viroqua Business Pipeline...');

    // Phase 1: Harvest
    console.log('📦 Phase 1: Harvesting Viroqua Chamber...');
    const rawData: RawBusiness[] = await harvestViroquaChamber();
    console.log(`   Found ${rawData.length} businesses.`);

    // Phase 2: Enrich (Twitter, Facebook, DFI)
    console.log('🔍 Phase 2: Enriching data...');
    const enrichedData: EnrichedBusiness[] = [];
    for (const biz of rawData) {
        const enriched = await enrichBusiness(biz);
        enrichedData.push(enriched);
    }

    // Phase 3: Clean & Normalize
    console.log('🧹 Phase 3: Cleaning & Mapping...');
    const processedData: ProcessedBusiness[] = [];
    for (const biz of enrichedData) {
        const clean = cleanAndNormalize(biz);
        processedData.push(clean);
    }

    // Phase 4: Validated Load
    console.log('💾 Phase 4: Validated Load (Saving to Supabase)...');
    await loadToSupabase(processedData);

    console.log('✅ Pipeline Complete.');
}

main().catch(console.error);
