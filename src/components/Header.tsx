"use client";

import Link from "next/link";
import { Wind, Plus, Search, UserCircle } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Header() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/?q=${encodeURIComponent(query.trim())}`);
      setSearchOpen(false);
    }
  }

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <Wind className="w-7 h-7 text-indigo-600 group-hover:rotate-12 transition-transform" />
          <span className="text-xl font-bold tracking-tight text-gray-900">
            Second<span className="text-indigo-600">Wind</span>
          </span>
        </Link>

        <div className="flex items-center gap-3">
          {searchOpen ? (
            <form onSubmit={handleSearch} className="flex items-center gap-2">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search items..."
                autoFocus
                className="w-48 sm:w-64 px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-sm"
              >
                Cancel
              </button>
            </form>
          ) : (
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
            >
              <Search className="w-5 h-5" />
            </button>
          )}

          <Link
            href="/employee"
            className="flex items-center gap-1.5 px-3 py-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 text-sm font-medium rounded-lg transition-colors"
          >
            <UserCircle className="w-5 h-5" />
            <span className="hidden sm:inline">Employee</span>
          </Link>

          <Link
            href="/upload"
            className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Item</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
