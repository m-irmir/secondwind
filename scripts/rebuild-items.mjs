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
        file.close();
        fs.unlinkSync(dest);
        download(res.headers.location, dest).then(resolve).catch(reject);
        return;
      }
      if (res.statusCode !== 200) {
        file.close();
        reject(new Error(`HTTP ${res.statusCode}`));
        return;
      }
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
  jacket:      { co2Kg: 35.0, waterLiters: 12000, shippingCo2Kg: 1.5 },
  jeans:       { co2Kg: 33.4, waterLiters: 10000, shippingCo2Kg: 1.2 },
  pants:       { co2Kg: 12.0, waterLiters: 3800, shippingCo2Kg: 1.0 },
  shirt:       { co2Kg: 6.5, waterLiters: 2700, shippingCo2Kg: 0.8 },
  blouse:      { co2Kg: 8.0, waterLiters: 3000, shippingCo2Kg: 0.8 },
  dress:       { co2Kg: 22.0, waterLiters: 8000, shippingCo2Kg: 1.0 },
  sweater:     { co2Kg: 12.0, waterLiters: 5000, shippingCo2Kg: 1.0 },
  shorts:      { co2Kg: 8.0, waterLiters: 3000, shippingCo2Kg: 0.8 },
  shoes:       { co2Kg: 14.0, waterLiters: 4500, shippingCo2Kg: 1.8 },
  bag:         { co2Kg: 10.0, waterLiters: 3500, shippingCo2Kg: 1.2 },
  accessories: { co2Kg: 3.0, waterLiters: 1000, shippingCo2Kg: 0.5 },
  home:        { co2Kg: 15.0, waterLiters: 5000, shippingCo2Kg: 3.0 },
  electronics: { co2Kg: 50.0, waterLiters: 15000, shippingCo2Kg: 5.0 },
};
const DEFAULT_CARBON = { co2Kg: 10.0, waterLiters: 3500, shippingCo2Kg: 1.5 };

