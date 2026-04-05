export interface Store {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
}

export interface CarbonSavings {
  co2Kg: number;
  waterLiters: number;
  shippingCo2Kg: number;
}

export interface Item {
  id: string;
  photos: string[];
  type: string;
  color: string[];
  brand: string;
  size: string;
  style: string[];
  condition: "excellent" | "good" | "fair";
  material: string;
  price: number;
  description: string;
  store: Store;
  carbonSavings: CarbonSavings;
  favorites: number;
  status: "available" | "sold";
  createdAt: string;
  updatedAt: string;
  distance?: number;
}

export interface GeminiExtractionResult {
  type: string;
  color: string[];
  brand: string;
  size: string;
  style: string[];
  condition: "excellent" | "good" | "fair";
  material: string;
  description: string;
  suggestedPrice: number;
}
