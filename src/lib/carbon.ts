// Manufacturing footprint avoided by buying secondhand instead of new.
//
// Methodology: Each number represents the full lifecycle emissions (raw material
// extraction → manufacturing → transport) of producing ONE new item. When a
// consumer buys secondhand, that entire footprint is avoided because no new
// item needs to be manufactured to replace it.
//
// Sources (apparel only; home goods use a qualitative "diverted from landfill" message):
//   - Jeans 33.4 kg CO₂: Levi Strauss lifecycle assessment (2019)
//   - T-shirt 2,700 L water: Water Footprint Network & WWF cotton report
//   - General apparel: WRAP UK "Valuing Our Clothes" (2017), ThredUp Resale Report (2023)
//   - Shoes: MIT Materials Systems Lab

// shippingCo2Kg: average last-mile delivery emissions avoided by buying locally
// instead of ordering new online. Based on UPS/FedEx lifecycle data scaled by
// typical package weight. Heavier items (furniture, electronics) include freight.

const CARBON_TABLE: Record<string, { co2Kg: number; waterLiters: number; shippingCo2Kg: number }> = {
  shirt:       { co2Kg: 6.5,  waterLiters: 2700,  shippingCo2Kg: 0.8 },
  "t-shirt":   { co2Kg: 6.5,  waterLiters: 2700,  shippingCo2Kg: 0.8 },
  top:         { co2Kg: 6.5,  waterLiters: 2700,  shippingCo2Kg: 0.8 },
  blouse:      { co2Kg: 8.0,  waterLiters: 3000,  shippingCo2Kg: 0.8 },
  pants:       { co2Kg: 12.0, waterLiters: 3800,  shippingCo2Kg: 1.0 },
  jeans:       { co2Kg: 33.4, waterLiters: 10000, shippingCo2Kg: 1.2 },
  dress:       { co2Kg: 22.0, waterLiters: 8000,  shippingCo2Kg: 1.0 },
  jacket:      { co2Kg: 35.0, waterLiters: 12000, shippingCo2Kg: 1.5 },
  coat:        { co2Kg: 35.0, waterLiters: 12000, shippingCo2Kg: 2.0 },
  sweater:     { co2Kg: 12.0, waterLiters: 5000,  shippingCo2Kg: 1.0 },
  hoodie:      { co2Kg: 12.0, waterLiters: 5000,  shippingCo2Kg: 1.0 },
  shoes:       { co2Kg: 14.0, waterLiters: 4500,  shippingCo2Kg: 1.8 },
  boots:       { co2Kg: 14.0, waterLiters: 4500,  shippingCo2Kg: 2.2 },
  skirt:       { co2Kg: 11.0, waterLiters: 4000,  shippingCo2Kg: 0.8 },
  shorts:      { co2Kg: 8.0,  waterLiters: 3000,  shippingCo2Kg: 0.8 },
  accessories: { co2Kg: 3.0,  waterLiters: 1000,  shippingCo2Kg: 0.5 },
  bag:         { co2Kg: 10.0, waterLiters: 3500,  shippingCo2Kg: 1.2 },
  furniture:   { co2Kg: 80.0, waterLiters: 20000, shippingCo2Kg: 25.0 },
  electronics: { co2Kg: 50.0, waterLiters: 15000, shippingCo2Kg: 5.0 },
  home:        { co2Kg: 15.0, waterLiters: 5000,  shippingCo2Kg: 3.0 },
};

const DEFAULT = { co2Kg: 10.0, waterLiters: 3500, shippingCo2Kg: 1.5 };

export function getCarbonSavings(itemType: string) {
  const key = itemType.toLowerCase();
  return CARBON_TABLE[key] ?? DEFAULT;
}
