"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Wind, LogIn } from "lucide-react";
import { STORES } from "@/lib/stores";

const STORE_PINS: Record<string, string> = {
  "store-1": "1234",
  "store-2": "1234",
  "store-3": "1234",
  "store-4": "1234",
};

export default function EmployeeLogin() {
  const router = useRouter();
  const [storeId, setStoreId] = useState(STORES[0].id);
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (STORE_PINS[storeId] === pin) {
      const store = STORES.find((s) => s.id === storeId)!;
      localStorage.setItem(
        "sw-employee",
        JSON.stringify({ storeId: store.id, storeName: store.name })
      );
      router.push("/employee/dashboard");
    } else {
      setError("Invalid PIN. Try 1234 for the demo.");
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <Wind className="w-8 h-8 text-indigo-600" />
            <span className="text-2xl font-bold tracking-tight text-gray-900">
              Second<span className="text-indigo-600">Wind</span>
            </span>
          </div>
          <h1 className="text-xl font-semibold text-gray-900">Employee Portal</h1>
          <p className="text-sm text-gray-400 mt-1">
            Sign in to manage your store&apos;s inventory
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-100 p-6 space-y-5 shadow-sm">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">
              Store
            </label>
            <select
              value={storeId}
              onChange={(e) => setStoreId(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              {STORES.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">
              Employee PIN
            </label>
            <input
              type="password"
              inputMode="numeric"
              maxLength={4}
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="Enter 4-digit PIN"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent tracking-widest text-center"
            />
          </div>

          {error && (
            <p className="text-sm text-red-500 text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={!pin}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <LogIn className="w-4 h-4" />
            Sign In
          </button>
        </form>

        <p className="text-center text-xs text-gray-300 mt-4">
          Demo PIN: 1234 for all stores
        </p>
      </div>
    </div>
  );
}
