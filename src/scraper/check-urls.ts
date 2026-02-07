import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkProtocolRelativeUrls() {
    console.log('Checking for protocol-relative URLs (starting with //)...\n');

    const { data: businesses, error } = await supabase
        .from('businesses')
        .select('id, name, hero_image_url, logo_url, website');

    if (error) {
        console.error('Error:', error);
        return;
    }

    const issues: { id: string; name: string; field: string; url: string }[] = [];

    businesses?.forEach(b => {
        if (b.hero_image_url?.startsWith('//')) {
            issues.push({ id: b.id, name: b.name, field: 'hero_image_url', url: b.hero_image_url });
        }
        if (b.logo_url?.startsWith('//')) {
            issues.push({ id: b.id, name: b.name, field: 'logo_url', url: b.logo_url });
        }
        if (b.website?.startsWith('//')) {
            issues.push({ id: b.id, name: b.name, field: 'website', url: b.website });
        }
    });

    console.log(`Found ${issues.length} protocol-relative URLs:\n`);
    issues.forEach(i => {
        console.log(`- ${i.name} (${i.field}): ${i.url}`);
    });

    if (issues.length > 0) {
        console.log('\n--- Generating SQL fix ---\n');

        const sqlStatements = issues.map(i => {
            const fixedUrl = `https:${i.url}`;
            return `UPDATE businesses SET ${i.field} = '${fixedUrl}' WHERE id = '${i.id}';`;
        });

        const sql = sqlStatements.join('\n');
        console.log(sql);

        fs.writeFileSync('fix_protocol_urls.sql', sql);
        console.log('\nSQL saved to fix_protocol_urls.sql');
    }
}

checkProtocolRelativeUrls();
