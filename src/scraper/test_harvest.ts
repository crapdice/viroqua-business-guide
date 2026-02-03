
import { harvestViroquaChamber, harvestVEDA, harvestPublicMarket } from './1-harvest';
import { enrichBusiness } from './2-enrich';
import { cleanAndNormalize } from './3-clean';
import * as fs from 'fs';

async function testRun() {
    console.log('🧪 Starting Test Harvest...');

    const veda = await harvestVEDA();
    const market = await harvestPublicMarket();

    console.log('>>> NOW RUNNING CHAMBER SCRAPER (Limit 5) <<<');
    const chamber = await harvestViroquaChamber(5);
    console.log(`Chamber Count: ${chamber.length}`);

    // Limit Chamber to first 5 for sample
    const chamberSample = chamber.slice(0, 5);

    // Enrich Sample
    console.log('✨ Enriching sample batch...');
    const enrichedSample = [];
    for (const item of chamberSample) {
        enrichedSample.push(await enrichBusiness(item));
    }

    const cleanedSample = enrichedSample.map(c => cleanAndNormalize(c));

    const finalOutput = {
        veda_count: veda.length,
        market_count: market.length,
        chamber_count: chamber.length,
        samples: {
            veda: veda[0],
            market: market[0],
            chamber_raw: chamberSample,
            chamber_clean: cleanedSample
        }
    };

    fs.writeFileSync('harvest_results.json', JSON.stringify(finalOutput, null, 2));
    console.log('✅ Results written to harvest_results.json');
}

testRun();
