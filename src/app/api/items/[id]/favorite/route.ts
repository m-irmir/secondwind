import { NextRequest, NextResponse } from "next/server";
import { getItem, updateItem } from "@/lib/db";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const item = await getItem(id);
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const updated = await updateItem(id, { favorites: item.favorites + 1 });
  return NextResponse.json({ favorites: updated!.favorites });
}
