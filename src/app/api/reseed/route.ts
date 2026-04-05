import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const BLOB_ITEMS_KEY = "items.json";

export async function POST() {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json({ error: "No blob token configured" }, { status: 400 });
  }

  const { list, del, put } = await import("@vercel/blob");

  // Delete existing blob
  const { blobs } = await list({ prefix: BLOB_ITEMS_KEY, limit: 10 });
  for (const blob of blobs) {
    await del(blob.url);
  }

  // Re-seed from bundled items.json
  const seedPath = path.join(process.cwd(), "data", "items.json");
  const seedRaw = await fs.readFile(seedPath, "utf-8");
  const items = JSON.parse(seedRaw);

  await put(BLOB_ITEMS_KEY, JSON.stringify(items, null, 2), {
    access: "public",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
  });

  return NextResponse.json({ ok: true, itemCount: items.length });
}
