const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase credentials.");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function exportBusinesses() {
    console.log("Fetching businesses...");
    // Using a loop to handle potential pagination if needed, but 1000 is default limit which covers 177
    const { data, error } = await supabase
        .from('businesses')
        .select('name, city, latitude, longitude')
        .order('name');

    if (error) {
        console.error("Error fetching data:", error);
        return;
    }

    const fs = require('fs');
    const path = require('path');

    let md = '# Viroqua Business Directory Listing\n\n';
    md += `**Total Businesses:** ${data.length}\n`;
    md += `**Geo-located:** ${data.filter(b => b.latitude).length}\n\n`;
    md += '| Name | City | Geo |\n';
    md += '|---|---|---|\n';

    data.forEach(b => {
        const geo = (b.latitude && b.longitude) ? '✅' : '❌';
        // Escape pipes in name
        const name = b.name.replace(/\|/g, '\\|');
        const city = (b.city || '').replace(/\|/g, '\\|');
        md += `| ${name} | ${city} | ${geo} |\n`;
    });

    const outputPath = path.join(__dirname, '../docs/BUSINESS_LIST.md');
    fs.writeFileSync(outputPath, md);
    console.log(`Exported ${data.length} businesses to ${outputPath}`);
}

exportBusinesses();
