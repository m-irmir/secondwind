// Final rebuild: use EVERY usable clothing item from the scraped data.
// Auto-generate Gemini-style descriptions from title + metadata.
import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const UPLOAD_DIR = path.join(ROOT, 'public/uploads');
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, res => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        file.close(); try { fs.unlinkSync(dest); } catch {}
        download(res.headers.location, dest).then(resolve).catch(reject);
        return;
      }
      if (res.statusCode !== 200) { file.close(); reject(new Error(`HTTP ${res.statusCode}`)); return; }
      res.pipe(file);
      file.on('finish', () => { file.close(); resolve(); });
    }).on('error', err => { file.close(); reject(err); });
  });
}

const STORES = [
  { id: "store-1", name: "Habitat for Humanity ReStore", address: "2513 S Rural Rd, Tempe, AZ 85282", lat: 33.4055, lng: -111.9265 },
  { id: "store-2", name: "Buffalo Exchange", address: "420 S Mill Ave, Tempe, AZ 85281", lat: 33.4235, lng: -111.9400 },
  { id: "store-3", name: "Savers", address: "1152 E Apache Blvd, Tempe, AZ 85281", lat: 33.4148, lng: -111.9220 },
  { id: "store-4", name: "Goodwill Tempe", address: "1625 E Apache Blvd, Tempe, AZ 85281", lat: 33.4148, lng: -111.9130 },
];

const CARBON = {
  jacket: { co2Kg: 35.0, waterLiters: 12000, shippingCo2Kg: 1.5 },
  jeans: { co2Kg: 33.4, waterLiters: 10000, shippingCo2Kg: 1.2 },
  pants: { co2Kg: 12.0, waterLiters: 3800, shippingCo2Kg: 1.0 },
  shirt: { co2Kg: 6.5, waterLiters: 2700, shippingCo2Kg: 0.8 },
  blouse: { co2Kg: 8.0, waterLiters: 3000, shippingCo2Kg: 0.8 },
  dress: { co2Kg: 22.0, waterLiters: 8000, shippingCo2Kg: 1.0 },
  sweater: { co2Kg: 12.0, waterLiters: 5000, shippingCo2Kg: 1.0 },
  shorts: { co2Kg: 8.0, waterLiters: 3000, shippingCo2Kg: 0.8 },
  shoes: { co2Kg: 14.0, waterLiters: 4500, shippingCo2Kg: 1.8 },
  bag: { co2Kg: 10.0, waterLiters: 3500, shippingCo2Kg: 1.2 },
  accessories: { co2Kg: 3.0, waterLiters: 1000, shippingCo2Kg: 0.5 },
  home: { co2Kg: 15.0, waterLiters: 5000, shippingCo2Kg: 3.0 },
  electronics: { co2Kg: 50.0, waterLiters: 15000, shippingCo2Kg: 5.0 },
};

// ── Type detection from title ──
function detectType(title) {
  const t = title.toLowerCase();
  if (/jeans|denim(?!.*jacket)/.test(t) && !/jacket|shorts/.test(t)) return 'jeans';
  if (/jacket|coat\b|blazer|anorak|parka/.test(t)) return 'jacket';
  if (/sweater|cardigan|hoodie|pullover|sweatshirt|fleece(?!.*jacket)/.test(t)) return 'sweater';
  if (/dress\b/.test(t) && !/shirt/.test(t)) return 'dress';
  if (/shorts|trunks/.test(t)) return 'shorts';
  if (/pants|trouser|chino|jogger|legging/.test(t)) return 'pants';
  if (/blouse/.test(t)) return 'blouse';
  if (/shirt|polo|tee\b|t-shirt|henley|top\b/.test(t)) return 'shirt';
  if (/shoe|boot|sandal|sneaker|heel|loafer|clog|espadrille|flip.?flop/.test(t)) return 'shoes';
  if (/handbag|purse\b/.test(t)) return 'bag';
  if (/backpack/.test(t)) return 'bag';
  if (/sunglasses|necklace|earring|bracelet|hat\b|snap.?back|cap\b/.test(t)) return 'accessories';
  if (/bike.*trainer/i.test(t)) return 'electronics';
  return 'shirt'; // default for clothing
}

