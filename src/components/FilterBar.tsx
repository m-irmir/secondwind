"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { X } from "lucide-react";
import { STORES } from "@/lib/stores";

const TYPES = [
  "jacket", "shirt", "t-shirt", "blouse", "jeans", "pants",
  "dress", "sweater", "hoodie", "shoes", "boots", "skirt",
  "shorts", "top", "bag", "furniture", "electronics", "home",
];

const SIZES = [
  "XS", "S", "M", "L", "XL", "XXL",
  "26", "28", "30", "32", "34", "36",
  "7", "8", "9", "10", "11", "12",
];

const COLORS = [
  "black", "white", "blue", "red", "green", "navy",
  "pink", "brown", "tan", "ivory", "camel", "gray",
  "maroon", "olive", "cream", "yellow", "purple", "burgundy",
  "gold", "indigo",
];

const RADIUS_OPTIONS = [
  { value: "", label: "Any Distance" },
  { value: "1", label: "Within 1 mi" },
  { value: "5", label: "Within 5 mi" },
  { value: "10", label: "Within 10 mi" },
  { value: "25", label: "Within 25 mi" },
];

const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "favorites", label: "Most Loved" },
];

export default function FilterBar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const activeRadius = searchParams.get("radius") || "";
  const activeType = searchParams.get("type") || "";
  const activeSize = searchParams.get("size") || "";
  const activeColor = searchParams.get("color") || "";
  const activeStore = searchParams.get("store") || "";
  const activeSort = searchParams.get("sort") || "newest";

  const activeCount = [activeRadius, activeType, activeSize, activeColor, activeStore].filter(Boolean).length;

  function setFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/?${params.toString()}`);
  }

  function clearAll() {
    router.push("/");
  }

  const selectClass = (active: boolean) =>
    `w-full border rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors ${
      active
        ? "border-indigo-400 text-indigo-700"
        : "border-gray-200 text-gray-700"
    }`;

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Radius */}
        <div>
          <label className="block text-[11px] font-medium text-gray-400 mb-1 uppercase tracking-wider">
            Distance
          </label>
          <select
            value={activeRadius}
            onChange={(e) => setFilter("radius", e.target.value)}
            className={selectClass(!!activeRadius)}
          >
            {RADIUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        {/* Category */}
        <div>
          <label className="block text-[11px] font-medium text-gray-400 mb-1 uppercase tracking-wider">
            Category
          </label>
          <select
            value={activeType}
            onChange={(e) => setFilter("type", e.target.value)}
            className={selectClass(!!activeType)}
          >
            <option value="">All Categories</option>
            {TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        {/* Size */}
        <div>
          <label className="block text-[11px] font-medium text-gray-400 mb-1 uppercase tracking-wider">
            Size
          </label>
          <select
            value={activeSize}
            onChange={(e) => setFilter("size", e.target.value)}
            className={selectClass(!!activeSize)}
          >
            <option value="">All Sizes</option>
            <optgroup label="Letter">
              {SIZES.slice(0, 6).map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </optgroup>
            <optgroup label="Waist / Shoe">
              {SIZES.slice(6).map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </optgroup>
          </select>
        </div>

        {/* Color */}
        <div>
          <label className="block text-[11px] font-medium text-gray-400 mb-1 uppercase tracking-wider">
            Color
          </label>
          <select
            value={activeColor}
            onChange={(e) => setFilter("color", e.target.value)}
            className={selectClass(!!activeColor)}
          >
            <option value="">All Colors</option>
            {COLORS.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Store */}
        <div>
          <label className="block text-[11px] font-medium text-gray-400 mb-1 uppercase tracking-wider">
            Store
          </label>
          <select
            value={activeStore}
            onChange={(e) => setFilter("store", e.target.value)}
            className={selectClass(!!activeStore)}
          >
            <option value="">All Stores</option>
            {STORES.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>

        {/* Sort */}
        <div>
          <label className="block text-[11px] font-medium text-gray-400 mb-1 uppercase tracking-wider">
            Sort By
          </label>
          <select
            value={activeSort}
            onChange={(e) => setFilter("sort", e.target.value)}
            className={selectClass(activeSort !== "newest")}
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Active filter count + clear */}
      {activeCount > 0 && (
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">
            {activeCount} filter{activeCount > 1 ? "s" : ""} active
          </span>
          <button
            onClick={clearAll}
            className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-700 font-medium"
          >
            <X className="w-3 h-3" />
            Clear all
          </button>
        </div>
      )}
    </div>
  );
}