// ── All 50 curated items with manual metadata ──
// Store assignment: 1=Habitat, 2=Buffalo Exchange, 3=Savers, 4=Goodwill
const CURATED = [
  // ─── JACKETS & COATS (10) ───
  { title: /orvis.*fleece.*jacket/i, type: 'jacket', brand: 'Orvis', size: 'M', color: ['blue'], style: ['casual', 'outdoor'], condition: 'good', material: 'polyester fleece', price: 9.99, storeId: 'store-2',
    desc: 'Orvis full-zip fleece jacket in a rich blue. Soft, warm, and perfect for layering on cool Arizona evenings.' },
  { title: /columbia.*jacket/i, type: 'jacket', brand: 'Columbia', size: 'M', color: ['gray'], style: ['lightweight', 'windbreaker'], condition: 'good', material: 'nylon', price: 7.99, storeId: 'store-3',
    desc: 'Columbia lightweight wind jacket. Packable and perfect for unpredictable weather.' },
  { title: /vintage roundtree.*camel hair/i, type: 'jacket', brand: 'Roundtree & Yorke', size: 'L', color: ['tan', 'brown'], style: ['blazer', 'vintage'], condition: 'good', material: 'camel hair', price: 14.99, storeId: 'store-2',
    desc: 'Vintage 100% camel hair sport coat. Timeless, luxurious, and beautifully constructed.' },
  { title: /north face.*medium fleece.*hazen/i, type: 'jacket', brand: 'The North Face', size: 'M', color: ['black'], style: ['fleece', 'casual'], condition: 'good', material: 'polyester fleece', price: 7.55, storeId: 'store-2',
    desc: 'The North Face Hazen fleece jacket. Iconic brand, warm and comfortable for everyday wear.' },
  { title: /royal matrix.*denim jacket.*medium/i, type: 'jacket', brand: 'Royal Matrix', size: 'M', color: ['green'], style: ['denim', 'casual'], condition: 'excellent', material: 'denim', price: 21.99, storeId: 'store-3',
    desc: 'Green denim jacket. A bold pop of color for any outfit. Brand new with tags.' },
  { title: /north face zip up.*small/i, type: 'jacket', brand: 'The North Face', size: 'S', color: ['gray'], style: ['zip-up', 'casual'], condition: 'good', material: 'polyester', price: 12.99, storeId: 'store-4',
    desc: 'The North Face zip-up jacket in heathered gray. Versatile layering piece from a trusted outdoor brand.' },
  { title: /wild fable cropped denim/i, type: 'jacket', brand: 'Wild Fable', size: 'XS', color: ['blue'], style: ['cropped', 'denim'], condition: 'good', material: 'denim', price: 8.99, storeId: 'store-4',
    desc: 'Cropped denim jacket with raw hem. Trendy and fun for pairing with high-waisted everything.' },
  { title: /zara.*faux suede.*jacket/i, type: 'jacket', brand: 'Zara', size: 'XS', color: ['tan', 'brown'], style: ['suede', 'cropped'], condition: 'good', material: 'faux suede', price: 14.99, storeId: 'store-2',
    desc: 'Zara faux suede crop jacket with button-up front. Warm tones and a flattering silhouette.' },
  { title: /nautica khaki.*jacket/i, type: 'jacket', brand: 'Nautica', size: 'XL', color: ['khaki', 'tan'], style: ['zip-up', 'casual'], condition: 'good', material: 'cotton blend', price: 9.99, storeId: 'store-3',
    desc: 'Nautica khaki zip-up jacket. Clean, preppy style that works for any casual occasion.' },
  { title: /H Florence.*leather coat/i, type: 'jacket', brand: 'H Florence', size: 'L', color: ['black'], style: ['leather', 'coat'], condition: 'good', material: 'leather', price: 24.99, storeId: 'store-2',
    desc: 'Genuine leather coat by H Florence House of Leather. Rich, structured, and timeless.' },

  // ─── TOPS & SHIRTS (8) ───
  { title: /tommy bahama.*silk/i, type: 'shirt', brand: 'Tommy Bahama', size: 'L', color: ['multicolor'], style: ['tropical', 'dress'], condition: 'good', material: '100% silk', price: 12.99, storeId: 'store-2',
    desc: 'Tommy Bahama 100% silk dress shirt. Island vibes meet dressed-up style.' },
  { title: /lululemon to the point tee/i, type: 'shirt', brand: 'Lululemon', size: '4', color: ['black'], style: ['athletic', 'minimal'], condition: 'good', material: 'technical fabric', price: 14.99, storeId: 'store-2',
    desc: 'Lululemon To The Point tee in black. Sleek, comfortable, and effortlessly cool.' },
  { title: /melrose place henley/i, type: 'shirt', brand: 'Melrose Place', size: 'M', color: ['green'], style: ['henley', 'casual'], condition: 'excellent', material: 'cotton', price: 6.99, storeId: 'store-4',
    desc: 'Mint green henley shirt. Fresh color and relaxed fit for everyday wear.' },
  { title: /halogen.*black blouse/i, type: 'blouse', brand: 'Halogen', size: 'S', color: ['black'], style: ['pleated', 'dressy'], condition: 'good', material: 'polyester blend', price: 8.99, storeId: 'store-3',
    desc: 'Halogen pleated flowy black blouse. Elegant enough for work, comfortable enough for weekend brunch.' },
  { title: /adidas climacool.*pullover/i, type: 'shirt', brand: 'Adidas', size: 'XL', color: ['gray'], style: ['athletic', 'golf'], condition: 'good', material: 'polyester', price: 11.99, storeId: 'store-3',
    desc: 'Adidas Climacool half-zip golf pullover. Moisture-wicking performance wear at a fraction of retail.' },
  { title: /goodfellow.*polo/i, type: 'shirt', brand: 'Goodfellow', size: 'L', color: ['blue'], style: ['polo', 'casual'], condition: 'good', material: 'cotton blend', price: 4.99, storeId: 'store-4',
    desc: 'Lightweight men\'s polo in a classic blue. Simple, versatile, done.' },
  { title: /fintech sun defender.*medium.*navy/i, type: 'shirt', brand: 'Fintech', size: 'M', color: ['navy'], style: ['athletic', 'UPF'], condition: 'excellent', material: 'polyester', price: 7.99, storeId: 'store-1',
    desc: 'UV 50+ sun defender short-sleeve shirt. Perfect for Arizona outdoor adventures. New with tags.' },
  { title: /stockh.*jersey blazer/i, type: 'shirt', brand: 'Stockh LM', size: 'S', color: ['navy'], style: ['blazer', 'jersey'], condition: 'good', material: 'jersey knit', price: 12.99, storeId: 'store-2',
    desc: 'Stockh LM Petra jersey blazer in navy. Structured enough for the office, stretchy enough for comfort.' },

  // ─── SWEATERS & CARDIGANS (5) ───
  { title: /wren.*rowe.*cardigan.*medium/i, type: 'sweater', brand: 'Wren + Rowe', size: 'M', color: ['gray'], style: ['cardigan', 'open-front'], condition: 'excellent', material: 'knit blend', price: 15.56, storeId: 'store-2',
    desc: 'Open-front drape cardigan. Effortlessly elegant layering piece.' },
  { title: /tommy hilfiger.*pullover.*women/i, type: 'sweater', brand: 'Tommy Hilfiger', size: 'M', color: ['navy'], style: ['pullover', 'zip-neck'], condition: 'good', material: 'cotton blend', price: 11.99, storeId: 'store-3',
    desc: 'Tommy Hilfiger zip-neck pullover sweatshirt. Classic American sportswear with a cozy feel.' },
  { title: /loft teddy.*cardigan/i, type: 'sweater', brand: 'LOFT', size: 'L', color: ['navy'], style: ['teddy', 'open-front'], condition: 'good', material: 'polyester sherpa', price: 10.99, storeId: 'store-4',
    desc: 'LOFT teddy-textured open-front cardigan. Impossibly soft and cozy.' },
  { title: /eddie bauer cardigan hoodie/i, type: 'sweater', brand: 'Eddie Bauer', size: 'M', color: ['gray'], style: ['hoodie', 'cardigan'], condition: 'good', material: 'cotton blend', price: 9.99, storeId: 'store-3',
    desc: 'Eddie Bauer cardigan hoodie. The best of both worlds - hoodie comfort meets cardigan style.' },
  { title: /nation ltd.*cardigan/i, type: 'sweater', brand: 'Nation Ltd.', size: 'S', color: ['cream', 'white'], style: ['ruffle', 'cardigan'], condition: 'good', material: 'cotton/alpaca blend', price: 16.99, storeId: 'store-2',
    desc: 'Nation Ltd. ruffle cardigan in cotton and alpaca blend. Luxe texture and a feminine silhouette.' },

  // ─── JEANS & PANTS (5) ───
  { title: /anthropologie.*jeans.*29/i, type: 'jeans', brand: 'Maeve by Anthropologie', size: '29', color: ['blue'], style: ['wide-leg', 'flare'], condition: 'good', material: 'denim', price: 9.99, storeId: 'store-2',
    desc: 'Anthropologie Maeve wide flare-leg jeans. Retro silhouette with a modern fit.' },
  { title: /levi strauss wedgie skinny/i, type: 'jeans', brand: "Levi's", size: '30', color: ['blue'], style: ['skinny', 'wedgie'], condition: 'good', material: 'denim', price: 11.99, storeId: 'store-3',
    desc: "Levi's Wedgie Skinny jeans. The iconic fit that flatters everyone." },
  { title: /forever 21 jeans.*26/i, type: 'jeans', brand: 'Forever 21', size: '26', color: ['blue'], style: ['skinny'], condition: 'good', material: 'denim', price: 5.99, storeId: 'store-4',
    desc: 'Forever 21 jeans in a classic dark wash. Budget-friendly denim that still looks great.' },
  { title: /joe.s jeans.*33/i, type: 'jeans', brand: "Joe's Jeans", size: '33', color: ['blue'], style: ['straight-leg'], condition: 'good', material: 'premium denim', price: 14.99, storeId: 'store-2',
    desc: "Joe's Jeans in a premium dark wash. Designer denim at a thrift store price - that's the point." },
  { title: /selected homme.*pants.*34/i, type: 'pants', brand: 'Selected Homme', size: '34/32', color: ['gray', 'black'], style: ['straight-leg', 'two-tone'], condition: 'good', material: 'cotton blend', price: 9.99, storeId: 'store-3',
    desc: 'Selected Homme two-toned straight-leg pants. Scandinavian minimalism at its finest.' },

  // ─── SHORTS (2) ───
  { title: /gap casual shorts.*31/i, type: 'shorts', brand: 'Gap', size: '31', color: ['blue', 'white'], style: ['pinstripe', 'casual'], condition: 'good', material: 'cotton', price: 5.99, storeId: 'store-4',
    desc: 'Gap pinstripe casual shorts. Easy summer staple.' },
  { title: /h.m.*distressed shorts.*32/i, type: 'shorts', brand: 'H&M', size: '32', color: ['blue'], style: ['distressed', 'denim'], condition: 'good', material: 'denim', price: 6.99, storeId: 'store-4',
    desc: 'H&M distressed denim shorts. Lived-in look, ready for warm Tempe days.' },

  // ─── DRESS (1) ───
  { title: /karl lagerfeld.*black lace dress/i, type: 'dress', brand: 'Karl Lagerfeld', size: '4', color: ['black'], style: ['lace', 'cocktail'], condition: 'good', material: 'lace/polyester', price: 19.99, storeId: 'store-2',
    desc: 'Karl Lagerfeld black lace cocktail dress. Designer elegance for a night out, at a secondhand price.' },

  // ─── SHOES (7) ───
  { title: /birkenstock gizeh/i, type: 'shoes', brand: 'Birkenstock', size: 'Various', color: ['brown'], style: ['sandals', 'thong'], condition: 'excellent', material: 'leather, cork', price: 78.00, storeId: 'store-1',
    desc: 'Birkenstock Gizeh sandals. The gold standard of comfort footwear, brand new in box.' },
  { title: /birkenstock arizona/i, type: 'shoes', brand: 'Birkenstock', size: 'Various', color: ['brown'], style: ['sandals', 'two-strap'], condition: 'excellent', material: 'leather, cork', price: 75.00, storeId: 'store-1',
    desc: 'Birkenstock Arizona sandals for men. Classic two-strap design, brand new.' },
  { title: /alexandre birman.*clarita/i, type: 'shoes', brand: 'Alexandre Birman', size: '38 EU', color: ['tan'], style: ['sandals', 'designer'], condition: 'good', material: 'braided leather', price: 19.99, storeId: 'store-2',
    desc: 'Alexandre Birman Clarita braided flat sandals. Italian luxury at a fraction of retail.' },
  { title: /naot lappland/i, type: 'shoes', brand: 'Naot', size: 'Various', color: ['brown'], style: ['sandals', 'leather'], condition: 'excellent', material: 'leather', price: 78.00, storeId: 'store-1',
    desc: 'Naot Lappland leather sandals. Premium Israeli comfort brand, new in box.' },
  { title: /franco sarto espadrille/i, type: 'shoes', brand: 'Franco Sarto', size: '8', color: ['tan', 'brown'], style: ['espadrille', 'sandals'], condition: 'good', material: 'leather, jute', price: 9.99, storeId: 'store-3',
    desc: 'Franco Sarto espadrille sandals. Summer-ready with a woven jute sole and leather upper.' },
  { title: /nine west holographic heels/i, type: 'shoes', brand: 'Nine West', size: '7.5', color: ['silver', 'holographic'], style: ['heels', 'party'], condition: 'good', material: 'synthetic', price: 12.99, storeId: 'store-4',
    desc: 'Nine West holographic heels. Statement shoes that catch the light from every angle.' },
  { title: /wolf.*shepherd.*gray/i, type: 'shoes', brand: 'Wolf & Shepherd', size: 'M4/W6', color: ['gray', 'white'], style: ['sneakers', 'casual'], condition: 'excellent', material: 'knit/rubber', price: 29.99, storeId: 'store-2',
    desc: 'Wolf & Shepherd performance sneakers. Where dress shoe comfort meets sneaker style. Brand new.' },

  // ─── BAGS & ACCESSORIES (4) ───
  { title: /michael kors handbag/i, type: 'bag', brand: 'Michael Kors', size: 'One Size', color: ['red'], style: ['quilted', 'designer'], condition: 'good', material: 'quilted leather', price: 19.99, storeId: 'store-2',
    desc: 'Red quilted Michael Kors handbag. Bold color, iconic designer, perfectly sized for daily use.' },
  { title: /banana republic sunglasses/i, type: 'accessories', brand: 'Banana Republic', size: 'One Size', color: ['brown', 'gold'], style: ['sunglasses'], condition: 'excellent', material: 'acetate, metal', price: 14.99, storeId: 'store-3',
    desc: 'Banana Republic sunglasses with a warm, sophisticated frame. UV protection meets style.' },
  { title: /elaine turner.*purse/i, type: 'bag', brand: 'Elaine Turner', size: 'One Size', color: ['black'], style: ['leather', 'suede'], condition: 'good', material: 'leather and suede', price: 16.99, storeId: 'store-2',
    desc: 'Elaine Turner leather and suede handbag in black. Understated luxury with beautiful mixed textures.' },
  { title: /juicy couture sunglasses/i, type: 'accessories', brand: 'Juicy Couture', size: 'One Size', color: ['black', 'pink'], style: ['sunglasses', 'glam'], condition: 'excellent', material: 'acetate', price: 12.99, storeId: 'store-4',
    desc: 'Juicy Couture sunglasses. A touch of glam for sunny Tempe days.' },

  // ─── HOME & ELECTRONICS (4) ───
  { title: /handcrafted blue swirl glass vase/i, type: 'home', brand: 'Teppie (Handcrafted)', size: 'One Size', color: ['blue', 'white'], style: ['vase', 'art glass'], condition: 'good', material: 'dichroic glass', price: 24.89, storeId: 'store-1',
    desc: 'Handcrafted blue swirl glass vase with dichroic accents. A one-of-a-kind art piece.' },
  { title: /mikasa.*coffee pot/i, type: 'home', brand: 'Mikasa', size: 'One Size', color: ['white', 'brown'], style: ['kitchenware'], condition: 'good', material: 'ceramic', price: 14.99, storeId: 'store-1',
    desc: 'Mikasa Intaglio Santa Fe coffee pot with lid. Southwest-inspired design, elegant and functional.' },
  { title: /apple tv.*3rd/i, type: 'electronics', brand: 'Apple', size: 'One Size', color: ['black'], style: ['streaming', 'smart home'], condition: 'fair', material: 'aluminum', price: 9.99, storeId: 'store-1',
    desc: 'Apple TV 3rd generation. Compact streaming device, still going strong.' },
  { title: /google nest thermostat trim/i, type: 'electronics', brand: 'Google', size: 'One Size', color: ['white'], style: ['smart home'], condition: 'excellent', material: 'plastic', price: 11.99, storeId: 'store-1',
    desc: 'Google Nest Thermostat trim kit in Snow white. Brand new and sealed.' },
];

