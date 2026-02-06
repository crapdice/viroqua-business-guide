import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

console.log('Testing connection to:', supabaseUrl);

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function test() {
    console.log('Querying categories...');
    const { data, error } = await supabase.from('categories').select('count');
    if (error) {
        console.error('Connection failed:', error.message);
    } else {
        console.log('Success! Connected to database.');
        console.log('Categories found:', data);
    }
}

test();
