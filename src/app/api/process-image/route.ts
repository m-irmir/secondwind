import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { extractItemData } from "@/lib/gemini";

const useBlob = !!process.env.BLOB_READ_WRITE_TOKEN;

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const files = formData.getAll("images") as File[];

  if (files.length === 0) {
    return NextResponse.json({ error: "No images provided" }, { status: 400 });
  }

  const photoPaths: string[] = [];
  const images: { base64: string; mimeType: string }[] = [];

  for (const file of files) {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString("base64");

    if (useBlob) {
      // Upload to Vercel Blob
      const { put } = await import("@vercel/blob");
      const filename = `uploads/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
      const blob = await put(filename, buffer, {
        access: "public",
        contentType: file.type,
      });
      photoPaths.push(blob.url);
    } else {
      // Local dev: save to disk
      try {
        const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
        const uploadDir = path.join(process.cwd(), "public", "uploads");
        await fs.mkdir(uploadDir, { recursive: true });
        await fs.writeFile(path.join(uploadDir, filename), buffer);
        photoPaths.push(`/uploads/${filename}`);
      } catch {
        photoPaths.push(`data:${file.type};base64,${base64}`);
      }
    }

    images.push({ base64, mimeType: file.type });
  }

  // Process with Gemini
  try {
    const result = await extractItemData(images);
    return NextResponse.json({
      ...result,
      photoPaths,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Processing failed";
    // Return photo paths even if Gemini fails, so user can fill in manually
    return NextResponse.json(
      {
        error: message,
        photoPaths,
      },
      { status: 422 }
    );
  }
}
