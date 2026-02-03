
import { chromium } from 'playwright';
import * as fs from 'fs';

const URL = 'https://www.viroquachamber.com/business-directory/217-on-main/';

async function dump() {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    console.log(`Navigating to ${URL}`);
    await page.goto(URL, { waitUntil: 'domcontentloaded' });
    const content = await page.content();
    fs.writeFileSync('debug.html', content);
    console.log('Saved debug.html');
    await browser.close();
}

dump().catch(console.error);
