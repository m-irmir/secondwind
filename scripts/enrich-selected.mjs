import { chromium } from 'playwright';
import fs from 'fs';

const selected = [
  { title: "Orvis Full Zip Fleece Jacket Men's Medium / Blue", url: "https://www.ebay.com/itm/396316676240", imageUrl: "https://i.ebayimg.com/images/g/RK8AAeSwHzRn0w99/s-l300.jpg" },
  { title: "Maeve By Anthropologie Wide Flare Leg Jeans Women's Size 29", url: "https://www.ebay.com/itm/396319697281", imageUrl: "https://i.ebayimg.com/images/g/~nUAAeSwJBpn1F2M/s-l300.jpg" },
  { title: "Columbia Women's Medium Light Wind Jacket", url: "https://www.ebay.com/itm/395156693948", imageUrl: "https://i.ebayimg.com/images/g/eHoAAOSwB9hlsFDf/s-l300.jpg" },
  { title: "Vintage Roundtree & Yorke Men's 100% Camel Hair Jacket", url: "https://www.ebay.com/itm/395128223901", imageUrl: "https://i.ebayimg.com/images/g/YHYAAOSwxodloCwG/s-l300.jpg" },
  { title: "Tommy Bahama Men's Dress Shirt - Large, 100% Silk", url: "https://www.ebay.com/itm/396732517544", imageUrl: "https://i.ebayimg.com/images/g/OdEAAeSwM9xoSfD~/s-l300.jpg" },
  { title: "The North Face Men's Medium Fleece Jacket Hazen Branded Logo", url: "https://www.ebay.com/itm/395554591132", imageUrl: "https://i.ebayimg.com/images/g/07gAAOSwbL1mosh8/s-l300.jpg" },
  { title: "Royal Matrix Green Denim Jacket Women's Medium", url: "https://www.ebay.com/itm/395844129575", imageUrl: "https://i.ebayimg.com/images/g/UzoAAOSwzFJnIUuS/s-l300.jpg" },
  { title: "Wren + Rowe Gray Drape Cardigan Sweater Women's Open Front Lightweight-Medium", url: "https://www.ebay.com/itm/397006079912", imageUrl: "https://i.ebayimg.com/images/g/RXgAAeSwvaNosNhb/s-l300.jpg" },
  { title: "Birkenstock Gizeh Women's Sandals | Multiple Sizes & Colors | New in Box", url: "https://www.ebay.com/itm/397167118121", imageUrl: "https://i.ebayimg.com/images/g/fpMAAeSwHSho8Wn4/s-l300.webp" },
  { title: "Men's Birkenstock Arizona Sandals - Multiple Sizes & Colors - New", url: "https://www.ebay.com/itm/397000398968", imageUrl: "https://i.ebayimg.com/images/g/pasAAeSwhqtor0g2/s-l300.webp" },
  { title: "Alexandre Birman Clarita Braided Flat Sandals, Size 38, Italian", url: "https://www.ebay.com/itm/396690147412", imageUrl: "https://i.ebayimg.com/images/g/kJAAAeSwvt5oPzv2/s-l300.jpg" },
  { title: "Naot Lappland Men's Sandals | 2 Colors & Multiple Sizes | New in Box | Leather", url: "https://www.ebay.com/itm/397028540995", imageUrl: "https://i.ebayimg.com/images/g/zMUAAeSwjH5oufjw/s-l300.webp" },
  { title: "Red Quilted Michael Kors Handbag - 10x3x7", url: "https://www.ebay.com/itm/396732472074", imageUrl: "https://i.ebayimg.com/images/g/WCwAAeSwWL1oSelX/s-l300.jpg" },
  { title: "Banana Republic Sunglasses P358617", url: "https://www.ebay.com/itm/395818757142", imageUrl: "https://i.ebayimg.com/images/g/2ycAAOSwWRNnFuJG/s-l300.webp" },
  { title: "Handcrafted Blue Swirl Glass Vase with Dichroie by Teppie 2010", url: "https://www.ebay.com/itm/395267103307", imageUrl: "https://i.ebayimg.com/images/g/QW8AAOSwJK1l8i7c/s-l300.jpg" },
  { title: "Sand Art Painting 14x8 Frame From Tohatchi New Mexico Fine Art", url: "https://www.ebay.com/itm/396246530629", imageUrl: "https://i.ebayimg.com/images/g/MC0AAOSwhs1nJWYG/s-l300.jpg" },
  { title: "Mikasa Intaglio Santa Fe Coffee Pot & Lid CAC24 8in Tall", url: "https://www.ebay.com/itm/395983427630", imageUrl: "https://i.ebayimg.com/images/g/hqgAAOSwFPJnU4MK/s-l300.webp" },
  { title: "Franmara Vintage Wine Bottle Peppermill - Hardwood - 15in", url: "https://www.ebay.com/itm/397370733964", imageUrl: "https://i.ebayimg.com/images/g/9oMAAOSwudhnhWt6/s-l300.jpg" },
  { title: "Apple TV (3rd generation) A1427", url: "https://www.ebay.com/itm/395075539132", imageUrl: "https://i.ebayimg.com/images/g/a0gAAOSwhfdlgd39/s-l300.jpg" },
  { title: "Google Nest Thermostat Trim Kit - Snow (GZZN7) - GA01837-US - New Sealed", url: "https://www.ebay.com/itm/397006088736", imageUrl: "https://i.ebayimg.com/images/g/eIQAAeSw2QhosNL4/s-l300.webp" },
];

