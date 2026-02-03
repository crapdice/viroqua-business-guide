
import { chromium } from 'playwright';

(async () => {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    console.log('Navigating to directory...');
    await page.goto('https://www.viroquachamber.com/business/member-directory/', { waitUntil: 'domcontentloaded' });

    // Find first profile link
    // The previous harvest used '.wpbdp-field-title .value, .listing-title a'
    const link = await page.$('.wpbdp-field-title .value a, .listing-title a');
    if (link) {
        const href = await link.getAttribute('href');
        console.log(`Found Profile URL: ${href}`);
        if (href) {
            await page.goto(href, { waitUntil: 'domcontentloaded' });
            console.log('Navigated to profile.');

            // Dump basic structure to help identify selectors
            const title = await page.title();
            console.log(`Title: ${title}`);

            const body = await page.content();
            // Just print first 2000 chars of main container to avoid huge output
            // Looking for address, google maps, etc.
            // Usually WPBDP has .wpbdp-listing-single
            const content = await page.$eval('.wpbdp-listing-single, #main-content', el => el.innerHTML).catch(() => body.slice(0, 2000));
            console.log('--- CONTENT SNIPPET ---');
            console.log(content.slice(0, 2000));
        }
    } else {
        console.log('No profile link found.');
    }
    await browser.close();
})();
