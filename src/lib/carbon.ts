// Manufacturing footprint avoided by buying secondhand instead of new.
//
// Methodology: Each number represents the full lifecycle emissions (raw material
// extraction → manufacturing → transport) of producing ONE new item. When a
// consumer buys secondhand, that entire footprint is avoided because no new
// item needs to be manufactured to replace it.
//
// Sources (apparel only — home goods use a qualitative "diverted from landfill" message):
//   - Jeans 33.4 kg CO₂: Levi Strauss lifecycle assessment (2019)
//   - T-shirt 2,700 L water: Water Footprint Network & WWF cotton report
//   - General apparel: WRAP UK "Valuing Our Clothes" (2017), ThredUp Resale Report (2023)
//   - Shoes: MIT Materials Systems Lab

const CARBON_TABLE: Record<string, { co2Kg: number; waterLiters: number }> = {
  shirt:       { co2Kg: 6.5,  waterLiters: 2700 },
  "t-shirt":   { co2Kg: 6.5,  waterLiters: 2700 },
  top:         { co2Kg: 6.5,  waterLiters: 2700 },
  blouse:      { co2Kg: 8.0,  waterLiters: 3000 },
  pants:       { co2Kg: 12.0, waterLiters: 3800 },
  jeans:       { co2Kg: 33.4, waterLiters: 10000 },
  dress:       { co2Kg: 22.0, waterLiters: 8000 },
  jacket:      { co2Kg: 35.0, waterLiters: 12000 },
  coat:        { co2Kg: 35.0, waterLiters: 12000 },
  sweater:     { co2Kg: 12.0, waterLiters: 5000 },
  hoodie:      { co2Kg: 12.0, waterLiters: 5000 },
  shoes:       { co2Kg: 14.0, waterLiters: 4500 },
  boots:       { co2Kg: 14.0, waterLiters: 4500 },
  skirt:       { co2Kg: 11.0, waterLiters: 4000 },
  shorts:      { co2Kg: 8.0,  waterLiters: 3000 },
  accessories: { co2Kg: 3.0,  waterLiters: 1000 },
  bag:         { co2Kg: 10.0, waterLiters: 3500 },
};

const DEFAULT = { co2Kg: 10.0, waterLiters: 3500 };

export function getCarbonSavings(itemType: string) {
  const key = itemType.toLowerCase();
  return CARBON_TABLE[key] ?? DEFAULT;
}
