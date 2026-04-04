import { promises as fs } from "fs";
import path from "path";
import { Item, Store } from "./types";

const DATA_DIR = path.join(process.cwd(), "data");
const ITEMS_PATH = path.join(DATA_DIR, "items.json");
const STORES_PATH = path.join(DATA_DIR, "stores.json");

export async function getStores(): Promise<Store[]> {
  const raw = await fs.readFile(STORES_PATH, "utf-8");
  return JSON.parse(raw);
}

export async function getItems(): Promise<Item[]> {
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
  await fs.writeFile(ITEMS_PATH, JSON.stringify(items, null, 2));
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
  await fs.writeFile(ITEMS_PATH, JSON.stringify(items, null, 2));
  return items[index];
}