// ── Color detection from title ──
function detectColors(title) {
  const t = title.toLowerCase();
  const colors = [];
  if (/\bblue\b|navy|aruba|denim/.test(t)) colors.push('blue');
  if (/\bblack\b/.test(t)) colors.push('black');
  if (/\bgray\b|grey|heather/.test(t)) colors.push('gray');
  if (/\bwhite\b|snow|cream|ivory/.test(t)) colors.push('white');
  if (/\bred\b|coral|crimson|burgundy/.test(t)) colors.push('red');
  if (/\bgreen\b|olive|mint/.test(t)) colors.push('green');
  if (/\bbrown\b|tan\b|khaki|camel|beige/.test(t)) colors.push('brown');
  if (/\bpink\b|rose\b/.test(t)) colors.push('pink');
  if (/\byellow\b|gold\b/.test(t)) colors.push('yellow');
  if (/\bpurple\b|plum|violet/.test(t)) colors.push('purple');
  if (/\borange\b/.test(t)) colors.push('orange');
  if (/multi|plaid|stripe|splatter/.test(t)) colors.push('multicolor');
  return colors.length > 0 ? colors : ['blue'];
}

// ── Brand detection from title ──
function detectBrand(title) {
  const brands = [
    'The North Face', 'Levi\'s', 'Levi Strauss', 'Columbia', 'Tommy Bahama', 'Tommy Hilfiger',
    'Adidas', 'Nike', 'Zara', 'H&M', 'Gap', 'Lululemon', 'Karl Lagerfeld', 'Michael Kors',
    'Orvis', 'Eddie Bauer', 'L.L. Bean', 'Nautica', 'Birkenstock', 'Alexandre Birman',
    'Hummel', 'Pebble Beach', 'Karen Scott', 'Weatherproof', 'Wren + Rowe', 'Nation Ltd',
    'Royal Matrix', 'Wild Fable', 'Fintech', 'Chaps', 'Izod', 'Greg Norman', 'LOFT',
    'Shambhala', 'Fever', 'Sleefs', 'Goodfellow', 'Antigua', 'Sincerely Jules', 'Stockh LM',
    'Halogen', 'Joe\'s Jeans', 'Forever 21', 'Selected Homme', 'Parker', 'Switch', 'Mellow Denim',
    'H Florence', 'Mad Pelican', 'Melrose Place', 'Banana Republic', 'Even Tide', 'Tillman',
    'Roundtree & Yorke', 'Y.D. Zhuliu', 'Chaos', 'Maeve', 'Elaine Turner', 'Juicy Couture',
    'Franco Sarto', 'Naot', 'Apple', 'Google', 'Mikasa', 'Teppie', 'Lole'
  ];
  for (const b of brands) {
    if (title.toLowerCase().includes(b.toLowerCase())) return b;
  }
  // Try first word(s)
  return title.split(/\s+/).slice(0, 2).join(' ');
}

