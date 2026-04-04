import { GoogleGenerativeAI } from "@google/generative-ai";
import { GeminiExtractionResult } from "./types";

const SYSTEM_PROMPT = `You are a thrift store inventory assistant. Analyze the clothing item in this photo and extract structured data.

Return ONLY a JSON object with these fields:
- type: string (one of: "shirt", "t-shirt", "top", "blouse", "pants", "jeans", "dress", "jacket", "coat", "sweater", "hoodie", "shoes", "boots", "skirt", "shorts", "accessories", "bag")
- color: string[] (specific colors, e.g. ["navy", "white"] not ["blue"])
- brand: string (brand name if visible on tags/logos, otherwise "Unknown")
- size: string (from tag if visible: "XS", "S", "M", "L", "XL", "XXL", or numeric. If not visible: "Not visible")
- style: string[] (2-3 tags from: "casual", "vintage", "streetwear", "formal", "boho", "preppy", "athletic", "minimal", "classic", "punk", "feminine", "rugged", "workwear", "outdoor")
- condition: string (one of: "excellent", "good", "fair" based on visible wear)
- material: string (if identifiable: "cotton", "denim", "polyester", "wool", "silk", "leather", "linen", etc. Otherwise: "Unknown")
- description: string (1-2 sentence compelling description that makes someone want to buy this)
- suggestedPrice: number (thrift store price in USD based on brand, condition, type)

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
