"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Item } from "@/lib/types";
import ItemGrid from "@/components/ItemGrid";
import FilterBar from "@/components/FilterBar";
import { Recycle } from "lucide-react";

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
      {/* Hero stats */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Browse Finds</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            {items.length} items near Tempe, AZ
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 rounded-lg">
          <Recycle className="w-4 h-4 text-indigo-600" />
          <span className="text-sm font-medium text-indigo-700">
            847 kg CO₂ saved using SecondWind so far
          </span>
        </div>
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