async function main() {
  const allScraped = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/ebay-habitat-listings.json'), 'utf-8'));
  const enrichedData = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/ebay-selected-enriched.json'), 'utf-8'));

  // Build lookup for enriched items (have high-res images)
  const enrichedByUrl = {};
  for (const e of enrichedData) enrichedByUrl[e.url] = e;

  const items = [];
  const now = new Date();

  for (let i = 0; i < CURATED.length; i++) {
    const cfg = CURATED[i];

    // Find matching scraped item
    const scraped = allScraped.find(s => cfg.title.test(s.title));
    if (!scraped) {
      console.log(`MISS: ${cfg.title}`);
      continue;
    }

    const id = `item-${String(i + 1).padStart(3, '0')}`;
    console.log(`[${i + 1}/${CURATED.length}] ${scraped.title.substring(0, 55)}`);

    // Get best image URL
    const enriched = enrichedByUrl[scraped.url];
    const hiResImg = enriched?.images?.[0];
    const hiResImg2 = enriched?.images?.[1];
    const thumbImg = scraped.imageUrl;

    // Use hi-res if available from enrichment, otherwise upgrade thumbnail
    const mainImgUrl = hiResImg || thumbImg.replace(/s-l300/, 's-l1600');
    const secondImgUrl = hiResImg2 || null;

    // Download main image
    const ext = '.jpg';
    const filename = `${id}${ext}`;
    const filepath = path.join(UPLOAD_DIR, filename);
    const photos = [`/uploads/${filename}`];

    if (!fs.existsSync(filepath)) {
      try {
        await download(mainImgUrl, filepath);
        console.log(`  Downloaded ${filename}`);
      } catch {
        // Fallback to thumbnail
        try {
          await download(thumbImg, filepath);
          console.log(`  Downloaded ${filename} (thumbnail fallback)`);
        } catch (err) {
          console.log(`  FAILED: ${err.message}`);
        }
      }
    } else {
      console.log(`  Already have ${filename}`);
    }

    // Download second image if available
    if (secondImgUrl) {
      const filename2 = `${id}-2${ext}`;
      const filepath2 = path.join(UPLOAD_DIR, filename2);
      if (!fs.existsSync(filepath2)) {
        try {
          await download(secondImgUrl, filepath2);
          photos.push(`/uploads/${filename2}`);
        } catch { /* skip */ }
      } else {
        photos.push(`/uploads/${filename2}`);
      }
    }

    // Stagger creation dates over the past 3 weeks
    const daysAgo = (CURATED.length - i) * 0.4 + Math.random() * 2;
    const createdAt = new Date(now - daysAgo * 24 * 60 * 60 * 1000);

    items.push({
      id,
      photos,
      type: cfg.type,
      color: cfg.color,
      brand: cfg.brand,
      size: cfg.size,
      style: cfg.style,
      condition: cfg.condition,
      material: cfg.material,
      price: cfg.price,
      description: cfg.desc,
      store: STORES.find(s => s.id === cfg.storeId),
      carbonSavings: CARBON[cfg.type] || DEFAULT_CARBON,
      favorites: Math.floor(Math.random() * 12),
      status: "available",
      createdAt: createdAt.toISOString(),
      updatedAt: createdAt.toISOString(),
    });
  }

  // Write items.json (complete replacement)
  const outPath = path.join(ROOT, 'data/items.json');
  fs.writeFileSync(outPath, JSON.stringify(items, null, 2));
  console.log(`\nWrote ${items.length} items to data/items.json`);

  // Summary by store
  for (const store of STORES) {
    const count = items.filter(i => i.store.id === store.id).length;
    console.log(`  ${store.name}: ${count} items`);
  }

  // Summary by type
  const types = {};
  for (const item of items) { types[item.type] = (types[item.type] || 0) + 1; }
  console.log('\nBy type:', types);
}

main().catch(console.error);
