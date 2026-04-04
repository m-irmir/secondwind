"use client";

import { useState } from "react";
import { Heart } from "lucide-react";

export default function FavoriteButton({
  itemId,
  count,
}: {
  itemId: string;
  count: number;
}) {
  const [favorited, setFavorited] = useState(false);
  const [currentCount, setCurrentCount] = useState(count);
  const [animating, setAnimating] = useState(false);

  async function handleFavorite() {
    if (favorited) return;

    setFavorited(true);
    setCurrentCount((c) => c + 1);
    setAnimating(true);
    setTimeout(() => setAnimating(false), 300);

    try {
      await fetch(`/api/items/${itemId}/favorite`, { method: "POST" });
    } catch {
      // Revert on failure
      setFavorited(false);
      setCurrentCount((c) => c - 1);
    }
  }

  return (
    <button
      onClick={handleFavorite}
      className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium transition-all ${
        favorited
          ? "bg-coral-500 text-white shadow-sm"
          : "bg-white/90 backdrop-blur-sm text-gray-600 hover:text-coral-500"
      } ${animating ? "scale-125" : "scale-100"}`}
      style={favorited ? { backgroundColor: "#F97066" } : {}}
    >
      <Heart
        className={`w-3.5 h-3.5 transition-all ${favorited ? "fill-white" : ""}`}
      />
      <span>{currentCount}</span>
    </button>
  );
}
