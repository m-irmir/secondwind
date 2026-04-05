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
        file.close(); fs.unlinkSync(dest);
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
const DEFAULT_CARBON = { co2Kg: 10.0, waterLiters: 3500, shippingCo2Kg: 1.5 };

// ── 55 curated items: heavy on clothes, Habitat gets home goods ──
const CURATED = [
  // ═══════════ JACKETS & COATS (12) — across Buffalo Exchange, Savers, Goodwill ═══════════
  { title: /orvis.*fleece.*jacket/i, type: 'jacket', brand: 'Orvis', size: 'M', color: ['blue'], style: ['casual', 'outdoor'], condition: 'good', material: 'polyester fleece', price: 9.99, storeId: 'store-2',
    desc: 'Orvis full-zip fleece jacket in a rich blue. Soft, warm, and perfect for layering on cool Arizona evenings.' },
  { title: /columbia.*jacket/i, type: 'jacket', brand: 'Columbia', size: 'M', color: ['gray'], style: ['lightweight', 'windbreaker'], condition: 'good', material: 'nylon', price: 7.99, storeId: 'store-3',
    desc: 'Columbia lightweight wind jacket. Packable and ready for anything.' },
  { title: /vintage roundtree.*camel hair/i, type: 'jacket', brand: 'Roundtree & Yorke', size: 'L', color: ['tan', 'brown'], style: ['blazer', 'vintage'], condition: 'good', material: 'camel hair', price: 14.99, storeId: 'store-2',
    desc: 'Vintage 100% camel hair sport coat. Timeless luxury, beautifully constructed.' },
  { title: /north face.*medium fleece.*hazen/i, type: 'jacket', brand: 'The North Face', size: 'M', color: ['black'], style: ['fleece', 'casual'], condition: 'good', material: 'polyester fleece', price: 7.55, storeId: 'store-2',
    desc: 'The North Face Hazen fleece jacket. Iconic brand, warm and comfortable.' },
  { title: /royal matrix.*denim jacket.*medium/i, type: 'jacket', brand: 'Royal Matrix', size: 'M', color: ['green'], style: ['denim', 'casual'], condition: 'excellent', material: 'denim', price: 21.99, storeId: 'store-3',
    desc: 'Green denim jacket. Bold pop of color. Brand new with tags.' },
  { title: /north face zip up.*small$/i, type: 'jacket', brand: 'The North Face', size: 'S', color: ['gray'], style: ['zip-up'], condition: 'good', material: 'polyester', price: 12.99, storeId: 'store-4',
    desc: 'The North Face zip-up jacket in heathered gray. Versatile layering piece.' },
  { title: /wild fable cropped denim/i, type: 'jacket', brand: 'Wild Fable', size: 'XS', color: ['blue'], style: ['cropped', 'denim'], condition: 'good', material: 'denim', price: 8.99, storeId: 'store-4',
    desc: 'Cropped denim jacket with raw hem. Trendy and fun.' },
  { title: /zara.*faux suede.*jacket/i, type: 'jacket', brand: 'Zara', size: 'XS', color: ['tan', 'brown'], style: ['suede', 'cropped'], condition: 'good', material: 'faux suede', price: 14.99, storeId: 'store-2',
    desc: 'Zara faux suede crop jacket. Warm tones, flattering silhouette.' },
  { title: /nautica khaki.*jacket/i, type: 'jacket', brand: 'Nautica', size: 'XL', color: ['khaki', 'tan'], style: ['zip-up'], condition: 'good', material: 'cotton blend', price: 9.99, storeId: 'store-3',
    desc: 'Nautica khaki zip-up jacket. Clean, preppy, versatile.' },
  { title: /H Florence.*leather coat/i, type: 'jacket', brand: 'H Florence', size: 'L', color: ['black'], style: ['leather', 'coat'], condition: 'good', material: 'leather', price: 24.99, storeId: 'store-2',
    desc: 'Genuine leather coat by H Florence. Rich, structured, and timeless.' },
  { title: /north face.*women.*black.*fleece/i, type: 'jacket', brand: 'The North Face', size: 'M', color: ['black'], style: ['fleece', 'zip-up'], condition: 'good', material: 'polyester fleece', price: 11.99, storeId: 'store-3',
    desc: 'The North Face women\'s black fleece. A closet essential that never goes out of style.' },
  { title: /north face women.*polartec/i, type: 'jacket', brand: 'The North Face', size: 'M', color: ['gray'], style: ['fleece', 'polartec'], condition: 'good', material: 'Polartec fleece', price: 14.99, storeId: 'store-4',
    desc: 'The North Face Polartec lightweight fleece. Premium warmth-to-weight ratio.' },
  { title: /weatherproof garment.*jacket/i, type: 'jacket', brand: 'Weatherproof', size: 'XL', color: ['black'], style: ['casual'], condition: 'good', material: 'polyester', price: 8.99, storeId: 'store-4',
    desc: 'Weatherproof Garment Company women\'s jacket. Reliable layering for any season.' },
  { title: /gap longline.*jacket/i, type: 'jacket', brand: 'Gap', size: 'M', color: ['navy'], style: ['longline', 'button-up'], condition: 'good', material: 'cotton blend', price: 10.99, storeId: 'store-3',
    desc: 'Gap longline button-up jacket. Classic Americana with a longer, modern cut.' },
  { title: /karen scott.*corduroy jacket/i, type: 'jacket', brand: 'Karen Scott', size: 'L', color: ['brown'], style: ['corduroy', 'zip-up'], condition: 'good', material: 'corduroy', price: 7.99, storeId: 'store-4',
    desc: 'Karen Scott corduroy jacket. Cozy fall texture, full zip, great condition.' },
  { title: /hummel.*jacket/i, type: 'jacket', brand: 'Hummel', size: 'L', color: ['black', 'white'], style: ['track', 'sporty'], condition: 'good', material: 'polyester', price: 9.99, storeId: 'store-3',
    desc: 'Hummel full-zip track jacket. European sportswear heritage at a steal.' },
  { title: /pebble beach.*jacket/i, type: 'jacket', brand: 'Pebble Beach', size: 'XXL', color: ['navy'], style: ['performance', 'golf'], condition: 'good', material: 'polyester', price: 8.99, storeId: 'store-4',
    desc: 'Pebble Beach performance zip-up. Golf-ready, but honestly looks good anywhere.' },

  // ═══════════ SHIRTS & TOPS (13) — everywhere ═══════════
  { title: /tommy bahama.*silk/i, type: 'shirt', brand: 'Tommy Bahama', size: 'L', color: ['multicolor'], style: ['tropical', 'dress'], condition: 'good', material: '100% silk', price: 12.99, storeId: 'store-2',
    desc: 'Tommy Bahama 100% silk dress shirt. Island vibes meet dressed-up style.' },
  { title: /lululemon to the point tee/i, type: 'shirt', brand: 'Lululemon', size: '4', color: ['black'], style: ['athletic', 'minimal'], condition: 'good', material: 'technical fabric', price: 14.99, storeId: 'store-2',
    desc: 'Lululemon To The Point tee in black. Sleek, comfortable, effortlessly cool.' },
  { title: /melrose place henley/i, type: 'shirt', brand: 'Melrose Place', size: 'M', color: ['green'], style: ['henley', 'casual'], condition: 'excellent', material: 'cotton', price: 6.99, storeId: 'store-4',
    desc: 'Mint green henley shirt. Fresh color, relaxed fit, everyday wear.' },
  { title: /halogen.*black blouse/i, type: 'blouse', brand: 'Halogen', size: 'S', color: ['black'], style: ['pleated', 'dressy'], condition: 'good', material: 'polyester blend', price: 8.99, storeId: 'store-3',
    desc: 'Halogen pleated flowy black blouse. Elegant for work, comfortable for weekend brunch.' },
  { title: /adidas climacool.*pullover/i, type: 'shirt', brand: 'Adidas', size: 'XL', color: ['gray'], style: ['athletic', 'golf'], condition: 'good', material: 'polyester', price: 11.99, storeId: 'store-3',
    desc: 'Adidas Climacool half-zip golf pullover. Moisture-wicking performance at a fraction of retail.' },
  { title: /goodfellow.*polo/i, type: 'shirt', brand: 'Goodfellow', size: 'L', color: ['blue'], style: ['polo', 'casual'], condition: 'good', material: 'cotton blend', price: 4.99, storeId: 'store-4',
    desc: 'Lightweight men\'s polo in classic blue. Simple, versatile, done.' },
  { title: /fintech sun defender.*medium.*navy/i, type: 'shirt', brand: 'Fintech', size: 'M', color: ['navy'], style: ['athletic', 'UPF'], condition: 'excellent', material: 'polyester', price: 7.99, storeId: 'store-3',
    desc: 'UV 50+ sun defender short-sleeve shirt. Built for Arizona sun. New with tags.' },
  { title: /stockh.*jersey blazer/i, type: 'shirt', brand: 'Stockh LM', size: 'S', color: ['navy'], style: ['blazer', 'jersey'], condition: 'good', material: 'jersey knit', price: 12.99, storeId: 'store-2',
    desc: 'Stockh LM Petra jersey blazer in navy. Office-ready, stretch-comfortable.' },
  { title: /men.*antigua.*polo/i, type: 'shirt', brand: 'Antigua', size: 'L', color: ['red'], style: ['polo', 'golf'], condition: 'good', material: 'polyester', price: 6.99, storeId: 'store-3',
    desc: 'Antigua golf polo in a bold red. Performance fabric, sharp look.' },
  { title: /women.*antigua.*polo/i, type: 'shirt', brand: 'Antigua', size: 'M', color: ['red'], style: ['polo', 'golf'], condition: 'good', material: 'polyester', price: 6.99, storeId: 'store-4',
    desc: 'Women\'s Antigua golf polo in red. Sporty, breathable, and bright.' },
  { title: /sincerely jules.*crop turtle/i, type: 'shirt', brand: 'Sincerely Jules', size: 'S', color: ['cream'], style: ['crop', 'turtleneck'], condition: 'good', material: 'knit', price: 8.99, storeId: 'store-2',
    desc: 'Sincerely Jules crop turtleneck sweater. Cozy meets trendy in a cropped silhouette.' },
  { title: /fintech.*longsleeve.*small/i, type: 'shirt', brand: 'Fintech', size: 'S', color: ['blue'], style: ['athletic', 'UPF'], condition: 'excellent', material: 'polyester', price: 6.99, storeId: 'store-4',
    desc: 'UV-protective long-sleeve sun shirt. Year-round Arizona essential.' },
  { title: /nike pro.*leggings/i, type: 'pants', brand: 'Nike', size: 'XS', color: ['black'], style: ['leggings', 'athletic'], condition: 'good', material: 'nylon/spandex', price: 9.99, storeId: 'store-2',
    desc: 'Nike Pro leggings in black. Compression fit, sweat-wicking, gym-tested.' },

  // ═══════════ SWEATERS & CARDIGANS & HOODIES (9) ═══════════
  { title: /wren.*rowe.*cardigan.*medium/i, type: 'sweater', brand: 'Wren + Rowe', size: 'M', color: ['gray'], style: ['cardigan', 'open-front'], condition: 'excellent', material: 'knit blend', price: 15.56, storeId: 'store-2',
    desc: 'Open-front drape cardigan. Effortlessly elegant layering piece.' },
  { title: /tommy hilfiger.*pullover.*women/i, type: 'sweater', brand: 'Tommy Hilfiger', size: 'M', color: ['navy'], style: ['pullover', 'zip-neck'], condition: 'good', material: 'cotton blend', price: 11.99, storeId: 'store-3',
    desc: 'Tommy Hilfiger zip-neck pullover. Classic American sportswear, cozy feel.' },
  { title: /loft teddy.*cardigan/i, type: 'sweater', brand: 'LOFT', size: 'L', color: ['navy'], style: ['teddy', 'open-front'], condition: 'good', material: 'polyester sherpa', price: 10.99, storeId: 'store-4',
    desc: 'LOFT teddy-textured open-front cardigan. Impossibly soft and cozy.' },
  { title: /eddie bauer cardigan hoodie/i, type: 'sweater', brand: 'Eddie Bauer', size: 'M', color: ['gray'], style: ['hoodie', 'cardigan'], condition: 'good', material: 'cotton blend', price: 9.99, storeId: 'store-3',
    desc: 'Eddie Bauer cardigan hoodie. Hoodie comfort meets cardigan style.' },
  { title: /nation ltd.*cardigan/i, type: 'sweater', brand: 'Nation Ltd.', size: 'S', color: ['cream'], style: ['ruffle', 'cardigan'], condition: 'good', material: 'cotton/alpaca blend', price: 16.99, storeId: 'store-2',
    desc: 'Nation Ltd. ruffle cardigan in cotton and alpaca. Luxe texture, feminine silhouette.' },
  { title: /nautica half zip pullover/i, type: 'sweater', brand: 'Nautica', size: 'S', color: ['navy'], style: ['half-zip', 'pullover'], condition: 'good', material: 'cotton blend', price: 8.99, storeId: 'store-3',
    desc: 'Nautica half-zip pullover. Preppy weekend essential.' },
  { title: /shambhala cardigan/i, type: 'sweater', brand: 'Shambhala', size: 'M', color: ['gray'], style: ['cardigan', 'casual'], condition: 'good', material: 'cotton blend', price: 7.99, storeId: 'store-4',
    desc: 'Shambhala cardigan in light grey heather. Soft, simple, goes with everything.' },
  { title: /fever black.*cardigan/i, type: 'sweater', brand: 'Fever', size: 'XL', color: ['black'], style: ['open-front', 'cardigan'], condition: 'good', material: 'knit', price: 6.99, storeId: 'store-4',
    desc: 'Fever black open-front cardigan. A wardrobe staple that works year-round.' },
  { title: /sleefs.*hoodie/i, type: 'sweater', brand: 'Sleefs', size: 'L', color: ['multicolor'], style: ['hoodie', 'active'], condition: 'good', material: 'polyester blend', price: 12.99, storeId: 'store-3',
    desc: 'Sleefs Juice active hoodie. Loud print, comfy fit, made for standing out.' },
  { title: /greg norman.*sweatshirt/i, type: 'sweater', brand: 'Greg Norman', size: 'XXL', color: ['gray'], style: ['zip-up', 'golf'], condition: 'good', material: 'polyester', price: 8.99, storeId: 'store-3',
    desc: 'Greg Norman full-zip sweatshirt. Golf-course polish meets everyday comfort.' },
  { title: /Y\.D\. Zhuliu hoodie/i, type: 'sweater', brand: 'Y.D. Zhuliu', size: 'XL', color: ['gray'], style: ['hoodie', 'graphic'], condition: 'good', material: 'cotton blend', price: 7.99, storeId: 'store-4',
    desc: 'Graphic hoodie with "Pursue Every Perfect Detail" print. Cozy and statement-making.' },
  { title: /l\.l\. be.*sweatshirt/i, type: 'sweater', brand: 'L.L. Bean', size: 'L', color: ['blue'], style: ['sweatshirt', 'casual'], condition: 'good', material: 'cotton', price: 9.99, storeId: 'store-3',
    desc: 'L.L. Bean women\'s sweatshirt. Built to last, comfy as it gets, and under $10.' },

  // ═══════════ JEANS (7) ═══════════
  { title: /anthropologie.*jeans.*29/i, type: 'jeans', brand: 'Maeve by Anthropologie', size: '29', color: ['blue'], style: ['wide-leg', 'flare'], condition: 'good', material: 'denim', price: 9.99, storeId: 'store-2',
    desc: 'Anthropologie Maeve wide flare-leg jeans. Retro silhouette, modern fit.' },
  { title: /levi strauss wedgie skinny/i, type: 'jeans', brand: "Levi's", size: '30', color: ['blue'], style: ['skinny', 'wedgie'], condition: 'good', material: 'denim', price: 11.99, storeId: 'store-3',
    desc: "Levi's Wedgie Skinny jeans. The iconic fit that flatters everyone." },
  { title: /forever 21 jeans.*26/i, type: 'jeans', brand: 'Forever 21', size: '26', color: ['blue'], style: ['skinny'], condition: 'good', material: 'denim', price: 5.99, storeId: 'store-4',
    desc: 'Forever 21 jeans in classic dark wash. Budget-friendly and still looks great.' },
  { title: /joe.s jeans.*33/i, type: 'jeans', brand: "Joe's Jeans", size: '33', color: ['blue'], style: ['straight-leg'], condition: 'good', material: 'premium denim', price: 14.99, storeId: 'store-2',
    desc: "Joe's Jeans in premium dark wash. Designer denim at a thrift store price." },
  { title: /switch remarkable jeans/i, type: 'jeans', brand: 'Switch', size: '36/34', color: ['black'], style: ['splatter', 'streetwear'], condition: 'good', material: 'denim', price: 9.99, storeId: 'store-4',
    desc: 'Switch Remarkable jeans with bleach splatter detail. Streetwear-ready statement denim.' },
  { title: /skinny jeans.*mellow denim/i, type: 'jeans', brand: 'Mellow Denim', size: '7 (Juniors)', color: ['blue'], style: ['skinny', 'clean'], condition: 'excellent', material: 'denim', price: 7.99, storeId: 'store-4',
    desc: 'Non-distressed skinny jeans. Clean, classic, new with tags.' },
  { title: /jean shorts parker jeans/i, type: 'jeans', brand: 'Parker', size: '32', color: ['blue'], style: ['shorts', 'denim'], condition: 'good', material: 'denim', price: 6.99, storeId: 'store-3',
    desc: 'Parker denim shorts. Cut-off style with just the right amount of wear.' },

  // ═══════════ PANTS & SHORTS (5) ═══════════
  { title: /selected homme.*pants.*34/i, type: 'pants', brand: 'Selected Homme', size: '34/32', color: ['gray', 'black'], style: ['straight-leg', 'two-tone'], condition: 'good', material: 'cotton blend', price: 9.99, storeId: 'store-2',
    desc: 'Selected Homme two-toned straight-leg pants. Scandinavian minimalism.' },
  { title: /gap casual shorts.*31/i, type: 'shorts', brand: 'Gap', size: '31', color: ['blue', 'white'], style: ['pinstripe', 'casual'], condition: 'good', material: 'cotton', price: 5.99, storeId: 'store-4',
    desc: 'Gap pinstripe casual shorts. Easy summer staple.' },
  { title: /h.m.*distressed shorts.*32/i, type: 'shorts', brand: 'H&M', size: '32', color: ['blue'], style: ['distressed', 'denim'], condition: 'good', material: 'denim', price: 6.99, storeId: 'store-4',
    desc: 'H&M distressed denim shorts. Lived-in look for warm Tempe days.' },
  { title: /izod.*golf shorts/i, type: 'shorts', brand: 'Izod', size: '8', color: ['plaid'], style: ['golf', 'stretch'], condition: 'excellent', material: 'polyester blend', price: 7.99, storeId: 'store-3',
    desc: 'Izod plaid golf shorts with stretch. New, lightweight, ready for the course.' },
  { title: /chaps.*31.*shorts/i, type: 'shorts', brand: 'Chaps', size: '31', color: ['khaki'], style: ['casual', 'classic'], condition: 'good', material: 'cotton', price: 5.99, storeId: 'store-3',
    desc: 'Chaps casual shorts in khaki. Timeless, comfortable, reliable.' },

  // ═══════════ DRESS (1) ═══════════
  { title: /karl lagerfeld.*black lace dress/i, type: 'dress', brand: 'Karl Lagerfeld', size: '4', color: ['black'], style: ['lace', 'cocktail'], condition: 'good', material: 'lace/polyester', price: 19.99, storeId: 'store-2',
    desc: 'Karl Lagerfeld black lace cocktail dress. Designer elegance at a secondhand price.' },

  // ═══════════ SHOES (3 only) — Habitat ═══════════
  { title: /birkenstock gizeh/i, type: 'shoes', brand: 'Birkenstock', size: 'Various', color: ['brown'], style: ['sandals'], condition: 'excellent', material: 'leather, cork', price: 78.00, storeId: 'store-1',
    desc: 'Birkenstock Gizeh sandals. The gold standard of comfort footwear, new in box.' },
  { title: /birkenstock arizona/i, type: 'shoes', brand: 'Birkenstock', size: 'Various', color: ['brown'], style: ['sandals'], condition: 'excellent', material: 'leather, cork', price: 75.00, storeId: 'store-1',
    desc: 'Birkenstock Arizona two-strap sandals. Classic design, brand new.' },
  { title: /alexandre birman.*clarita/i, type: 'shoes', brand: 'Alexandre Birman', size: '38 EU', color: ['tan'], style: ['sandals', 'designer'], condition: 'good', material: 'braided leather', price: 19.99, storeId: 'store-2',
    desc: 'Alexandre Birman Clarita braided flat sandals. Italian luxury at a fraction of retail.' },

  // ═══════════ BAG (1) ═══════════
  { title: /michael kors handbag/i, type: 'bag', brand: 'Michael Kors', size: 'One Size', color: ['red'], style: ['quilted', 'designer'], condition: 'good', material: 'quilted leather', price: 19.99, storeId: 'store-2',
    desc: 'Red quilted Michael Kors handbag. Bold color, iconic designer.' },

  // ═══════════ HOME & ELECTRONICS (3 only) — Habitat ReStore ═══════════
  { title: /apple tv.*3rd/i, type: 'electronics', brand: 'Apple', size: 'One Size', color: ['black'], style: ['streaming'], condition: 'fair', material: 'aluminum', price: 9.99, storeId: 'store-1',
    desc: 'Apple TV 3rd generation. Compact streaming device, still going strong.' },
  { title: /google nest thermostat trim/i, type: 'electronics', brand: 'Google', size: 'One Size', color: ['white'], style: ['smart home'], condition: 'excellent', material: 'plastic', price: 11.99, storeId: 'store-1',
    desc: 'Google Nest Thermostat trim kit. Brand new and sealed.' },
  { title: /handcrafted blue swirl glass vase/i, type: 'home', brand: 'Teppie (Handcrafted)', size: 'One Size', color: ['blue', 'white'], style: ['vase', 'art glass'], condition: 'good', material: 'dichroic glass', price: 24.89, storeId: 'store-1',
    desc: 'Handcrafted blue swirl glass vase with dichroic accents. One-of-a-kind art piece.' },

  // ═══════════ MORE CLOTHES — fill out the feed ═══════════
  { title: /royal matrix.*denim jacket.*xs/i, type: 'jacket', brand: 'Royal Matrix', size: 'XS', color: ['green'], style: ['denim'], condition: 'excellent', material: 'denim', price: 19.99, storeId: 'store-4',
    desc: 'Royal Matrix green denim jacket in XS. New with tags, bold color.' },
  { title: /even tide.*swim shorts/i, type: 'shorts', brand: 'Even Tide', size: '40', color: ['blue'], style: ['swim', 'casual'], condition: 'good', material: 'polyester', price: 5.99, storeId: 'store-4',
    desc: 'Even Tide men\'s swim trunks. Pool-ready and priced to move.' },
  { title: /levi.*511.*boys.*16/i, type: 'jeans', brand: "Levi's", size: '16 (28x28)', color: ['blue'], style: ['slim', '511'], condition: 'good', material: 'denim', price: 6.99, storeId: 'store-4',
    desc: "Levi's 511 slim jeans. Classic slim fit in a versatile wash." },
  { title: /mad pelican.*shorts.*medium/i, type: 'shorts', brand: 'Mad Pelican', size: 'M', color: ['blue'], style: ['walking', 'casual'], condition: 'good', material: 'polyester blend', price: 6.99, storeId: 'store-3',
    desc: 'Mad Pelican walking shorts in Aruba Blue. Lightweight and vacation-ready.' },
  { title: /wren.*rowe.*cardigan.*large/i, type: 'sweater', brand: 'Wren + Rowe', size: 'L', color: ['gray'], style: ['cardigan', 'open-front'], condition: 'excellent', material: 'knit blend', price: 15.56, storeId: 'store-3',
    desc: 'Wren + Rowe open-front drape cardigan in Large. Effortless elegance.' },
];

