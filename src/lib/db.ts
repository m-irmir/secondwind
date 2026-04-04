import { promises as fs } from "fs";
import path from "path";
import { Item, Store } from "./types";

const DATA_DIR = path.join(process.cwd(), "data");
const STORES_PATH = path.join(DATA_DIR, "stores.json");
const ITEMS_PATH = path.join(DATA_DIR, "items.json");

const BLOB_ITEMS_KEY = "items.json";
const useBlob = !!process.env.BLOB_READ_WRITE_TOKEN;

// Lazy-import @vercel/blob only when needed (avoids errors locally without the token)
async function blobSDK() {
  return await import("@vercel/blob");
}

export async function getStores(): Promise<Store[]> {
  const raw = await fs.readFile(STORES_PATH, "utf-8");
  return JSON.parse(raw);
}

async function readItemsFromBlob(): Promise<Item[]> {
  const { head } = await blobSDK();

  // Check if the blob exists
  try {
    const info = await head(BLOB_ITEMS_KEY);
    const res = await fetch(info.url);
    return (await res.json()) as Item[];
  } catch {
    // Blob doesn't exist yet — seed from bundled items.json
    const seedRaw = await fs.readFile(ITEMS_PATH, "utf-8");
    const seedItems: Item[] = JSON.parse(seedRaw);
    await writeItemsToBlob(seedItems);
    return seedItems;
  }
}

async function writeItemsToBlob(items: Item[]): Promise<void> {
  const { put } = await blobSDK();
  await put(BLOB_ITEMS_KEY, JSON.stringify(items, null, 2), {
    access: "public",
    addRandomSuffix: false,
    contentType: "application/json",
  });
}

export async function getItems(): Promise<Item[]> {
  if (useBlob) {
    return readItemsFromBlob();
  }
  const raw = await fs.readFile(ITEMS_PATH, "utf-8");
  return JSON.parse(raw);
}

export async function getItem(id: string): Promise<Item | undefined> {
  const items = await getItems();
  return items.find((item) => item.id === id);
}

export async function createItem(item: Item): Promise<Item> {
  const items = await getItems();
  items.unshift(item);
  if (useBlob) {
    await writeItemsToBlob(items);
  } else {
    await fs.writeFile(ITEMS_PATH, JSON.stringify(items, null, 2));
  }
  return item;
}

export async function updateItem(
  id: string,
  updates: Partial<Item>
): Promise<Item | undefined> {
  const items = await getItems();
  const index = items.findIndex((item) => item.id === id);
  if (index === -1) return undefined;

  items[index] = { ...items[index], ...updates, updatedAt: new Date().toISOString() };
  if (useBlob) {
    await writeItemsToBlob(items);
  } else {
    await fs.writeFile(ITEMS_PATH, JSON.stringify(items, null, 2));
  }
  return items[index];
}
