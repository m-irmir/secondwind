import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const STORE_URL = 'https://www.ebay.com/str/habitatcentralarizonarestores';

async function scrapeStore() {
  const browser = await chromium.launch({
    headless: false,
    args: ['--disable-blink-features=AutomationControlled']
  });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'
  });
  const page = await context.newPage();
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'webdriver', { get: () => false });
  });

  console.log('Navigating to store...');
  await page.goto(STORE_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(6000);

  if (page.url().includes('captcha')) {
    console.error('CAPTCHA detected. Exiting.');
    await browser.close();
    process.exit(1);
  }

  console.log('Page title:', await page.title());

  // The store page has items in various containers. Let's extract from all item-like elements.
  // First, find "All items" section and get those items
  // Try clicking "All items" tab if present
  const allItemsLink = await page.$('text=All items');
  if (allItemsLink) {
    console.log('Found "All items" link, clicking...');
    await allItemsLink.click();
    await page.waitForTimeout(5000);
  }

  async function extractItems() {
    return page.evaluate(() => {
      const items = [];

      // Try multiple selectors that eBay store pages use
      const selectors = [
        '.s-item',
        '[data-testid="item-card"]',
        '.b-list__items_nofooter li',
        '.srp-river-results .s-item',
      ];

      for (const sel of selectors) {
        const els = document.querySelectorAll(sel);
        if (els.length > 0) {
          console.log(`Found ${els.length} items with selector: ${sel}`);
        }
        els.forEach(el => {
          const titleEl = el.querySelector('.s-item__title span[role="heading"]') ||
                          el.querySelector('.s-item__title span') ||
                          el.querySelector('.s-item__title') ||
                          el.querySelector('[class*="title"]');
          const priceEl = el.querySelector('.s-item__price') || el.querySelector('[class*="price"]');
          const linkEl = el.querySelector('a[href*="/itm/"]') || el.querySelector('a');
          const imgEl = el.querySelector('img');
          const conditionEl = el.querySelector('.SECONDARY_INFO') || el.querySelector('[class*="condition"]');

          const title = titleEl?.textContent?.trim() || '';
          const url = linkEl?.href || '';

          if (title && url.includes('/itm/')) {
            items.push({
              title,
              price: priceEl?.textContent?.trim() || '',
              url: url.split('?')[0],
              imageUrl: imgEl?.src || imgEl?.getAttribute('data-src') || '',
              condition: conditionEl?.textContent?.trim() || '',
            });
          }
        });
      }

      // Also try getting items from any link containing /itm/
      if (items.length === 0) {
        const allLinks = document.querySelectorAll('a[href*="/itm/"]');
        allLinks.forEach(link => {
          const container = link.closest('li, div, article') || link.parentElement;
          const imgEl = container?.querySelector('img') || link.querySelector('img');
          const title = link.textContent?.trim() ||
                        container?.querySelector('[class*="title"]')?.textContent?.trim() || '';
          if (title && title.length > 5) {
            items.push({
              title,
              price: container?.querySelector('[class*="price"]')?.textContent?.trim() || '',
              url: link.href.split('?')[0],
              imageUrl: imgEl?.src || '',
              condition: '',
            });
          }
        });
      }

      return items;
    });
  }

  let allItems = await extractItems();
  console.log(`Found ${allItems.length} items on current view`);

  // Try to load more pages by scrolling or pagination
  let prevCount = 0;
  let scrollAttempts = 0;
  while (scrollAttempts < 5 && allItems.length !== prevCount) {
    prevCount = allItems.length;
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(3000);
    allItems = await extractItems();
    scrollAttempts++;
    console.log(`After scroll ${scrollAttempts}: ${allItems.length} items`);
  }

  // Try pagination
  let pageNum = 1;
  while (pageNum < 50) {
    const nextBtn = await page.$('a.pagination__next:not([aria-disabled="true"])');
    if (!nextBtn) {
      // Also try numbered pagination
      const nextPageLink = await page.$(`a[href*="_pgn=${pageNum + 1}"]`);
      if (!nextPageLink) break;
      await nextPageLink.click();
    } else {
      await nextBtn.click();
    }

    pageNum++;
    await page.waitForTimeout(4000);

    if (page.url().includes('captcha')) {
      console.log('CAPTCHA during pagination, stopping.');
      break;
    }

    const pageItems = await extractItems();
    console.log(`Page ${pageNum}: ${pageItems.length} items`);
    if (pageItems.length === 0) break;
    allItems = allItems.concat(pageItems);
  }

  // Deduplicate
  const seen = new Set();
  allItems = allItems.filter(item => {
    const key = item.url;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  // Clean up titles
  allItems = allItems.filter(item =>
    item.title !== 'Shop on eBay' &&
    item.title !== 'Results' &&
    item.title.length > 3
  );

  console.log(`\nTotal unique items: ${allItems.length}`);

  // Save
  const outPath = path.join(process.cwd(), 'data', 'ebay-habitat-listings.json');
  fs.writeFileSync(outPath, JSON.stringify(allItems, null, 2));
  console.log(`Saved to ${outPath}`);

  // Print first 15
  allItems.slice(0, 15).forEach((item, i) => {
    console.log(`\n${i + 1}. ${item.title}`);
    console.log(`   Price: ${item.price}`);
    console.log(`   Image: ${item.imageUrl?.substring(0, 80)}`);
    console.log(`   URL: ${item.url}`);
  });

  await browser.close();
}

scrapeStore().catch(err => {
  console.error('Scrape failed:', err);
  process.exit(1);
});
