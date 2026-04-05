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

// ── Curated items: heavy on clothes, Habitat gets home goods ──
// Descriptions follow Gemini voice: factual, observational, lead with color+type, note condition.
const CURATED = [
  // ═══════════ JACKETS & COATS ═══════════
  { title: /orvis.*fleece.*jacket/i, type: 'jacket', brand: 'Orvis', size: 'M', color: ['blue'], style: ['casual', 'outdoor'], condition: 'good', material: 'polyester fleece', price: 9.99, storeId: 'store-2',
    desc: 'Blue full-zip fleece jacket by Orvis. Polyester construction with standing collar and two zippered side pockets. Light pilling on cuffs and hem, otherwise clean. Size M on interior tag.' },
  { title: /columbia.*jacket/i, type: 'jacket', brand: 'Columbia', size: 'M', color: ['gray'], style: ['lightweight', 'windbreaker'], condition: 'good', material: 'nylon', price: 7.99, storeId: 'store-3',
    desc: 'Gray lightweight nylon wind jacket by Columbia. Packable design with elastic cuffs and adjustable hem. Minor fading at shoulders. Columbia logo on left chest. Size M.' },
  { title: /vintage roundtree.*camel hair/i, type: 'jacket', brand: 'Roundtree & Yorke', size: 'L', color: ['tan', 'brown'], style: ['blazer', 'vintage'], condition: 'good', material: 'camel hair', price: 14.99, storeId: 'store-2',
    desc: 'Tan two-button sport coat by Roundtree & Yorke. 100% camel hair construction with notch lapels and interior breast pocket. Some wear on elbow patches. Interior label reads size L.' },
  { title: /north face.*medium fleece.*hazen/i, type: 'jacket', brand: 'The North Face', size: 'M', color: ['black'], style: ['fleece', 'casual'], condition: 'good', material: 'polyester fleece', price: 7.55, storeId: 'store-2',
    desc: 'Black full-zip fleece jacket by The North Face, Hazen model. Polyester fleece with zippered hand pockets. Light wear consistent with regular use, no holes or stains. Size M.' },
  { title: /royal matrix.*denim jacket.*medium/i, type: 'jacket', brand: 'Royal Matrix', size: 'M', color: ['green'], style: ['denim', 'casual'], condition: 'excellent', material: 'denim', price: 21.99, storeId: 'store-3',
    desc: 'Green denim jacket by Royal Matrix. Button-front closure with chest flap pockets. Original tags still attached, unworn. Size M.' },
  { title: /north face zip up.*small$/i, type: 'jacket', brand: 'The North Face', size: 'S', color: ['gray'], style: ['zip-up'], condition: 'good', material: 'polyester', price: 12.99, storeId: 'store-4',
    desc: 'Heathered gray zip-up jacket by The North Face. Lightweight polyester shell with fleece-lined interior. Minor pilling near zipper pull. Size S on tag.' },
  { title: /wild fable cropped denim/i, type: 'jacket', brand: 'Wild Fable', size: 'XS', color: ['blue'], style: ['cropped', 'denim'], condition: 'good', material: 'denim', price: 8.99, storeId: 'store-4',
    desc: 'Light blue cropped denim jacket by Wild Fable. Raw hem finish at waist, button-front closure. Slight fading at seams. Size XS on interior label.' },
  { title: /zara.*faux suede.*jacket/i, type: 'jacket', brand: 'Zara', size: 'XS', color: ['tan', 'brown'], style: ['suede', 'cropped'], condition: 'good', material: 'faux suede', price: 14.99, storeId: 'store-2',
    desc: 'Tan faux suede cropped jacket by Zara. Snap-button front closure with two front pockets. Soft hand feel, no visible wear. Size XS.' },
  { title: /nautica khaki.*jacket/i, type: 'jacket', brand: 'Nautica', size: 'XL', color: ['khaki', 'tan'], style: ['zip-up'], condition: 'good', material: 'cotton blend', price: 9.99, storeId: 'store-3',
    desc: 'Khaki zip-up jacket by Nautica. Cotton blend with ribbed cuffs and hem. Nautica logo embroidered on chest. Clean, no stains. Size XL.' },
  { title: /H Florence.*leather coat/i, type: 'jacket', brand: 'H Florence', size: 'L', color: ['black'], style: ['leather', 'coat'], condition: 'good', material: 'leather', price: 24.99, storeId: 'store-2',
    desc: 'Black leather coat by H Florence House of Leather. Genuine leather with full lining, button-front closure. Minor creasing at elbows consistent with wear. Size 42 (EU), approximately L.' },
  { title: /north face.*women.*black.*fleece/i, type: 'jacket', brand: 'The North Face', size: 'M', color: ['black'], style: ['fleece', 'zip-up'], condition: 'good', material: 'polyester fleece', price: 11.99, storeId: 'store-3',
    desc: 'Black full-zip fleece jacket by The North Face, women\'s cut. Polyester fleece with two hand pockets. Minor pilling on front panel. Size M.' },
  { title: /north face women.*polartec/i, type: 'jacket', brand: 'The North Face', size: 'M', color: ['gray'], style: ['fleece', 'polartec'], condition: 'good', material: 'Polartec fleece', price: 14.99, storeId: 'store-4',
    desc: 'Gray lightweight fleece jacket by The North Face, Polartec fabric. Women\'s cut with quarter-zip and chin guard. Clean, minimal wear. Size M on tag.' },
  { title: /weatherproof garment.*jacket/i, type: 'jacket', brand: 'Weatherproof', size: 'XL', color: ['black'], style: ['casual'], condition: 'good', material: 'polyester', price: 8.99, storeId: 'store-4',
    desc: 'Black women\'s jacket by Weatherproof Garment Company. Polyester shell with light insulation. Full zip with snap-over flap. Clean condition. Size XL.' },
  { title: /gap longline.*jacket/i, type: 'jacket', brand: 'Gap', size: 'M', color: ['navy'], style: ['longline', 'button-up'], condition: 'good', material: 'cotton blend', price: 10.99, storeId: 'store-3',
    desc: 'Navy longline button-up jacket by Gap. Cotton blend construction with a longer cut below hip. Four-button front. Slight fading at shoulders. Women\'s size M.' },
  { title: /karen scott.*corduroy jacket/i, type: 'jacket', brand: 'Karen Scott', size: 'L', color: ['brown'], style: ['corduroy', 'zip-up'], condition: 'good', material: 'corduroy', price: 7.99, storeId: 'store-4',
    desc: 'Brown corduroy zip-up jacket by Karen Scott Sport. Wide-wale corduroy with two front pockets. Clean, no wear on ridges. Women\'s size L.' },
  { title: /hummel.*jacket/i, type: 'jacket', brand: 'Hummel', size: 'L', color: ['black', 'white'], style: ['track', 'sporty'], condition: 'good', material: 'polyester', price: 9.99, storeId: 'store-3',
    desc: 'Black and white full-zip track jacket by Hummel. Polyester with contrast chevron detailing on sleeves. Hummel logo on chest. No stains or damage. Size L.' },
  { title: /pebble beach.*jacket/i, type: 'jacket', brand: 'Pebble Beach', size: 'XXL', color: ['navy'], style: ['performance', 'golf'], condition: 'good', material: 'polyester', price: 8.99, storeId: 'store-4',
    desc: 'Navy performance zip-up jacket by Pebble Beach. Moisture-wicking polyester with mesh-lined interior. Small Pebble Beach crest on chest. Clean. Size XXL.' },

  // ═══════════ SHIRTS & TOPS ═══════════
  { title: /tommy bahama.*silk/i, type: 'shirt', brand: 'Tommy Bahama', size: 'L', color: ['multicolor'], style: ['tropical', 'dress'], condition: 'good', material: '100% silk', price: 12.99, storeId: 'store-2',
    desc: 'Multicolor tropical print dress shirt by Tommy Bahama. 100% silk construction with coconut shell buttons. Care tag confirms dry clean only. Light wear, no pulls in silk. Size L.' },
  { title: /lululemon to the point tee/i, type: 'shirt', brand: 'Lululemon', size: '4', color: ['black'], style: ['athletic', 'minimal'], condition: 'good', material: 'technical fabric', price: 14.99, storeId: 'store-2',
    desc: 'Black short-sleeve tee by Lululemon, To The Point style. Technical fabric with a smooth hand feel. Lululemon logo at rear hem. No pilling or wear. Size 4.' },
  { title: /melrose place henley/i, type: 'shirt', brand: 'Melrose Place', size: 'M', color: ['green'], style: ['henley', 'casual'], condition: 'excellent', material: 'cotton', price: 6.99, storeId: 'store-4',
    desc: 'Mint green henley shirt by Melrose Place. Cotton construction with three-button placket. Appears unworn, tags removed. Size M.' },
  { title: /halogen.*black blouse/i, type: 'blouse', brand: 'Halogen', size: 'S', color: ['black'], style: ['pleated', 'dressy'], condition: 'good', material: 'polyester blend', price: 8.99, storeId: 'store-3',
    desc: 'Black pleated blouse by Halogen. Polyester blend with flowy drape and pintuck detail at front. No snags or discoloration. Size S on tag.' },
  { title: /adidas climacool.*pullover/i, type: 'shirt', brand: 'Adidas', size: 'XL', color: ['gray'], style: ['athletic', 'golf'], condition: 'good', material: 'polyester', price: 11.99, storeId: 'store-3',
    desc: 'Gray half-zip pullover by Adidas, Climacool line. Lightweight polyester with mesh ventilation panels under arms. Adidas logo on right chest. Minor pilling at collar. Size XL.' },
  { title: /goodfellow.*polo/i, type: 'shirt', brand: 'Goodfellow', size: 'L', color: ['blue'], style: ['polo', 'casual'], condition: 'good', material: 'cotton blend', price: 4.99, storeId: 'store-4',
    desc: 'Blue polo shirt by Goodfellow & Co. Cotton blend pique knit with two-button placket. Slight fading from washing, otherwise clean. Size L.' },
  { title: /fintech sun defender.*medium.*navy/i, type: 'shirt', brand: 'Fintech', size: 'M', color: ['navy'], style: ['athletic', 'UPF'], condition: 'excellent', material: 'polyester', price: 7.99, storeId: 'store-3',
    desc: 'Navy short-sleeve UV protection shirt by Fintech, Sun Defender line. UPF 50+ rated polyester. Tags still attached, unworn. Size M.' },
  { title: /stockh.*jersey blazer/i, type: 'shirt', brand: 'Stockh LM', size: 'S', color: ['navy'], style: ['blazer', 'jersey'], condition: 'good', material: 'jersey knit', price: 12.99, storeId: 'store-2',
    desc: 'Navy jersey blazer by Stockh LM, Petra model. Stretch jersey knit with single-button closure and two flap pockets. Clean, structured shoulders. Women\'s size 38 (S).' },
  { title: /men.*antigua.*polo/i, type: 'shirt', brand: 'Antigua', size: 'L', color: ['red'], style: ['polo', 'golf'], condition: 'good', material: 'polyester', price: 6.99, storeId: 'store-3',
    desc: 'Red polo shirt by Antigua, Dri-Fit performance fabric. Polyester with moisture-wicking finish. Encantera Arizona embroidery on chest. No stains. Size L.' },
  { title: /women.*antigua.*polo/i, type: 'shirt', brand: 'Antigua', size: 'M', color: ['red'], style: ['polo', 'golf'], condition: 'good', material: 'polyester', price: 6.99, storeId: 'store-4',
    desc: 'Red women\'s polo shirt by Antigua, Dri-Fit fabric. Polyester with V-neck collar. Encantera Arizona embroidery on chest. Clean condition. Size M.' },
  { title: /sincerely jules.*crop turtle/i, type: 'shirt', brand: 'Sincerely Jules', size: 'S', color: ['cream'], style: ['crop', 'turtleneck'], condition: 'good', material: 'knit', price: 8.99, storeId: 'store-2',
    desc: 'Cream cropped turtleneck by Sincerely Jules. Ribbed knit construction with a fitted crop cut. No staining or pilling. Size S.' },
  { title: /fintech.*longsleeve.*small/i, type: 'shirt', brand: 'Fintech', size: 'S', color: ['blue'], style: ['athletic', 'UPF'], condition: 'excellent', material: 'polyester', price: 6.99, storeId: 'store-4',
    desc: 'Blue long-sleeve UV protection shirt by Fintech, Sun Defender line. UPF 50+ polyester with thumbhole cuffs. Tags still attached. Size S.' },
  { title: /nike pro.*leggings/i, type: 'pants', brand: 'Nike', size: 'XS', color: ['black'], style: ['leggings', 'athletic'], condition: 'good', material: 'nylon/spandex', price: 9.99, storeId: 'store-2',
    desc: 'Black compression leggings by Nike Pro. Nylon/spandex blend with wide waistband and Nike swoosh at left leg. Light pilling at inner thigh. Size XS.' },

  // ═══════════ SWEATERS & CARDIGANS & HOODIES ═══════════
  { title: /wren.*rowe.*cardigan.*medium/i, type: 'sweater', brand: 'Wren + Rowe', size: 'M', color: ['gray'], style: ['cardigan', 'open-front'], condition: 'excellent', material: 'knit blend', price: 15.56, storeId: 'store-2',
    desc: 'Gray open-front drape cardigan by Wren + Rowe. Lightweight knit blend with cascading front panels. No pilling or wear. Size M.' },
  { title: /tommy hilfiger.*pullover.*women/i, type: 'sweater', brand: 'Tommy Hilfiger', size: 'M', color: ['navy'], style: ['pullover', 'zip-neck'], condition: 'good', material: 'cotton blend', price: 11.99, storeId: 'store-3',
    desc: 'Navy zip-neck pullover sweatshirt by Tommy Hilfiger. Cotton blend with ribbed cuffs and hem. Tommy flag logo at chest. Minor wash wear. Women\'s size M.' },
  { title: /loft teddy.*cardigan/i, type: 'sweater', brand: 'LOFT', size: 'L', color: ['navy'], style: ['teddy', 'open-front'], condition: 'good', material: 'polyester sherpa', price: 10.99, storeId: 'store-4',
    desc: 'Navy open-front cardigan by LOFT. Teddy-textured polyester sherpa with side pockets. Some compression in sherpa pile from wear. Size L.' },
  { title: /eddie bauer cardigan hoodie/i, type: 'sweater', brand: 'Eddie Bauer', size: 'M', color: ['gray'], style: ['hoodie', 'cardigan'], condition: 'good', material: 'cotton blend', price: 9.99, storeId: 'store-3',
    desc: 'Gray cardigan hoodie by Eddie Bauer. Cotton blend with full zip and attached hood. Eddie Bauer logo at left chest. Minor fading from washing. Women\'s size M.' },
  { title: /nation ltd.*cardigan/i, type: 'sweater', brand: 'Nation Ltd.', size: 'S', color: ['cream'], style: ['ruffle', 'cardigan'], condition: 'good', material: 'cotton/alpaca blend', price: 16.99, storeId: 'store-2',
    desc: 'Cream ruffle-front cardigan by Nation Ltd. Cotton and alpaca blend with a soft hand feel and ruffled front edge. Clean, no pilling. Size S.' },
  { title: /nautica half zip pullover/i, type: 'sweater', brand: 'Nautica', size: 'S', color: ['navy'], style: ['half-zip', 'pullover'], condition: 'good', material: 'cotton blend', price: 8.99, storeId: 'store-3',
    desc: 'Navy half-zip pullover by Nautica. Cotton blend with ribbed collar and Nautica logo embroidered at chest. Light wear at cuffs. Men\'s size S.' },
  { title: /shambhala cardigan/i, type: 'sweater', brand: 'Shambhala', size: 'M', color: ['gray'], style: ['cardigan', 'casual'], condition: 'good', material: 'cotton blend', price: 7.99, storeId: 'store-4',
    desc: 'Light grey heather cardigan by Shambhala. Cotton blend open-front construction with patch pockets. Slight pilling at underarms. Women\'s size M.' },
  { title: /fever black.*cardigan/i, type: 'sweater', brand: 'Fever', size: 'XL', color: ['black'], style: ['open-front', 'cardigan'], condition: 'good', material: 'knit', price: 6.99, storeId: 'store-4',
    desc: 'Black open-front cardigan by Fever. Lightweight knit with long sleeves and ribbed trim. No holes or staining. Women\'s size XL.' },
  { title: /sleefs.*hoodie/i, type: 'sweater', brand: 'Sleefs', size: 'L', color: ['multicolor'], style: ['hoodie', 'active'], condition: 'good', material: 'polyester blend', price: 12.99, storeId: 'store-3',
    desc: 'Multicolor graphic hoodie by Sleefs, Juice print. Polyester blend with kangaroo pocket and drawstring hood. Vibrant print with no cracking. Size L.' },
  { title: /greg norman.*sweatshirt/i, type: 'sweater', brand: 'Greg Norman', size: 'XXL', color: ['gray'], style: ['zip-up', 'golf'], condition: 'good', material: 'polyester', price: 8.99, storeId: 'store-3',
    desc: 'Gray full-zip sweatshirt by Greg Norman. Polyester with soft brushed interior and two side pockets. Greg Norman shark logo on left chest. Clean. Men\'s size XXL.' },
  { title: /Y\.D\. Zhuliu hoodie/i, type: 'sweater', brand: 'Y.D. Zhuliu', size: 'XL', color: ['gray'], style: ['hoodie', 'graphic'], condition: 'good', material: 'cotton blend', price: 7.99, storeId: 'store-4',
    desc: 'Gray pullover hoodie by Y.D. Zhuliu. Cotton blend with "Pursue Every Perfect Detail" graphic on front. Drawstring hood, kangaroo pocket. Light wash wear. Size XL.' },
  { title: /l\.l\. be.*sweatshirt/i, type: 'sweater', brand: 'L.L. Bean', size: 'L', color: ['blue'], style: ['sweatshirt', 'casual'], condition: 'good', material: 'cotton', price: 9.99, storeId: 'store-3',
    desc: 'Blue crewneck sweatshirt by L.L. Bean. Heavyweight cotton construction with ribbed cuffs and hem. Minor fading consistent with washing. Women\'s size L.' },

  // ═══════════ JEANS ═══════════
  { title: /anthropologie.*jeans.*29/i, type: 'jeans', brand: 'Maeve by Anthropologie', size: '29', color: ['blue'], style: ['wide-leg', 'flare'], condition: 'good', material: 'denim', price: 9.99, storeId: 'store-2',
    desc: 'Blue wide-leg flare jeans by Maeve (Anthropologie). Medium wash denim with high-rise waist and flared leg opening. Light whiskering at front. Size 29.' },
  { title: /levi strauss wedgie skinny/i, type: 'jeans', brand: "Levi's", size: '30', color: ['blue'], style: ['skinny', 'wedgie'], condition: 'good', material: 'denim', price: 11.99, storeId: 'store-3',
    desc: "Blue skinny jeans by Levi's, Wedgie fit. High-rise with button fly and tapered leg. Minor fading at knees and thighs from wear. Women's W30 L26." },
  { title: /forever 21 jeans.*26/i, type: 'jeans', brand: 'Forever 21', size: '26', color: ['blue'], style: ['skinny'], condition: 'good', material: 'denim', price: 5.99, storeId: 'store-4',
    desc: 'Dark blue skinny jeans by Forever 21. Stretch denim with five-pocket styling. Slight fading at thighs. Size 26.' },
  { title: /joe.s jeans.*33/i, type: 'jeans', brand: "Joe's Jeans", size: '33', color: ['blue'], style: ['straight-leg'], condition: 'good', material: 'premium denim', price: 14.99, storeId: 'store-2',
    desc: "Dark wash straight-leg jeans by Joe's Jeans. Premium denim with slight stretch. Leather brand patch at back waistband. Light wear at hem. Men's size 33." },
  { title: /switch remarkable jeans/i, type: 'jeans', brand: 'Switch', size: '36/34', color: ['black'], style: ['splatter', 'streetwear'], condition: 'good', material: 'denim', price: 9.99, storeId: 'store-4',
    desc: 'Black denim jeans by Switch, Remarkable line. Bleach splatter detail throughout legs. Straight-leg cut with five-pocket styling. Size 36W 34L.' },
  { title: /skinny jeans.*mellow denim/i, type: 'jeans', brand: 'Mellow Denim', size: '7 (Juniors)', color: ['blue'], style: ['skinny', 'clean'], condition: 'excellent', material: 'denim', price: 7.99, storeId: 'store-4',
    desc: 'Blue non-distressed skinny jeans by Mellow Denim. Clean dark wash with no whiskering. Tags still attached, unworn. Juniors size 7.' },
  { title: /jean shorts parker jeans/i, type: 'jeans', brand: 'Parker', size: '32', color: ['blue'], style: ['shorts', 'denim'], condition: 'good', material: 'denim', price: 6.99, storeId: 'store-3',
    desc: 'Blue denim shorts by Parker Jeans. Medium wash with frayed hem. Five-pocket styling. Light fading at front. Size 32.' },

  // ═══════════ PANTS & SHORTS ═══════════
  { title: /selected homme.*pants.*34/i, type: 'pants', brand: 'Selected Homme', size: '34/32', color: ['gray', 'black'], style: ['straight-leg', 'two-tone'], condition: 'good', material: 'cotton blend', price: 9.99, storeId: 'store-2',
    desc: 'Gray and black two-toned straight-leg pants by Selected Homme. Cotton blend with flat front and slash pockets. Clean, no wear marks. Size 34/32.' },
  { title: /gap casual shorts.*31/i, type: 'shorts', brand: 'Gap', size: '31', color: ['blue', 'white'], style: ['pinstripe', 'casual'], condition: 'good', material: 'cotton', price: 5.99, storeId: 'store-4',
    desc: 'Blue and white pinstripe casual shorts by Gap. Cotton with flat front and side pockets. Clean, minimal wear. Men\'s size 31.' },
  { title: /h.m.*distressed shorts.*32/i, type: 'shorts', brand: 'H&M', size: '32', color: ['blue'], style: ['distressed', 'denim'], condition: 'good', material: 'denim', price: 6.99, storeId: 'store-4',
    desc: 'Blue distressed denim shorts by H&M (&Denim line). Intentional ripping at front thigh area. Frayed hem. Size 32.' },
  { title: /izod.*golf shorts/i, type: 'shorts', brand: 'Izod', size: '8', color: ['plaid'], style: ['golf', 'stretch'], condition: 'excellent', material: 'polyester blend', price: 7.99, storeId: 'store-3',
    desc: 'Plaid golf shorts by Izod XFG Cool FX. Lightweight polyester blend with stretch. Tags still attached, unworn. Women\'s size 8.' },
  { title: /chaps.*31.*shorts/i, type: 'shorts', brand: 'Chaps', size: '31', color: ['khaki'], style: ['casual', 'classic'], condition: 'good', material: 'cotton', price: 5.99, storeId: 'store-3',
    desc: 'Khaki casual shorts by Chaps. Cotton twill with flat front and two back pockets. Clean, minor creasing from storage. Men\'s size 31.' },

  // ═══════════ DRESS ═══════════
  { title: /karl lagerfeld.*black lace dress/i, type: 'dress', brand: 'Karl Lagerfeld', size: '4', color: ['black'], style: ['lace', 'cocktail'], condition: 'good', material: 'lace/polyester', price: 19.99, storeId: 'store-2',
    desc: 'Black lace cocktail dress by Karl Lagerfeld. Polyester lace overlay with solid lining. Rear zip closure. Minor loose thread at hem, otherwise clean. Size 4.' },

  // ═══════════ SHOES (3 only) ═══════════
  { title: /birkenstock gizeh/i, type: 'shoes', brand: 'Birkenstock', size: 'Various', color: ['brown'], style: ['sandals'], condition: 'excellent', material: 'leather, cork', price: 78.00, storeId: 'store-1',
    desc: 'Brown leather thong sandals by Birkenstock, Gizeh model. Cork and latex footbed with suede lining. New in original box, unworn. Multiple sizes available.' },
  { title: /birkenstock arizona/i, type: 'shoes', brand: 'Birkenstock', size: 'Various', color: ['brown'], style: ['sandals'], condition: 'excellent', material: 'leather, cork', price: 75.00, storeId: 'store-1',
    desc: 'Brown two-strap sandals by Birkenstock, Arizona model. Oiled leather upper with adjustable buckle straps and contoured cork footbed. New in box.' },
  { title: /alexandre birman.*clarita/i, type: 'shoes', brand: 'Alexandre Birman', size: '38 EU', color: ['tan'], style: ['sandals', 'designer'], condition: 'good', material: 'braided leather', price: 19.99, storeId: 'store-2',
    desc: 'Tan braided leather flat sandals by Alexandre Birman, Clarita model. Italian-made with signature ankle tie detail. Sole shows light wear. Size 38 EU.' },

  // ═══════════ BAG ═══════════
  { title: /michael kors handbag/i, type: 'bag', brand: 'Michael Kors', size: 'One Size', color: ['red'], style: ['quilted', 'designer'], condition: 'good', material: 'quilted leather', price: 19.99, storeId: 'store-2',
    desc: 'Red quilted handbag by Michael Kors. Quilted leather construction with gold-tone hardware and MK logo charm. Interior zippered pocket. Light scuffing at bottom corners. Approximately 10" x 7" x 3".' },

  // ═══════════ HOME & ELECTRONICS (3 only) — Habitat ReStore ═══════════
  { title: /apple tv.*3rd/i, type: 'electronics', brand: 'Apple', size: 'One Size', color: ['black'], style: ['streaming'], condition: 'fair', material: 'aluminum', price: 9.99, storeId: 'store-1',
    desc: 'Black Apple TV, 3rd generation (model A1427). Aluminum housing with HDMI and optical audio output. Power cable included. Minor scratching on top surface. No remote.' },
  { title: /google nest thermostat trim/i, type: 'electronics', brand: 'Google', size: 'One Size', color: ['white'], style: ['smart home'], condition: 'excellent', material: 'plastic', price: 11.99, storeId: 'store-1',
    desc: 'White thermostat trim kit by Google Nest (model GA01837-US, Snow color). Factory sealed in original packaging. Compatible with Nest Thermostat.' },
  { title: /handcrafted blue swirl glass vase/i, type: 'home', brand: 'Teppie (Handcrafted)', size: 'One Size', color: ['blue', 'white'], style: ['vase', 'art glass'], condition: 'good', material: 'dichroic glass', price: 24.89, storeId: 'store-1',
    desc: 'Blue and white swirl glass vase with dichroic accents, signed by Teppie (2010). Handblown art glass, approximately 8 inches tall. No chips or cracks.' },

  // ═══════════ MORE CLOTHES ═══════════
  { title: /royal matrix.*denim jacket.*xs/i, type: 'jacket', brand: 'Royal Matrix', size: 'XS', color: ['green'], style: ['denim'], condition: 'excellent', material: 'denim', price: 19.99, storeId: 'store-4',
    desc: 'Green denim jacket by Royal Matrix. Button-front closure with chest pockets. Original tags still attached, unworn. Women\'s size XS.' },
  { title: /even tide.*swim shorts/i, type: 'shorts', brand: 'Even Tide', size: '40', color: ['blue'], style: ['swim', 'casual'], condition: 'good', material: 'polyester', price: 5.99, storeId: 'store-4',
    desc: 'Blue swim trunks by Even Tide. Polyester with mesh liner and elastic drawstring waist. No fading or damage. Men\'s size 40.' },
  { title: /levi.*511.*boys.*16/i, type: 'jeans', brand: "Levi's", size: '16 (28x28)', color: ['blue'], style: ['slim', '511'], condition: 'good', material: 'denim', price: 6.99, storeId: 'store-4',
    desc: "Blue slim-fit jeans by Levi's, 511 model. Classic five-pocket denim with slight stretch. Light fading at knees. Size 16 Regular (28x28)." },
  { title: /mad pelican.*shorts.*medium/i, type: 'shorts', brand: 'Mad Pelican', size: 'M', color: ['blue'], style: ['walking', 'casual'], condition: 'good', material: 'polyester blend', price: 6.99, storeId: 'store-3',
    desc: 'Aruba blue walking shorts by Mad Pelican. Lightweight polyester blend with elastic waistband and side pockets. Clean, no stains. Size M.' },
  { title: /wren.*rowe.*cardigan.*large/i, type: 'sweater', brand: 'Wren + Rowe', size: 'L', color: ['gray'], style: ['cardigan', 'open-front'], condition: 'excellent', material: 'knit blend', price: 15.56, storeId: 'store-3',
    desc: 'Gray open-front drape cardigan by Wren + Rowe. Lightweight knit blend with cascading front panels. No pilling or wear. Size L.' },
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