async function main() {
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

  const enriched = [];

  for (let i = 0; i < selected.length; i++) {
    const item = selected[i];
    console.log(`[${i+1}/${selected.length}] ${item.title.substring(0, 50)}...`);

    try {
      await page.goto(item.url, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await page.waitForTimeout(3000);

      if (page.url().includes('captcha')) {
        console.log('CAPTCHA! Saving progress...');
        break;
      }

      const data = await page.evaluate(() => {
        // Price
        const priceEl = document.querySelector('.x-price-primary span.ux-textspans') ||
                        document.querySelector('[data-testid="x-price-primary"]') ||
                        document.querySelector('.x-bin-price__content .ux-textspans');
        const price = priceEl?.textContent?.trim() || '';

        // Condition
        const condEl = document.querySelector('[data-testid="x-item-condition-value"] .ux-textspans') ||
                       document.querySelector('.x-item-condition-value .ux-textspans');
        const condition = condEl?.textContent?.trim() || '';

        // All images - get high res
        const imgs = [...document.querySelectorAll('[data-testid="ux-image-carousel"] img, .ux-image-carousel-item img, button[data-idx] img')];
        const imageUrls = imgs.map(img => {
          let src = img.getAttribute('data-zoom-src') || img.src || img.getAttribute('data-src') || '';
          return src.replace(/s-l\d+/, 's-l1600').replace(/\.webp$/, '.jpg');
        }).filter(s => s && s.includes('ebayimg'));

        // Unique images
        const uniqueImages = [...new Set(imageUrls)];

        // Item specifics
        const specifics = {};
        const specRows = document.querySelectorAll('.ux-labels-values--deliverto .ux-labels-values__labels-content');
        if (specRows.length === 0) {
          // Try alternative
          document.querySelectorAll('.x-about-this-item .ux-labels-values').forEach(row => {
            const label = row.querySelector('.ux-labels-values__labels .ux-textspans')?.textContent?.trim();
            const value = row.querySelector('.ux-labels-values__values .ux-textspans')?.textContent?.trim();
            if (label && value) specifics[label] = value;
          });
        }

        // Get ALL label/value pairs on page
        document.querySelectorAll('.ux-labels-values').forEach(row => {
          const label = row.querySelector('.ux-labels-values__labels .ux-textspans')?.textContent?.trim();
          const value = row.querySelector('.ux-labels-values__values .ux-textspans')?.textContent?.trim();
          if (label && value && label.length < 40) specifics[label] = value;
        });

        return { price, condition, images: uniqueImages, specifics };
      });

      enriched.push({ ...item, ...data });
      console.log(`  Price: ${data.price} | Condition: ${data.condition} | Images: ${data.images.length}`);
      if (Object.keys(data.specifics).length > 0) {
        console.log(`  Specifics:`, JSON.stringify(data.specifics).substring(0, 120));
      }

    } catch (err) {
      console.log(`  Error: ${err.message}`);
      enriched.push(item);
    }

    // Small delay
    await page.waitForTimeout(1500 + Math.random() * 1000);
  }

  fs.writeFileSync('data/ebay-selected-enriched.json', JSON.stringify(enriched, null, 2));
  console.log(`\nSaved ${enriched.length} enriched items to data/ebay-selected-enriched.json`);

  await browser.close();
}

main().catch(console.error);
