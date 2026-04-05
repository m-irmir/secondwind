import { GoogleGenerativeAI } from "@google/generative-ai";
import { GeminiExtractionResult } from "./types";

const SYSTEM_PROMPT = `You are a secondhand inventory assistant. You will receive one or more photos of an item. The first photo shows the item itself. Additional photos (if any) show tags, labels, or care instructions.

Analyze ALL provided photos together to extract structured data. The item may be clothing, furniture, electronics, home goods, or any other secondhand item.

Return ONLY a JSON object with these fields:
- type: string (one of: "shirt", "t-shirt", "top", "blouse", "pants", "jeans", "dress", "jacket", "coat", "sweater", "hoodie", "shoes", "boots", "skirt", "shorts", "accessories", "bag", "furniture", "electronics", "home")
- color: string[] (specific colors, e.g. ["navy", "white"] not ["blue"])
- brand: string (brand name if visible on tags/logos/labels, otherwise "Unknown")
- size: string (from tag if visible: "XS", "S", "M", "L", "XL", "XXL", or numeric like "32" for waist. For furniture use dimensions if visible, e.g. "36x24". For electronics use model info. If not visible: "Not visible")
- style: string[] (2-3 tags from: "casual", "vintage", "streetwear", "formal", "boho", "preppy", "athletic", "minimal", "classic", "punk", "feminine", "rugged", "workwear", "outdoor", "mid-century", "modern", "industrial", "rustic", "retro")
- condition: string (one of: "excellent", "good", "fair" based on visible wear, scratches, stains, damage)
- material: string (if identifiable from tags or visual inspection: "cotton", "denim", "polyester", "wool", "silk", "leather", "linen", "wood", "metal", "plastic", "glass", "ceramic", etc. Otherwise: "Unknown")
- description: string (2-4 sentence description leading with color and item type, noting visible features, construction details, brand markings, condition observations, and any identifying details from tags or labels)
Return ONLY valid JSON — no markdown, no explanation.`;

export async function extractItemData(
  images: { base64: string; mimeType: string }[]
): Promise<GeminiExtractionResult> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "your_api_key_here") {
    throw new Error("GEMINI_API_KEY not configured");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const imageParts = images.map((img) => ({
    inlineData: {
      data: img.base64,
      mimeType: img.mimeType,
    },
  }));

  const result = await model.generateContent([SYSTEM_PROMPT, ...imageParts]);

  const text = result.response.text();
  // Strip markdown code fences if present
  const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
  return JSON.parse(cleaned);
}
