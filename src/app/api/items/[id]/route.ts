import { NextRequest, NextResponse } from "next/server";
import { getItem, updateItem } from "@/lib/db";
import { distanceFromUser } from "@/lib/geo";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const item = await getItem(id);
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const distance = Math.round(distanceFromUser(item.store.lat, item.store.lng) * 10) / 10;
  return NextResponse.json({ ...item, distance });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const updates = await request.json();
  const item = await updateItem(id, updates);
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(item);
}
