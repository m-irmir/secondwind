"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Item } from "@/lib/types";
import FavoriteButton from "@/components/FavoriteButton";
import { Leaf, Droplets, MapPin, ExternalLink } from "lucide-react";

const colorHex: Record<string, string> = {
  black: "#1a1a1a",
  white: "#f5f5f5",
  red: "#ef4444",
  blue: "#3b82f6",
  navy: "#1e3a5f",
  green: "#22c55e",
  "forest green": "#166534",
  indigo: "#4338ca",
  "light blue": "#93c5fd",
  pink: "#ec4899",
  camel: "#c2956b",
  tan: "#d2b48c",
  brown: "#92400e",
  ivory: "#fdf6e3",
  gray: "#6b7280",
  maroon: "#7f1d1d",
  gold: "#d97706",
  olive: "#556b2f",
  cream: "#f5f0e1",
  yellow: "#eab308",
  purple: "#9333ea",
  burgundy: "#800020",
};

function getPlaceholderGradient(item: Item): string {
  const primary = colorHex[item.color[0]?.toLowerCase()] || "#6366f1";
  const secondary = item.color[1]
    ? colorHex[item.color[1]?.toLowerCase()] || "#818cf8"
    : primary + "88";
  return `linear-gradient(135deg, ${primary}, ${secondary})`;
}

const conditionLabel: Record<string, string> = {
  excellent: "Excellent",
  good: "Good",
  fair: "Fair",
};

const conditionColor: Record<string, string> = {
  excellent: "bg-emerald-500/80",
  good: "bg-blue-500/80",
  fair: "bg-amber-500/80",
};

export default function FeedPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/items?sort=newest")
      .then((r) => r.json())
      .then((data) => {
        setItems(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="h-[calc(100vh-4rem)] flex items-center justify-center text-gray-400">
        No items yet
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-4rem)] overflow-y-scroll snap-y snap-mandatory hide-scrollbar">
      {items.map((item) => {
        const isPlaceholder = item.photos[0]?.startsWith("/seed/");

        return (
          <section
            key={item.id}
            className="h-[calc(100vh-4rem)] snap-start snap-always relative flex-shrink-0 overflow-hidden"
          >
            {/* Background */}
            {isPlaceholder ? (
              <div
                className="absolute inset-0 flex items-center justify-center"
                style={{ background: getPlaceholderGradient(item) }}
              >
                <span className="text-white/20 text-6xl sm:text-8xl font-bold select-none">
                  {item.brand !== "Unknown" ? item.brand : item.type}
                </span>
              </div>
            ) : (
              <img
                src={item.photos[0]}
                alt={item.description}
                className="absolute inset-0 w-full h-full object-cover"
              />
            )}

            {/* Dark gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

            {/* Right sidebar: action buttons */}
            <div className="absolute right-4 bottom-44 flex flex-col items-center gap-5">
              {/* Favorite */}
              <div className="flex flex-col items-center gap-1">
                <FavoriteButton itemId={item.id} count={item.favorites} />
              </div>

              {/* CO2 */}
              {item.carbonSavings.co2Kg > 0 && (
                <div className="flex flex-col items-center gap-1">
                  <div className="w-11 h-11 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <Leaf className="w-5 h-5 text-emerald-400" />
                  </div>
                  <span className="text-white text-[10px] font-medium">
                    {item.carbonSavings.co2Kg}kg
                  </span>
                </div>
              )}

              {/* Water */}
              {item.carbonSavings.waterLiters > 0 && (
                <div className="flex flex-col items-center gap-1">
                  <div className="w-11 h-11 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <Droplets className="w-5 h-5 text-blue-400" />
                  </div>
                  <span className="text-white text-[10px] font-medium">
                    {item.carbonSavings.waterLiters.toLocaleString()}L
                  </span>
                </div>
              )}
            </div>

            {/* Bottom-right: store spinner */}
            <div className="absolute bottom-6 right-4 flex flex-col items-center gap-1">
              <div
                className="w-11 h-11 rounded-full bg-indigo-600 border-2 border-white/30 flex items-center justify-center"
                style={{ animation: "spin 3s linear infinite" }}
              >
                <span className="text-white font-bold text-sm">
                  {item.store.name.charAt(0)}
                </span>
              </div>
              <span className="text-white/70 text-[10px] max-w-[60px] text-center truncate">
                {item.store.name.split(" ")[0]}
              </span>
            </div>

            {/* Bottom-left: item info */}
            <div className="absolute bottom-6 left-5 max-w-[65%] space-y-2">
              {/* Price + condition */}
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-white">
                  ${item.price}
                </span>
                <span
                  className={`${conditionColor[item.condition] || "bg-gray-500/80"} backdrop-blur-sm text-white text-xs font-medium px-2 py-0.5 rounded-full`}
                >
                  {conditionLabel[item.condition] || item.condition}
                </span>
              </div>

              {/* Brand + type */}
              <p className="text-lg font-semibold text-white/90">
                {item.brand !== "Unknown" ? `${item.brand} ` : ""}
                {item.type}
              </p>

              {/* Tags: size, material */}
              <div className="flex flex-wrap gap-1.5">
                {item.size && item.size !== "Unknown" && (
                  <span className="bg-white/20 backdrop-blur-sm text-white text-xs px-2 py-0.5 rounded-full">
                    {item.size}
                  </span>
                )}
                {item.material && item.material !== "Unknown" && (
                  <span className="bg-white/20 backdrop-blur-sm text-white text-xs px-2 py-0.5 rounded-full">
                    {item.material}
                  </span>
                )}
                {item.color.length > 0 && (
                  <span className="bg-white/20 backdrop-blur-sm text-white text-xs px-2 py-0.5 rounded-full">
                    {item.color.join(", ")}
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-sm text-white/70 line-clamp-2">
                {item.description}
              </p>

              {/* Store + view details */}
              <div className="flex items-center gap-3 pt-1">
                <span className="text-white/50 text-xs flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {item.store.name}
                </span>
                <Link
                  href={`/item/${item.id}`}
                  className="text-white/60 text-xs hover:text-white transition-colors flex items-center gap-1"
                >
                  View details <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
}
