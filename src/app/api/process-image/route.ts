import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { extractItemData } from "@/lib/gemini";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get("image") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No image provided" }, { status: 400 });
  }

  // Save the uploaded image
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
  const uploadDir = path.join(process.cwd(), "public", "uploads");
  await fs.mkdir(uploadDir, { recursive: true });
  await fs.writeFile(path.join(uploadDir, filename), buffer);

  // Process with Gemini
  try {
    const base64 = buffer.toString("base64");
    const result = await extractItemData(base64, file.type);
    return NextResponse.json({
      ...result,
      photoPath: `/uploads/${filename}`,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Processing failed";
    // Return the saved photo path even if Gemini fails, so the user can fill in manually
    return NextResponse.json(
      {
        error: message,
        photoPath: `/uploads/${filename}`,
      },
      { status: 422 }
    );
  }
}
