"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, LogOut, Package, CheckCircle, XCircle, Zap } from "lucide-react";
import { Item } from "@/lib/types";

interface EmployeeSession {
  storeId: string;
  storeName: string;
}

export default function EmployeeDashboard() {
  const router = useRouter();
  const [session, setSession] = useState<EmployeeSession | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [markingId, setMarkingId] = useState<string | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem("sw-employee");
    if (!raw) {
      router.push("/employee");
      return;
    }
    const parsed: EmployeeSession = JSON.parse(raw);
    setSession(parsed);

    async function fetchItems() {
      const res = await fetch(
        `/api/items?store=${parsed.storeId}&includeSold=true`
      );
      if (res.ok) setItems(await res.json());
      setLoading(false);
    }
    fetchItems();
  }, [router]);

  async function markSold(itemId: string) {
    setMarkingId(itemId);
    const res = await fetch(`/api/items/${itemId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "sold" }),
    });
    if (res.ok) {
      const updated = await res.json();
      setItems((prev) => prev.map((i) => (i.id === itemId ? updated : i)));
    }
    setMarkingId(null);
  }

  function logout() {
    localStorage.removeItem("sw-employee");
    router.push("/employee");
  }

  if (!session || loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8 animate-pulse space-y-4">
        <div className="h-8 w-48 bg-gray-200 rounded" />
        <div className="grid grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 bg-gray-200 rounded-xl" />
          ))}
        </div>
        <div className="h-64 bg-gray-200 rounded-xl" />
      </div>
    );
  }

  const available = items.filter((i) => i.status === "available");
  const sold = items.filter((i) => i.status === "sold");
  const totalCO2 = items.reduce((sum, i) => sum + i.carbonSavings.co2Kg, 0);

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{session.storeName}</h1>
          <p className="text-sm text-gray-400">Employee Dashboard</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push(`/upload?store=${session.storeId}`)}
            className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Item
          </button>
          <button
            onClick={logout}
            className="flex items-center gap-1.5 px-3 py-2 border border-gray-200 text-gray-600 text-sm rounded-lg hover:bg-gray-50 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard icon={Package} label="Total Items" value={items.length} color="text-gray-600" bg="bg-gray-100" />
        <StatCard icon={CheckCircle} label="Available" value={available.length} color="text-emerald-600" bg="bg-emerald-50" />
        <StatCard icon={XCircle} label="Sold" value={sold.length} color="text-amber-600" bg="bg-amber-50" />
        <StatCard icon={Zap} label="CO₂ Saved (kg)" value={Math.round(totalCO2)} color="text-indigo-600" bg="bg-indigo-50" />
      </div>

      {/* Inventory */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-900">Inventory</h2>
        </div>
        <div className="divide-y divide-gray-50">
          {items.length === 0 ? (
            <div className="px-4 py-12 text-center text-gray-400 text-sm">
              No items yet. Add your first item to get started.
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="px-4 py-3 flex items-center gap-4 hover:bg-gray-50/50"
              >
                {/* Color swatch */}
                <div
                  className="w-10 h-10 rounded-lg flex-shrink-0"
                  style={{
                    background: `linear-gradient(135deg, ${getColor(item.color[0])}, ${getColor(item.color[1] || item.color[0])}88)`,
                  }}
                />

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {item.brand !== "Unknown" ? `${item.brand} ` : ""}
                    {item.type} — {item.size}
                  </p>
                  <p className="text-xs text-gray-400 truncate">{item.description}</p>
                </div>

                {/* Price */}
                <span className="text-sm font-bold text-gray-900 flex-shrink-0">
                  ${item.price}
                </span>

                {/* Status / Action */}
                <div className="flex-shrink-0 w-28 text-right">
                  {item.status === "sold" ? (
                    <span className="inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-500">
                      Sold
                    </span>
                  ) : (
                    <button
                      onClick={() => markSold(item.id)}
                      disabled={markingId === item.id}
                      className="inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full bg-amber-50 text-amber-700 hover:bg-amber-100 transition-colors disabled:opacity-50"
                    >
                      {markingId === item.id ? "Updating..." : "Mark Sold"}
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  color,
  bg,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
  color: string;
  bg: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4">
      <div className={`w-8 h-8 ${bg} rounded-lg flex items-center justify-center mb-2`}>
        <Icon className={`w-4 h-4 ${color}`} />
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-xs text-gray-400">{label}</p>
    </div>
  );
}

const COLOR_MAP: Record<string, string> = {
  black: "#1a1a1a", white: "#e5e5e5", red: "#ef4444", blue: "#3b82f6",
  navy: "#1e3a5f", green: "#22c55e", "forest green": "#166534",
  indigo: "#4338ca", "light blue": "#93c5fd", pink: "#ec4899",
  camel: "#c2956b", tan: "#d2b48c", brown: "#92400e", ivory: "#fdf6e3",
  gray: "#6b7280", maroon: "#7f1d1d", gold: "#d97706", olive: "#556b2f",
  cream: "#f5f0e1", yellow: "#eab308", purple: "#9333ea", burgundy: "#800020",
};

function getColor(color?: string): string {
  return COLOR_MAP[color?.toLowerCase() || ""] || "#6366f1";
}
