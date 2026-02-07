import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkBusiness() {
    const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .eq('id', 'd1e192a9-118b-40cf-b562-c882b7400784')
        .single();

    if (error) {
        fs.writeFileSync('business_check.txt', `Error: ${JSON.stringify(error, null, 2)}`);
        return;
    }

    let output = 'Business data:\n';
    output += JSON.stringify(data, null, 2);
    output += '\n\n--- Field check ---\n';

    for (const [key, value] of Object.entries(data)) {
        if (value && typeof value === 'string') {
            if (value.startsWith('//')) {
                output += `⚠️ Protocol-relative URL in ${key}: ${value}\n`;
            }
            if (value.length > 1000) {
                output += `⚠️ Very long string in ${key}: ${value.length} chars\n`;
            }
        }
    }

    fs.writeFileSync('business_check.txt', output);
    console.log('Output written to business_check.txt');
}

checkBusiness();
