"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Check } from "lucide-react";
import { getCarbonSavings } from "@/lib/carbon";
import { STORES } from "@/lib/stores";

const TYPES = [
  "shirt", "t-shirt", "top", "blouse", "pants", "jeans",
  "dress", "jacket", "coat", "sweater", "hoodie", "shoes",
  "boots", "skirt", "shorts", "accessories", "bag",
  "furniture", "electronics", "home",
];

interface ItemFormProps {
  initialData?: Record<string, unknown>;
  photoPaths: string[];
  preSelectedStoreId?: string;
}

export default function ItemForm({ initialData, photoPaths, preSelectedStoreId }: ItemFormProps) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    type: (initialData?.type as string) || "shirt",
    color: Array.isArray(initialData?.color) ? (initialData.color as string[]).join(", ") : "",
    brand: (initialData?.brand as string) || "",
    size: (initialData?.size as string) || "",
    style: Array.isArray(initialData?.style) ? (initialData.style as string[]).join(", ") : "",
    condition: (initialData?.condition as string) || "good",
    material: (initialData?.material as string) || "",
    description: (initialData?.description as string) || "",
    price: initialData?.suggestedPrice ? String(initialData.suggestedPrice) : "",
    storeId: preSelectedStoreId || "store-1",
  });

  function update(key: string, value: string) {
    setFormData((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    const store = STORES.find((s) => s.id === formData.storeId)!;
    const carbonSavings = getCarbonSavings(formData.type);

    const item = {
      photos: photoPaths,
      type: formData.type,
      color: formData.color.split(",").map((c) => c.trim()).filter(Boolean),
      brand: formData.brand || "Unknown",
      size: formData.size,
      style: formData.style.split(",").map((s) => s.trim()).filter(Boolean),
      condition: formData.condition,
      material: formData.material || "Unknown",
      description: formData.description,
      price: Number(formData.price) || 0,
      store,
      carbonSavings,
    };

    try {
      const res = await fetch("/api/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
      });

      if (res.ok) {
        setSubmitted(true);
        setTimeout(() => router.push("/"), 1500);
      } else {
        const err = await res.json().catch(() => null);
        throw new Error(err?.error || `Save failed (${res.status})`);
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to create item");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check className="w-8 h-8 text-emerald-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">Item Published!</h3>
        <p className="text-gray-500 mt-1">Redirecting to browse...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Photo previews */}
      <div className={`rounded-xl overflow-hidden bg-gray-50 ${photoPaths.length > 1 ? "grid grid-cols-2 gap-1" : ""}`}>
        {photoPaths.map((p, i) => (
          <img
            key={i}
            src={p}
            alt={i === 0 ? "Item" : `Tag ${i}`}
            className={`w-full object-cover ${photoPaths.length === 1 ? "max-h-48 object-contain" : "aspect-square"}`}
          />
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Type */}
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wide">Category</label>
          <select value={formData.type} onChange={(e) => update("type", e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
            {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        {/* Condition */}
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wide">Condition</label>
          <select value={formData.condition} onChange={(e) => update("condition", e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
            <option value="excellent">Excellent</option>
            <option value="good">Good</option>
            <option value="fair">Fair</option>
          </select>
        </div>

        {/* Brand */}
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wide">Brand</label>
          <input type="text" value={formData.brand} onChange={(e) => update("brand", e.target.value)} placeholder="e.g. Levi's" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
        </div>

        {/* Size */}
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wide">Size</label>
          <input type="text" value={formData.size} onChange={(e) => update("size", e.target.value)} placeholder="M, L, 32, etc." className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
        </div>

        {/* Color */}
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wide">Colors</label>
          <input type="text" value={formData.color} onChange={(e) => update("color", e.target.value)} placeholder="navy, white" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
        </div>

        {/* Material */}
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wide">Material</label>
          <input type="text" value={formData.material} onChange={(e) => update("material", e.target.value)} placeholder="cotton, denim, etc." className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
        </div>

        {/* Price */}
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wide">Price ($)</label>
          <input type="number" value={formData.price} onChange={(e) => update("price", e.target.value)} placeholder="15" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
        </div>

        {/* Store */}
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wide">Store</label>
          <select value={formData.storeId} onChange={(e) => update("storeId", e.target.value)} disabled={!!preSelectedStoreId} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500">
            {STORES.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>
      </div>

      {/* Style tags */}
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wide">Style Tags</label>
        <input type="text" value={formData.style} onChange={(e) => update("style", e.target.value)} placeholder="casual, vintage, streetwear" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
      </div>

      {/* Description */}
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wide">Description</label>
        <textarea value={formData.description} onChange={(e) => update("description", e.target.value)} rows={3} placeholder="AI-generated or write your own..." className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none" />
      </div>

      <button
        type="submit"
        disabled={submitting || !formData.description || !formData.price}
        className="w-full py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
      >
        {submitting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Publishing...
          </>
        ) : (
          "Publish Item"
        )}
      </button>
    </form>
  );
}
