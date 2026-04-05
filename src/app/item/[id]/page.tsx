"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, MapPin, Tag, Ruler, Palette, Package, Clock, ExternalLink } from "lucide-react";
import { Item } from "@/lib/types";
import FavoriteButton from "@/components/FavoriteButton";
import CarbonBadge from "@/components/CarbonBadge";
import { Recycle } from "lucide-react";

const NON_APPAREL_TYPES = new Set(["furniture", "electronics", "home"]);

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

function getPlaceholderGradient(item: Item): string {
  const colors: Record<string, string> = {
    black: "#1a1a1a", white: "#f5f5f5", red: "#ef4444", blue: "#3b82f6",
    navy: "#1e3a5f", green: "#22c55e", "forest green": "#166534",
    indigo: "#4338ca", "light blue": "#93c5fd", pink: "#ec4899",
    camel: "#c2956b", tan: "#d2b48c", brown: "#92400e", ivory: "#fdf6e3",
    gray: "#6b7280", maroon: "#7f1d1d", gold: "#d97706", olive: "#556b2f",
    cream: "#f5f0e1", yellow: "#eab308", purple: "#9333ea", burgundy: "#800020",
  };
  const primary = colors[item.color[0]?.toLowerCase()] || "#6366f1";
  const secondary = item.color[1] ? colors[item.color[1]?.toLowerCase()] || "#818cf8" : primary + "88";
  return `linear-gradient(135deg, ${primary}, ${secondary})`;
}

export default function ItemDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchItem() {
      const res = await fetch(`/api/items/${id}`);
      if (res.ok) setItem(await res.json());
      setLoading(false);
    }
    fetchItem();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 animate-pulse space-y-4">
        <div className="h-6 w-24 bg-gray-200 rounded" />
        <div className="aspect-[4/3] bg-gray-200 rounded-xl" />
        <div className="h-8 w-1/3 bg-gray-200 rounded" />
        <div className="h-4 w-2/3 bg-gray-100 rounded" />
      </div>
    );
  }

  if (!item) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-400 text-lg">Item not found</p>
        <button onClick={() => router.push("/")} className="mt-4 text-indigo-600 text-sm font-medium">
          Back to browse
        </button>
      </div>
    );
  }

  const isPlaceholder = item.photos[0]?.startsWith("/seed/");
  const isSold = item.status === "sold";

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
      {/* Back */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      {/* Image */}
      <div className={`relative rounded-xl overflow-hidden ${isSold ? "opacity-60" : ""}`}>
        {isPlaceholder ? (
          <div
            className="w-full aspect-[4/3] flex items-center justify-center"
            style={{ background: getPlaceholderGradient(item) }}
          >
            <span className="text-white/80 text-2xl font-bold">
              {item.brand !== "Unknown" ? item.brand : item.type}
            </span>
          </div>
        ) : (
          <img src={item.photos[0]} alt={item.description} className="w-full aspect-[4/3] object-cover" />
        )}

        {isSold && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <span className="text-white text-3xl font-bold tracking-widest uppercase">Sold</span>
          </div>
        )}

        <div className="absolute top-3 right-3" onClick={(e) => e.stopPropagation()}>
          <FavoriteButton itemId={item.id} count={item.favorites} />
        </div>
      </div>

      {/* Price + condition */}
      <div className="flex items-center justify-between">
        <div className="flex items-baseline gap-3">
          <span className="text-3xl font-bold text-gray-900">${item.price}</span>
          <span
            className={`text-xs font-medium px-2.5 py-1 rounded-full ${
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
        <div className="flex items-center gap-1.5 text-sm text-gray-400">
          <Clock className="w-4 h-4" />
          Added {timeAgo(item.createdAt)}
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-600 leading-relaxed">{item.description}</p>

      {/* Details grid */}
      <div className="grid grid-cols-2 gap-3">
        <DetailItem icon={Tag} label="Brand" value={item.brand} />
        <DetailItem icon={Ruler} label="Size" value={item.size} />
        <DetailItem icon={Palette} label="Color" value={item.color.join(", ")} />
        <DetailItem icon={Package} label="Material" value={item.material} />
      </div>

      {/* Style tags */}
      <div className="flex flex-wrap gap-2">
        {item.style.map((s) => (
          <span
            key={s}
            className="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full"
          >
            {s}
          </span>
        ))}
      </div>

      {/* Environmental impact */}
      {NON_APPAREL_TYPES.has(item.type) ? (
        <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-indigo-50 to-violet-50 rounded-xl border border-indigo-100">
          <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
            <Recycle className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="text-sm text-gray-600">
            Buying this item secondhand keeps it out of the landfill and avoids the environmental cost of manufacturing a replacement.
          </p>
        </div>
      ) : (
        <CarbonBadge savings={item.carbonSavings} />
      )}

      {/* Store info */}
      <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
            <MapPin className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <p className="font-medium text-gray-900 text-sm">{item.store.name}</p>
            <p className="text-xs text-gray-400">
              {item.store.address}
              {item.distance != null && ` · ${item.distance} mi away`}
            </p>
          </div>
        </div>
        <a
          href={`https://maps.google.com/?q=${item.store.lat},${item.store.lng}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-700 font-medium"
        >
          Directions
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={() => {
            alert("Availability request sent! (Demo)");
          }}
          className="flex-1 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors text-sm"
        >
          Check Availability
        </button>
      </div>

      {/* Disclaimer */}
      <p className="text-xs text-center text-gray-300">
        Items are in-store — availability may change
      </p>
    </div>
  );
}

function DetailItem({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-2.5 p-3 bg-white rounded-lg border border-gray-100">
      <Icon className="w-4 h-4 text-gray-400" />
      <div>
        <p className="text-xs text-gray-400">{label}</p>
        <p className="text-sm font-medium text-gray-900">{value}</p>
      </div>
    </div>
  );
}
