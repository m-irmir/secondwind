import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const enriched = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/ebay-selected-enriched.json'), 'utf-8'));
const UPLOAD_DIR = path.join(ROOT, 'public/uploads');

// Ensure uploads dir exists
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, res => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        download(res.headers.location, dest).then(resolve).catch(reject);
        return;
      }
      res.pipe(file);
      file.on('finish', () => { file.close(); resolve(); });
    }).on('error', reject);
  });
}

const HABITAT_STORE = {
  id: "store-1",
  name: "Habitat for Humanity ReStore",
  address: "2513 S Rural Rd, Tempe, AZ 85282",
  lat: 33.4055,
  lng: -111.9265,
};

// Carbon savings lookup
const CARBON_TABLE = {
  jacket: { co2Kg: 35.0, waterLiters: 12000, shippingCo2Kg: 1.5 },
  coat: { co2Kg: 35.0, waterLiters: 12000, shippingCo2Kg: 2.0 },
  jeans: { co2Kg: 33.4, waterLiters: 10000, shippingCo2Kg: 1.2 },
  shirt: { co2Kg: 6.5, waterLiters: 2700, shippingCo2Kg: 0.8 },
  sweater: { co2Kg: 12.0, waterLiters: 5000, shippingCo2Kg: 1.0 },
  shoes: { co2Kg: 14.0, waterLiters: 4500, shippingCo2Kg: 1.8 },
  bag: { co2Kg: 10.0, waterLiters: 3500, shippingCo2Kg: 1.2 },
  accessories: { co2Kg: 3.0, waterLiters: 1000, shippingCo2Kg: 0.5 },
  home: { co2Kg: 15.0, waterLiters: 5000, shippingCo2Kg: 3.0 },
  electronics: { co2Kg: 50.0, waterLiters: 15000, shippingCo2Kg: 5.0 },
};
const DEFAULT_CARBON = { co2Kg: 10.0, waterLiters: 3500, shippingCo2Kg: 1.5 };

function getCarbon(type) {
  const key = type.toLowerCase();
  return CARBON_TABLE[key] || DEFAULT_CARBON;
}

function mapCondition(ebayCondition) {
  if (!ebayCondition) return 'good';
  const c = ebayCondition.toLowerCase();
  if (c.includes('new')) return 'excellent';
  if (c.includes('good') || c.includes('very good')) return 'good';
  return 'fair';
}

function parsePrice(priceStr) {
  const match = priceStr.match(/\$([\d.]+)/);
  return match ? parseFloat(match[1]) : 9.99;
}

// Manual mapping for each item
const itemConfigs = [
  { type: 'jacket', color: ['blue'], style: ['casual', 'outdoor'], material: 'polyester fleece', desc: 'Orvis full-zip fleece jacket in a rich blue. Soft, warm, and perfect for layering on cool Arizona evenings.' },
  { type: 'jeans', color: ['blue'], style: ['wide-leg', 'flare'], material: 'denim', desc: 'Anthropologie Maeve wide flare-leg jeans. Retro silhouette with a modern fit.' },
  { type: 'jacket', color: ['gray'], style: ['casual', 'lightweight'], material: 'nylon', desc: 'Columbia lightweight wind jacket. Packable and perfect for unpredictable weather.' },
  { type: 'jacket', color: ['tan', 'brown'], style: ['blazer', 'vintage'], material: 'camel hair', desc: 'Vintage Roundtree & Yorke 100% camel hair sport coat. Timeless, luxurious, and beautifully constructed.' },
  { type: 'shirt', color: ['multicolor'], style: ['dress', 'tropical'], material: 'silk', desc: 'Tommy Bahama 100% silk dress shirt. Island vibes meet dressed-up style.' },
  { type: 'jacket', color: ['black'], style: ['casual', 'fleece'], material: 'polyester fleece', desc: 'The North Face Hazen fleece jacket. Iconic brand, warm and comfortable for everyday wear.' },
  { type: 'jacket', color: ['green'], style: ['denim', 'casual'], material: 'denim', desc: 'Royal Matrix green denim jacket. A bold pop of color for any outfit. Brand new with tags.' },
  { type: 'sweater', color: ['gray'], style: ['cardigan', 'draped'], material: 'knit blend', desc: 'Wren + Rowe open-front drape cardigan. Effortlessly elegant layering piece.' },
  { type: 'shoes', color: ['brown', 'multicolor'], style: ['sandals'], material: 'leather, cork', desc: 'Birkenstock Gizeh sandals. The gold standard of comfort footwear, brand new in box.' },
  { type: 'shoes', color: ['brown', 'multicolor'], style: ['sandals'], material: 'leather, cork', desc: 'Birkenstock Arizona sandals for men. Classic two-strap design, brand new.' },
  { type: 'shoes', color: ['tan', 'neutral'], style: ['sandals', 'designer'], material: 'braided leather', desc: 'Alexandre Birman Clarita braided flat sandals. Italian luxury craftsmanship at a fraction of retail.' },
  { type: 'shoes', color: ['brown', 'black'], style: ['sandals'], material: 'leather', desc: 'Naot Lappland leather sandals. Premium Israeli comfort brand, new in box.' },
  { type: 'bag', color: ['red'], style: ['quilted', 'designer'], material: 'quilted leather', desc: 'Red quilted Michael Kors handbag. Bold color, iconic designer, and perfectly sized for daily use.' },
  { type: 'accessories', color: ['brown', 'gold'], style: ['sunglasses'], material: 'acetate, metal', desc: 'Banana Republic sunglasses with a warm, sophisticated frame. UV protection meets style.' },
  { type: 'home', color: ['blue', 'white'], style: ['vase', 'handcrafted'], material: 'dichroic glass', desc: 'Handcrafted blue swirl glass vase with dichroic accents by Teppie (2010). A unique art piece.' },
  { type: 'home', color: ['tan', 'brown', 'red'], style: ['art', 'southwestern'], material: 'sand, mixed media', desc: 'Sand art painting from Tohatchi, New Mexico. Authentic Southwestern fine art, framed and ready to hang.' },
  { type: 'home', color: ['white', 'brown'], style: ['kitchenware', 'coffee'], material: 'ceramic', desc: 'Mikasa Intaglio Santa Fe coffee pot with lid. Southwest-inspired design, elegant and functional.' },
  { type: 'home', color: ['brown', 'natural'], style: ['kitchen', 'vintage'], material: 'hardwood', desc: 'Franmara vintage wine bottle peppermill in hardwood. A conversation-starter for any kitchen.' },
  { type: 'electronics', color: ['black'], style: ['streaming', 'smart home'], material: 'aluminum, plastic', desc: 'Apple TV 3rd generation. Compact streaming device, still going strong.' },
  { type: 'electronics', color: ['white'], style: ['smart home', 'thermostat'], material: 'plastic', desc: 'Google Nest Thermostat trim kit in Snow white. Brand new and sealed. Smart home upgrade made easy.' },
];