// ── Size detection ──
function detectSize(title) {
  const t = title;
  // Look for explicit sizes
  const sizeMatch = t.match(/\bsize\s+(\w+)/i) || t.match(/\b(XXL|XL|XS|[SML])\b/) || t.match(/\b(\d{1,2})\b(?!.*pack)/);
  if (sizeMatch) return sizeMatch[1];
  if (/women|mens|men's/i.test(t)) return 'M';
  return 'M';
}

// ── Condition from eBay specifics or title ──
function detectCondition(title) {
  const t = title.toLowerCase();
  if (/new|nwt|sealed|unworn/.test(t)) return 'excellent';
  if (/used|worn|vintage/.test(t)) return 'fair';
  return 'good';
}

// ── Material detection ──
function detectMaterial(title, type) {
  const t = title.toLowerCase();
  if (/silk/.test(t)) return '100% silk';
  if (/camel hair/.test(t)) return 'camel hair';
  if (/leather/.test(t)) return 'leather';
  if (/suede/.test(t)) return 'faux suede';
  if (/fleece/.test(t)) return 'polyester fleece';
  if (/denim/.test(t) || type === 'jeans') return 'denim';
  if (/corduroy/.test(t)) return 'corduroy';
  if (/cotton/.test(t)) return 'cotton';
  if (/polyester/.test(t)) return 'polyester';
  if (/linen/.test(t)) return 'linen';
  if (/wool/.test(t)) return 'wool';
  if (/nylon/.test(t)) return 'nylon';
  if (/alpaca/.test(t)) return 'cotton/alpaca blend';
  if (type === 'jeans') return 'denim';
  if (type === 'jacket') return 'polyester';
  if (type === 'sweater') return 'cotton blend';
  if (type === 'shirt') return 'cotton blend';
  return 'cotton blend';
}

// ── Style tags ──
function detectStyle(title, type) {
  const t = title.toLowerCase();
  const tags = [];
  if (/casual|everyday/.test(t)) tags.push('casual');
  if (/vintage|retro/.test(t)) tags.push('vintage');
  if (/athletic|sport|golf|uv|dri-fit|climacool|performance/.test(t)) tags.push('athletic');
  if (/formal|cocktail|dress\b/.test(t) && type !== 'dress') tags.push('formal');
  if (/outdoor|hiking/.test(t)) tags.push('outdoor');
  if (/streetwear|urban/.test(t)) tags.push('streetwear');
  if (/crop|cropped/.test(t)) tags.push('cropped');
  if (/slim|skinny|fitted/.test(t)) tags.push('slim');
  if (/wide.?leg|flare|bootcut/.test(t)) tags.push('wide-leg');
  if (/zip/.test(t)) tags.push('zip-up');
  if (tags.length === 0) tags.push('casual');
  return tags.slice(0, 3);
}

// ── Gemini-style description generator ──
function generateDescription(title, type, brand, size, material, condition, colors) {
  const colorStr = colors.filter(c => c !== 'multicolor').join(' and ') || colors[0];
  const condNote = condition === 'excellent' ? 'No visible wear, appears unworn.' :
                   condition === 'good' ? 'Light wear consistent with gentle use, no stains or holes.' :
                   'Some signs of wear including minor fading and pilling.';

  const typeNames = {
    jacket: 'jacket', jeans: 'jeans', pants: 'pants', shirt: 'shirt', blouse: 'blouse',
    dress: 'dress', sweater: 'sweater', shorts: 'shorts', shoes: 'shoes', bag: 'handbag',
    accessories: 'sunglasses', home: 'home item', electronics: 'electronic device'
  };
  const typeName = typeNames[type] || type;

  // Extract specific details from title
  let details = '';
  if (/full.?zip/.test(title.toLowerCase())) details += 'Full-zip closure. ';
  if (/half.?zip/.test(title.toLowerCase())) details += 'Half-zip closure. ';
  if (/button/.test(title.toLowerCase())) details += 'Button-front closure. ';
  if (/open.?front/.test(title.toLowerCase())) details += 'Open-front construction. ';
  if (/uv|upf|sun defender/i.test(title)) details += 'UPF 50+ sun protection. ';
  if (/polo/i.test(title)) details += 'Two-button placket collar. ';
  if (/henley/i.test(title)) details += 'Three-button henley placket. ';
  if (/raw.?hem/i.test(title)) details += 'Raw hem finish. ';
  if (/distressed/i.test(title)) details += 'Intentional distressing detail. ';
  if (/plaid/i.test(title)) details += 'Plaid pattern. ';
  if (/striped|pinstripe/i.test(title)) details += 'Striped pattern. ';
  if (/graphic|print/i.test(title)) details += 'Graphic print on front. ';

  return `${colorStr.charAt(0).toUpperCase() + colorStr.slice(1)} ${typeName} by ${brand}. ${material.charAt(0).toUpperCase() + material.slice(1)} construction. ${details}${condNote} Size ${size}.`;
}

// ── Assign stores with variety (clothing = 2,3,4; home/shoes = 1) ──
let storeRotation = 0;
function assignStore(type) {
  if (type === 'home' || type === 'electronics') return 'store-1';
  // Everything else rotates across all 4 stores
  const allStores = ['store-1', 'store-2', 'store-3', 'store-4'];
  const store = allStores[storeRotation % 4];
  storeRotation++;
  return store;
}

// ── Price from eBay data or reasonable estimate ──
const enrichedData = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/ebay-selected-enriched.json'), 'utf-8'));
const enrichedByUrl = {};
for (const e of enrichedData) enrichedByUrl[e.url] = e;

function getPrice(scraped, type) {
  const enriched = enrichedByUrl[scraped.url];
  if (enriched?.price) {
    const m = enriched.price.match(/\$([\d.]+)/);
    if (m) return parseFloat(m[1]);
  }
  // Reasonable thrift store prices by type
  const prices = { jacket: 12.99, jeans: 8.99, pants: 7.99, shirt: 6.99, blouse: 7.99,
    dress: 14.99, sweater: 9.99, shorts: 5.99, shoes: 19.99, bag: 14.99,
    accessories: 9.99, home: 12.99, electronics: 9.99 };
  return prices[type] || 7.99;
}

async function main() {
  const allScraped = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/ebay-habitat-listings.json'), 'utf-8'));

  // ── Filter: all real clothing, shoes we want, bags, accessories ──
  const clothingPat = /jacket|coat\b|jeans|pants|shirt|dress\b|sweater|hoodie|blouse|skirt|shorts|vest\b|cardigan|polo|flannel|fleece|pullover|tee |tank\b|blazer|henley|sweatshirt|legging|tunic|romper|jumpsuit/i;
  const shoePat = /\bshoe|boot|sandal|sneaker|heel|loafer|clog|birkenstock|naot|xelero/i;
  const bagPat = /handbag|purse\b/i;
  const accessPat = /sunglasses/i;
  const falsePat = /pipe|iron tee|door pull|tablespoon|bedskirt|dog shirt|dog.*dress|dog.*boot|dog.*shoe|headset|safety vest|sharkbite|wire wheel|lufkin|speedwagon|malleable|fitting|tee pipe|vinyl record|dvd|book\b|cartridge|toner|part no|connector|cable clamp|plug\b|wall.?plate|outlet|switch.*cover|receptacle|baby shoe|pin\b|fused|burner|puck|lux\b|lamp|light(?!weight)|bulb/i;

  const selected = [];
  const seenTitles = new Set();

  // 1. All clothing
  for (const item of allScraped) {
    const t = item.title;
    if (falsePat.test(t)) continue;
    if (seenTitles.has(t)) continue;
    if (clothingPat.test(t) && !shoePat.test(t)) {
      selected.push(item);
      seenTitles.add(t);
    }
  }
  console.log(`Clothing: ${selected.length}`);

  // 2. ALL good shoes (skip kids, dogs, weird stuff)
  const shoeSkip = /dog|baby|kid|levi.*kid|covertsafe|lufkin|wire|brush/i;
  for (const item of allScraped) {
    const t = item.title;
    if (shoePat.test(t) && !falsePat.test(t) && !shoeSkip.test(t) && !seenTitles.has(t)) {
      selected.push(item);
      seenTitles.add(t);
    }
  }
  console.log(`+ Shoes: ${selected.length}`);

  // 3. ALL bags and purses
  for (const item of allScraped) {
    const t = item.title;
    if (bagPat.test(t) && !falsePat.test(t) && !seenTitles.has(t)) {
      selected.push(item);
      seenTitles.add(t);
    }
  }

  // 4. Sunglasses, hats, jewelry, backpacks
  const accKeep = /sunglasses|necklace|earring|bracelet|\bhat\b|snap.?back|backpack/i;
  const accSkip = /book|album|record|interrupt|ties that|kenny|vulcan|insert|linda ron/i;
  for (const item of allScraped) {
    const t = item.title;
    if (accKeep.test(t) && !falsePat.test(t) && !accSkip.test(t) && !seenTitles.has(t)) {
      selected.push(item);
      seenTitles.add(t);
    }
  }
  console.log(`+ Accessories: ${selected.length}`);

  // 5. A few home/electronics for Habitat
  const homeKeep = /apple tv|google nest thermostat|handcrafted blue swirl|kurt kinetic.*bike/i;
  for (const item of allScraped) {
    if (homeKeep.test(item.title) && !seenTitles.has(item.title)) {
      selected.push(item);
      seenTitles.add(item.title);
    }
  }

  console.log(`Total selected: ${selected.length}`);

  // ── Build items ──
  const items = [];
  const now = new Date();

  for (let i = 0; i < selected.length; i++) {
    const scraped = selected[i];
    const type = detectType(scraped.title);
    const brand = detectBrand(scraped.title);
    const size = detectSize(scraped.title);
    const colors = detectColors(scraped.title);
    const condition = detectCondition(scraped.title);
    const material = detectMaterial(scraped.title, type);
    const style = detectStyle(scraped.title, type);
    const price = getPrice(scraped, type);
    const storeId = assignStore(type);
    const desc = generateDescription(scraped.title, type, brand, size, material, condition, colors);

    const id = `item-${String(i + 1).padStart(3, '0')}`;
    const mainImgUrl = scraped.imageUrl.replace(/s-l300/, 's-l1600');
    const filename = `${id}.jpg`;
    const filepath = path.join(UPLOAD_DIR, filename);

    if (!fs.existsSync(filepath)) {
      try {
        await download(mainImgUrl, filepath);
      } catch {
        try { await download(scraped.imageUrl, filepath); } catch (e) { console.log(`  FAIL ${id}: ${e.message}`); continue; }
      }
    }

    const daysAgo = (selected.length - i) * 0.25 + Math.random() * 1.5;
    const createdAt = new Date(now - daysAgo * 24 * 60 * 60 * 1000);

    items.push({
      id,
      photos: [`/uploads/${filename}`],
      type, color: colors, brand, size, style, condition, material, price,
      description: desc,
      store: STORES.find(s => s.id === storeId),
      carbonSavings: CARBON[type] || { co2Kg: 10.0, waterLiters: 3500, shippingCo2Kg: 1.5 },
      favorites: Math.floor(Math.random() * 15),
      status: "available",
      createdAt: createdAt.toISOString(),
      updatedAt: createdAt.toISOString(),
    });

    if ((i + 1) % 10 === 0) process.stdout.write(`\r${i + 1}/${selected.length} items processed`);
  }

  console.log(`\n\nWrote ${items.length} items`);

  // Clean orphan images
  const referenced = new Set(items.flatMap(i => i.photos.map(p => p.replace('/uploads/', ''))));
  const files = fs.readdirSync(UPLOAD_DIR).filter(f => f.startsWith('item-'));
  let cleaned = 0;
  for (const f of files) {
    if (!referenced.has(f)) { fs.unlinkSync(path.join(UPLOAD_DIR, f)); cleaned++; }
  }
  if (cleaned) console.log(`Cleaned ${cleaned} orphan images`);

  // Save
  fs.writeFileSync(path.join(ROOT, 'data/items.json'), JSON.stringify(items, null, 2));

  // Summary
  for (const store of STORES) {
    const storeItems = items.filter(i => i.store.id === store.id);
    const types = {};
    storeItems.forEach(i => { types[i.type] = (types[i.type] || 0) + 1; });
    console.log(`  ${store.name} (${storeItems.length}):`, JSON.stringify(types));
  }
  const allTypes = {};
  items.forEach(i => { allTypes[i.type] = (allTypes[i.type] || 0) + 1; });
  console.log('\nTotal by type:', JSON.stringify(allTypes));

  // Size distribution
  const sizes = {};
  items.forEach(i => { sizes[i.size] = (sizes[i.size] || 0) + 1; });
  console.log('Sizes:', JSON.stringify(sizes));
}

main().catch(console.error);
