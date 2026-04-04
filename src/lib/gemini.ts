import { GoogleGenerativeAI } from "@google/generative-ai";
import { GeminiExtractionResult } from "./types";

const SYSTEM_PROMPT = `You are a secondhand inventory assistant. Analyze the item in this photo and extract structured data. The item may be clothing, furniture, electronics, home goods, or any other secondhand item.

Return ONLY a JSON object with these fields:
- type: string (one of: "shirt", "t-shirt", "top", "blouse", "pants", "jeans", "dress", "jacket", "coat", "sweater", "hoodie", "shoes", "boots", "skirt", "shorts", "accessories", "bag", "furniture", "electronics", "home")
- color: string[] (specific colors, e.g. ["navy", "white"] not ["blue"])
- brand: string (brand name if visible on tags/logos/labels, otherwise "Unknown")
- size: string (from tag if visible: "XS", "S", "M", "L", "XL", "XXL", or numeric like "32" for waist. For furniture use dimensions if visible, e.g. "36x24". For electronics use model info. If not visible: "Not visible")
- style: string[] (2-3 tags from: "casual", "vintage", "streetwear", "formal", "boho", "preppy", "athletic", "minimal", "classic", "punk", "feminine", "rugged", "workwear", "outdoor", "mid-century", "modern", "industrial", "rustic", "retro")
- condition: string (one of: "excellent", "good", "fair" based on visible wear, scratches, stains, damage)
- material: string (if identifiable: "cotton", "denim", "polyester", "wool", "silk", "leather", "linen", "wood", "metal", "plastic", "glass", "ceramic", etc. Otherwise: "Unknown")
- description: string (1-2 sentence description noting visible features, brand markings, condition, and any identifying details from tags or labels)
- suggestedPrice: number (secondhand price in USD based on brand, condition, type, and typical resale value)

Return ONLY valid JSON — no markdown, no explanation.`;

export async function extractItemData(
  imageBase64: string,
  mimeType: string
): Promise<GeminiExtractionResult> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "your_api_key_here") {
    throw new Error("GEMINI_API_KEY not configured");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const result = await model.generateContent([
    SYSTEM_PROMPT,
    {
      inlineData: {
        data: imageBase64,
        mimeType,
      },
    },
  ]);

  const text = result.response.text();
  // Strip markdown code fences if present
  const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
  return JSON.parse(cleaned);
}
