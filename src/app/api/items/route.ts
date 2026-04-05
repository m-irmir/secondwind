import { NextRequest, NextResponse } from "next/server";
import { getItems, createItem } from "@/lib/db";
import { Item } from "@/lib/types";

export async function GET(request: NextRequest) {
  const items = await getItems();
  const params = request.nextUrl.searchParams;

  const includeSold = params.get("includeSold");
  let filtered = includeSold ? [...items] : items.filter((item) => item.status === "available");

  const type = params.get("type");
  if (type) filtered = filtered.filter((i) => i.type === type);

  const size = params.get("size");
  if (size) filtered = filtered.filter((i) => i.size.toLowerCase() === size.toLowerCase());

  const color = params.get("color");
  if (color)
    filtered = filtered.filter((i) =>
      i.color.some((c) => c.toLowerCase().includes(color.toLowerCase()))
    );

  const store = params.get("store");
  if (store) filtered = filtered.filter((i) => i.store.id === store);

  const minPrice = params.get("minPrice");
  const maxPrice = params.get("maxPrice");
  if (minPrice) filtered = filtered.filter((i) => i.price >= Number(minPrice));
  if (maxPrice) filtered = filtered.filter((i) => i.price <= Number(maxPrice));

  const search = params.get("q");
  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      (i) =>
        i.description.toLowerCase().includes(q) ||
        i.brand.toLowerCase().includes(q) ||
        i.type.toLowerCase().includes(q) ||
        i.style.some((s) => s.toLowerCase().includes(q)) ||
        i.material.toLowerCase().includes(q)
    );
  }

  const sort = params.get("sort");
  if (sort === "price_asc") filtered.sort((a, b) => a.price - b.price);
  else if (sort === "price_desc") filtered.sort((a, b) => b.price - a.price);
  else if (sort === "favorites") filtered.sort((a, b) => b.favorites - a.favorites);
  else filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return NextResponse.json(filtered);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const item: Item = {
      ...body,
      id: `item-${Date.now()}`,
      favorites: 0,
      status: "available",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const created = await createItem(item);
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("POST /api/items failed:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
