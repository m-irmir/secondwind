import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const DATA_PATH = path.join(process.cwd(), 'data', 'ebay-habitat-listings.json');
const OUT_PATH = path.join(process.cwd(), 'data', 'ebay-habitat-enriched.json');

// Resume from existing enriched file if it exists
let enriched = {};
if (fs.existsSync(OUT_PATH)) {
  const existing = JSON.parse(fs.readFileSync(OUT_PATH, 'utf-8'));
  existing.forEach(item => { enriched[item.url] = item; });
  console.log(`Resuming: ${Object.keys(enriched).length} items already enriched`);
}

const items = JSON.parse(fs.readFileSync(DATA_PATH, 'utf-8'));
const toProcess = items.filter(item => !enriched[item.url]);
console.log(`${toProcess.length} items to enrich out of ${items.length} total`);

if (toProcess.length === 0) {
  console.log('All items already enriched!');
  process.exit(0);
}

async function scrapeItemPage(page, url) {
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(2000);

  if (page.url().includes('captcha')) {
    throw new Error('CAPTCHA');
  }

  return page.evaluate(() => {
    const price = document.querySelector('.x-price-primary span, [data-testid="x-price-primary"] span, .x-bin-price__content span')?.textContent?.trim() || '';
    const condition = document.querySelector('.x-item-condition-value span, [data-testid="x-item-condition-value"]')?.textContent?.trim() || '';

    // Get all item images (high-res)
    const imageEls = document.querySelectorAll('.ux-image-carousel-item img, [data-testid="ux-image-carousel"] img');
    const images = [...imageEls].map(img => {
      let src = img.src || img.getAttribute('data-zoom-src') || img.getAttribute('data-src') || '';
      // Get highest res version
      return src.replace(/s-l\d+/, 's-l1600').replace(/s-l\d+\.webp/, 's-l1600.webp');
    }).filter(Boolean);

    // Get item specifics
    const specifics = {};
    document.querySelectorAll('.ux-labels-values__labels-content, .x-about-this-item .ux-labels-values').forEach(row => {
      const label = row.querySelector('.ux-labels-values__labels span')?.textContent?.trim();
      const value = row.querySelector('.ux-labels-values__values span')?.textContent?.trim();
      if (label && value) specifics[label] = value;
    });

    // Alternative specifics extraction
    document.querySelectorAll('.ux-layout-section-evo__row').forEach(row => {
      const cols = row.querySelectorAll('.ux-layout-section-evo__col');
      for (let i = 0; i < cols.length - 1; i += 2) {
        const label = cols[i]?.textContent?.trim();
        const value = cols[i + 1]?.textContent?.trim();
        if (label && value && label.length < 50) specifics[label] = value;
      }
    });

    const description = document.querySelector('#readMoreDesc, .x-item-description, [data-testid="x-item-description"]')?.textContent?.trim()?.substring(0, 500) || '';

    return { price, condition, images, specifics, description };
  });
}

async function main() {
  const browser = await chromium.launch({
    headless: false,
    args: ['--disable-blink-features=AutomationControlled']
  });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'
  });

  // Use 3 pages for parallel scraping
  const pages = await Promise.all([
    context.newPage(),
    context.newPage(),
    context.newPage(),
  ]);

  for (const pg of pages) {
    await pg.addInitScript(() => {
      Object.defineProperty(navigator, 'webdriver', { get: () => false });
    });
  }

  let processed = 0;
  let errors = 0;
  const BATCH_SIZE = 3;
  const SAVE_EVERY = 15;

  for (let i = 0; i < toProcess.length; i += BATCH_SIZE) {
    const batch = toProcess.slice(i, i + BATCH_SIZE);

    const results = await Promise.allSettled(
      batch.map((item, idx) =>
        scrapeItemPage(pages[idx], item.url)
          .then(data => ({ ...item, ...data }))
          .catch(err => {
            if (err.message === 'CAPTCHA') throw err;
            console.log(`  Error on ${item.title.substring(0, 40)}: ${err.message}`);
            return { ...item, price: '', condition: '', images: [], specifics: {}, description: '' };
          })
      )
    );

    for (const result of results) {
      if (result.status === 'fulfilled') {
        enriched[result.value.url] = result.value;
        processed++;
      } else if (result.reason?.message === 'CAPTCHA') {
        console.log('\nCAPTCHA hit! Saving progress and exiting...');
        saveProgress();
        await browser.close();
        process.exit(1);
      } else {
        errors++;
      }
    }

    const total = Object.keys(enriched).length;
    if (processed % SAVE_EVERY < BATCH_SIZE) {
      saveProgress();
    }
    process.stdout.write(`\r${processed}/${toProcess.length} enriched (${total} total, ${errors} errors)`);

    // Small delay to avoid rate limiting
    await new Promise(r => setTimeout(r, 1000 + Math.random() * 1000));
  }

  saveProgress();
  console.log(`\nDone! ${Object.keys(enriched).length} total enriched items.`);
  await browser.close();
}

function saveProgress() {
  const allItems = Object.values(enriched);
  fs.writeFileSync(OUT_PATH, JSON.stringify(allItems, null, 2));
}

main().catch(err => {
  console.error('Fatal:', err);
  saveProgress();
  process.exit(1);
});
