"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Item } from "@/lib/types";
import ItemGrid from "@/components/ItemGrid";
import FilterBar from "@/components/FilterBar";
import { Car, Droplets } from "lucide-react";

function BrowseFeed() {
  const searchParams = useSearchParams();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchItems() {
      setLoading(true);
      const res = await fetch(`/api/items?${searchParams.toString()}`);
      const data = await res.json();
      setItems(data);
      setLoading(false);
    }
    fetchItems();
  }, [searchParams]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Impact banner: static placeholder (127 items sold across 4 Tempe stores) */}
      <div className="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-2xl p-6 text-white">
        <p className="text-xs font-medium uppercase tracking-widest text-indigo-200 mb-3">
          Community impact so far
        </p>
        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-4xl font-extrabold">3,492 kg</span>
          <span className="text-lg text-indigo-200">CO₂ kept out of the atmosphere</span>
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4 text-sm">
          <div className="flex items-center gap-1.5">
            <Car className="w-4 h-4 text-indigo-300" />
            <span className="text-indigo-100">
              That&apos;s <span className="font-bold text-white">9,532 miles</span> not driven by a car
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Droplets className="w-4 h-4 text-indigo-300" />
            <span className="text-indigo-100">
              <span className="font-bold text-white">281,849 gallons</span> of water saved
            </span>
          </div>
        </div>
      </div>

      {/* Heading + filters */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Browse Finds</h1>
        <p className="text-sm text-gray-400 mt-0.5">
          {items.length} items near Tempe, AZ
        </p>
      </div>

      <FilterBar />

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-[3/4] bg-gray-200 rounded-xl" />
              <div className="mt-3 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/3" />
                <div className="h-3 bg-gray-100 rounded w-2/3" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <ItemGrid items={items} />
      )}
    </div>
  );
}

export default function Home() {
  return (
    <Suspense>
      <BrowseFeed />
    </Suspense>
  );
}
