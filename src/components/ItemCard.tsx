"use client";

import Link from "next/link";
import { Heart, MapPin, Clock } from "lucide-react";
import { Item } from "@/lib/types";
import FavoriteButton from "./FavoriteButton";

function timeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
  if (diffHrs < 1) return "Just now";
  if (diffHrs < 24) return `${diffHrs}h ago`;
  const diffDays = Math.floor(diffHrs / 24);
  return `${diffDays}d ago`;
}

// Generate a consistent gradient for items that have seed/placeholder photos
function getPlaceholderGradient(item: Item): string {
  const colors: Record<string, string> = {
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
  const primary = colors[item.color[0]?.toLowerCase()] || "#6366f1";
  const secondary = item.color[1]
    ? colors[item.color[1]?.toLowerCase()] || "#818cf8"
    : primary + "88";
  return `linear-gradient(135deg, ${primary}, ${secondary})`;
}

export default function ItemCard({ item }: { item: Item }) {
  const isPlaceholder = item.photos[0]?.startsWith("/seed/");

  return (
    <Link href={`/item/${item.id}`} className="group block">
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
        {/* Image */}
        <div className="relative aspect-[3/4] overflow-hidden">
          {isPlaceholder ? (
            <div
              className="w-full h-full flex items-end p-4"
              style={{ background: getPlaceholderGradient(item) }}
            >
              <span className="text-white/90 text-sm font-medium bg-black/20 backdrop-blur-sm px-2 py-1 rounded">
                {item.brand !== "Unknown" ? item.brand : item.type}
              </span>
            </div>
          ) : (
            <img
              src={item.photos[0]}
              alt={item.description}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          )}

          {/* Condition badge */}
          <div className="absolute top-2 left-2">
            <span
              className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                item.condition === "excellent"
                  ? "bg-emerald-100 text-emerald-700"
                  : item.condition === "good"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-amber-100 text-amber-700"
              }`}
            >
              {item.condition}
            </span>
          </div>

          {/* Favorite button */}
          <div className="absolute top-2 right-2" onClick={(e) => e.preventDefault()}>
            <FavoriteButton itemId={item.id} count={item.favorites} />
          </div>
        </div>

        {/* Info */}
        <div className="p-3 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-gray-900">${item.price}</span>
            <span className="text-xs text-gray-400 uppercase tracking-wide">{item.size}</span>
          </div>

          <p className="text-sm text-gray-600 line-clamp-1">{item.description}</p>

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-1 text-xs text-gray-400">
              <MapPin className="w-3 h-3" />
              <span className="truncate max-w-[120px]">{item.store.name}</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-400">
              <Clock className="w-3 h-3" />
              <span>{timeAgo(item.createdAt)}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