async function main() {
  const allScraped = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/ebay-habitat-listings.json'), 'utf-8'));
  const enrichedData = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/ebay-selected-enriched.json'), 'utf-8'));
  const enrichedByUrl = {};
  for (const e of enrichedData) enrichedByUrl[e.url] = e;

  const items = [];
  const now = new Date();

  for (let i = 0; i < CURATED.length; i++) {
    const cfg = CURATED[i];
    const scraped = allScraped.find(s => cfg.title.test(s.title));
    if (!scraped) { console.log(`MISS: ${cfg.title}`); continue; }

    const id = `item-${String(items.length + 1).padStart(3, '0')}`;
    console.log(`[${items.length + 1}] ${scraped.title.substring(0, 60)}`);

    const enriched = enrichedByUrl[scraped.url];
    const mainImgUrl = enriched?.images?.[0] || scraped.imageUrl.replace(/s-l300/, 's-l1600');
    const secondImgUrl = enriched?.images?.[1] || null;

    const filename = `${id}.jpg`;
    const filepath = path.join(UPLOAD_DIR, filename);
    const photos = [`/uploads/${filename}`];

    if (!fs.existsSync(filepath)) {
      try { await download(mainImgUrl, filepath); }
      catch { try { await download(scraped.imageUrl, filepath); } catch (e) { console.log(`  FAIL: ${e.message}`); } }
    }

    if (secondImgUrl) {
      const f2 = `${id}-2.jpg`;
      const p2 = path.join(UPLOAD_DIR, f2);
      if (!fs.existsSync(p2)) { try { await download(secondImgUrl, p2); photos.push(`/uploads/${f2}`); } catch {} }
      else photos.push(`/uploads/${f2}`);
    }

    const daysAgo = (CURATED.length - i) * 0.35 + Math.random() * 2;
    const createdAt = new Date(now - daysAgo * 24 * 60 * 60 * 1000);

    items.push({
      id, photos, type: cfg.type, color: cfg.color, brand: cfg.brand, size: cfg.size,
      style: cfg.style, condition: cfg.condition, material: cfg.material, price: cfg.price,
      description: cfg.desc,
      store: STORES.find(s => s.id === cfg.storeId),
      carbonSavings: CARBON[cfg.type] || DEFAULT_CARBON,
      favorites: Math.floor(Math.random() * 15),
      status: "available",
      createdAt: createdAt.toISOString(),
      updatedAt: createdAt.toISOString(),
    });
  }

  fs.writeFileSync(path.join(ROOT, 'data/items.json'), JSON.stringify(items, null, 2));
  console.log(`\nWrote ${items.length} items`);
  for (const store of STORES) {
    const storeItems = items.filter(i => i.store.id === store.id);
    const types = {};
    storeItems.forEach(i => { types[i.type] = (types[i.type] || 0) + 1; });
    console.log(`  ${store.name} (${storeItems.length}):`, JSON.stringify(types));
  }
  const allTypes = {};
  items.forEach(i => { allTypes[i.type] = (allTypes[i.type] || 0) + 1; });
  console.log('\nTotal by type:', JSON.stringify(allTypes));
}

main().catch(console.error);
