import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import axios from 'axios';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const ASSETS_DIR = path.resolve(__dirname, '../../public/businesses');

if (!fs.existsSync(ASSETS_DIR)) {
    fs.mkdirSync(ASSETS_DIR, { recursive: true });
}

async function migrateImages() {
    console.log('Fetching businesses from registry...');
    const { data: businesses, error } = await supabase
        .from('businesses')
        .select('id, name, hero_image_url')
        .not('hero_image_url', 'is', null);

    if (error) {
        console.error('Error fetching businesses:', error);
        return;
    }

    console.log(`Found ${businesses.length} businesses to process.`);

    for (const business of businesses) {
        if (!business.hero_image_url || business.hero_image_url.startsWith('/')) {
            console.log(`Skipping ${business.name} (already local or no image)`);
            continue;
        }

        try {
            console.log(`Downloading image for: ${business.name}`);

            // Try to get extension from URL or fallback to jpg
            const url = new URL(business.hero_image_url);
            const ext = path.extname(url.pathname) || '.jpg';
            const fileName = `${business.id}${ext}`;
            const filePath = path.join(ASSETS_DIR, fileName);
            const relativePath = `/businesses/${fileName}`;

            const response = await axios({
                url: business.hero_image_url,
                method: 'GET',
                responseType: 'stream',
                timeout: 5000,
                headers: {
                    'User-Agent': 'Mozilla/5.0'
                }
            });

            const writer = fs.createWriteStream(filePath);
            response.data.pipe(writer);

            await new Promise<void>((resolve, reject) => {
                writer.on('finish', () => resolve());
                writer.on('error', (err) => reject(err));
            });

            // Update database
            const { error: updateErr } = await supabase
                .from('businesses')
                .update({ hero_image_url: relativePath })
                .eq('id', business.id);

            if (updateErr) {
                console.error(`Failed to update DB for ${business.name}:`, updateErr.message);
            } else {
                console.log(`✅ Migrated: ${business.name} -> ${relativePath}`);
            }

        } catch (err: any) {
            console.error(`❌ Failed to migrate ${business.name}:`, err.message);
        }
    }

    console.log('Migration complete.');
}

migrateImages();