async function main() {
  const items = [];
  const now = new Date();

  for (let i = 0; i < enriched.length; i++) {
    const e = enriched[i];
    const cfg = itemConfigs[i];
    const id = `ebay-${i + 1}`;

    // Download first image (main photo)
    const mainImg = e.images?.[0] || e.imageUrl;
    const ext = mainImg.includes('.webp') ? '.webp' : '.jpg';
    const filename = `${id}${ext}`;
    const localPath = path.join(UPLOAD_DIR, filename);

    if (!fs.existsSync(localPath)) {
      console.log(`Downloading ${filename}...`);
      try {
        await download(mainImg, localPath);
      } catch (err) {
        console.log(`  Failed: ${err.message}`);
      }
    } else {
      console.log(`Already have ${filename}`);
    }

    // Download second image if available for variety
    let photos = [`/uploads/${filename}`];
    if (e.images?.length > 1) {
      const filename2 = `${id}-2${ext}`;
      const localPath2 = path.join(UPLOAD_DIR, filename2);
      if (!fs.existsSync(localPath2)) {
        try {
          await download(e.images[1], localPath2);
          photos.push(`/uploads/${filename2}`);
        } catch (err) { /* skip */ }
      } else {
        photos.push(`/uploads/${filename2}`);
      }
    }

    const brand = e.specifics?.Brand || e.title.split(' ')[0];
    const size = e.specifics?.Size || cfg.type === 'home' || cfg.type === 'electronics' ? 'One Size' : 'M';
    const condition = mapCondition(e.specifics?.Condition);
    const price = parsePrice(e.price);

    // Stagger creation dates over the past 2 weeks
    const createdAt = new Date(now - (enriched.length - i) * 24 * 60 * 60 * 1000 * 0.7);

    const item = {
      id,
      photos,
      type: cfg.type,
      color: cfg.color,
      brand,
      size: typeof size === 'string' ? size : 'One Size',
      style: cfg.style,
      condition,
      material: cfg.material,
      price,
      description: cfg.desc,
      store: HABITAT_STORE,
      carbonSavings: getCarbon(cfg.type),
      favorites: Math.floor(Math.random() * 8),
      status: "available",
      createdAt: createdAt.toISOString(),
      updatedAt: createdAt.toISOString(),
    };

    items.push(item);
    console.log(`${i + 1}. ${item.brand} ${item.type} - $${item.price} (${item.condition})`);
  }

  // Read existing items.json and prepend new items
  const existingPath = path.join(ROOT, 'data/items.json');
  const existing = JSON.parse(fs.readFileSync(existingPath, 'utf-8'));

  // Remove any previous ebay- items
  const filtered = existing.filter(item => !item.id.startsWith('ebay-'));
  const merged = [...items, ...filtered];

  fs.writeFileSync(existingPath, JSON.stringify(merged, null, 2));
  console.log(`\nMerged ${items.length} new items + ${filtered.length} existing = ${merged.length} total items`);
}

main().catch(console.error);
