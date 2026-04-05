"use client";

import {
  Wind,
  Factory,
  Ship,
  Warehouse,
  Truck,
  MapPin,
  ArrowDown,
  Droplets,
  Flame,
  Recycle,
  Store,
  ShoppingBag,
  Trash2,
  Globe,
  TrendingDown,
  Camera,
  Brain,
  Tag,
} from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* ═══════════════════ HERO ═══════════════════ */}
      <section className="relative overflow-hidden bg-gray-950 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/40 via-gray-950 to-gray-950" />
        <div className="relative max-w-5xl mx-auto px-6 py-20 sm:py-28 text-center">
          <div className="flex items-center justify-center gap-3 mb-5">
            <Wind className="w-9 h-9 text-indigo-400" />
            <span className="text-2xl sm:text-3xl font-bold tracking-tight">
              Second<span className="text-indigo-400">Wind</span>
            </span>
          </div>
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.1]">
            Secondhand, digitized.
          </h1>
          <p className="mt-5 text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
            AI vision-powered platform that can turn any thrift store into a browsable,
            searchable online catalog in seconds, with zero technical skill
            required.
          </p>
          <p className="mt-3 text-sm text-gray-500">
          </p>
        </div>
      </section>

      {/* ═══════════════════ THE PROBLEM ═══════════════════ */}
      <section className="max-w-6xl mx-auto px-6 py-16 sm:py-20">
        <p className="text-sm font-semibold uppercase tracking-widest text-coral-500 text-center">
          The problem:
        </p>
        <h2 className="mt-3 text-3xl sm:text-4xl font-black text-gray-900 tracking-tight text-center max-w-3xl mx-auto">
          The fashion industry is one of the world's biggest pollutors.
        </h2>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-10">
          {[
                        {
              n: "92M",
              label: "tons of textile waste / yr",
              sub: "A whole garbage truck every second.",
              icon: Trash2,
            },
            {
              n: "8–10%",
              label: "of global CO₂ emissions",
              sub: "From textiles alone, more than aviation and shipping combined!!",
              icon: Flame,
            },

            {
              n: "70–90%",
              label: "of donated clothes wasted",
              sub: "Sent to landfills or shipped overseas.",
              icon: TrendingDown,
            },
            {
              n: "10,000L",
              label: "of water per pair of jeans",
              sub: "What you drink in 9 years.",
              icon: Droplets,
            },
          ].map((s) => (
            <div
              key={s.label}
              className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm"
            >
              <s.icon className="w-5 h-5 text-coral-500 mb-3" />
              <p className="text-3xl sm:text-4xl font-black text-gray-900">
                {s.n}
              </p>
              <p className="mt-1 text-sm font-semibold text-gray-700">
                {s.label}
              </p>
              <p className="mt-1 text-xs text-gray-400">{s.sub}</p>
            </div>
          ))}
        </div>

        <p className="mt-6 text-[11px] text-gray-400 text-center">
          UNEP 2023 &middot; Ellen MacArthur Foundation &middot; EPA &middot;
          ThredUp Resale Report &middot; Water Footprint Network
        </p>
      </section>

      {/* ═══════════════════ THE INNOVATION ═══════════════════ */}
      <section className="bg-indigo-600 text-white py-16 sm:py-20">
        <div className="max-w-5xl mx-auto px-6">
          <p className="text-sm font-semibold uppercase tracking-widest text-indigo-200 text-center">
            The innovation:
          </p>
          <h2 className="mt-3 text-3xl sm:text-5xl font-black tracking-tight text-center leading-tight">
            Point a camera, get a listing
          </h2>

          <div className="grid md:grid-cols-2 gap-8 mt-12">
            {/* Before */}
            <div>
              <h3 className="text-sm font-bold text-indigo-300 uppercase tracking-wide mb-5">
                Before Gemini AI vision
              </h3>
              <div className="space-y-3">
                {[
                  { label: "Every item is one-of-a-kind", detail: "No barcodes, no SKUs, no product database" },
                  { label: "Manual entry: ~2 min per item", detail: "Impossible at thrift-store volume" },
                  { label: "Staff aren't technical", detail: "Most small business owners aren't tech-savvy" },
                  { label: "Thousands of items per week", detail: "Inventory turns over constantly" },
                ].map((row) => (
                  <div
                    key={row.label}
                    className="flex items-start gap-3 bg-white/5 rounded-lg px-4 py-3 border border-white/10"
                  >
                    <span className="text-coral-400 font-bold text-lg leading-none mt-0.5">✕</span>
                    <div>
                      <p className="font-medium text-sm">{row.label}</p>
                      <p className="text-xs text-indigo-300 mt-0.5">{row.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Now */}
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wide mb-5">
                Now, using SecondWind
              </h3>
              <div className="space-y-3">
                {[
                  { label: "Multi-image AI extraction", detail: "Item + tag photos analyzed together by Gemini 2.5 Flash" },
                  { label: "<5 seconds per item", detail: "Brand, size, material, color, condition: structured and searchable" },
                  { label: "Any phone, zero training", detail: "If you can take a photo, you can digitize your store" },
                  { label: "Fits the existing workflow", detail: "Snap 2 pics during donation intake; no extra steps" },
                ].map((row) => (
                  <div
                    key={row.label}
                    className="flex items-start gap-3 bg-white/15 rounded-lg px-4 py-3 border border-white/20"
                  >
                    <span className="text-white font-bold text-lg leading-none mt-0.5">✓</span>
                    <div>
                      <p className="font-medium text-sm">{row.label}</p>
                      <p className="text-xs text-indigo-200 mt-0.5">{row.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════ IMPACT PER ITEM ═══════════════════ */}
      <section className="bg-gray-50 py-16 sm:py-20">
        <div className="max-w-5xl mx-auto px-6">
          <p className="text-sm font-semibold uppercase tracking-widest text-indigo-600 text-center">
            Measurable impact
          </p>
          <h2 className="mt-3 text-3xl sm:text-4xl font-black text-gray-900 tracking-tight text-center max-w-3xl mx-auto">
            Every item bought secondhand is manufacturing that never happens.
          </h2>
          <p className="mt-3 text-sm text-gray-500 text-center max-w-xl mx-auto">
            Environmental cost per new item, based on peer-reviewed lifecycle data:
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-10">
            {[
              {
                item: "T-Shirt",
                co2: "6.5 kg",
                water: "2,700 L",
                icon: "\uD83D\uDC55",
              },
              {
                item: "Jeans",
                co2: "33.4 kg",
                water: "10,000 L",
                icon: "\uD83D\uDC56",
              },
              {
                item: "Jacket",
                co2: "35 kg",
                water: "12,000 L",
                icon: "\uD83E\uDDE5",
              },
              {
                item: "Dress",
                co2: "22 kg",
                water: "8,000 L",
                icon: "\uD83D\uDC57",
              },
              {
                item: "Shoes",
                co2: "14 kg",
                water: "4,500 L",
                icon: "\uD83D\uDC5F",
              },
              {
                item: "Furniture",
                co2: "80 kg",
                water: "20,000 L",
                icon: "\uD83D\uDECB\uFE0F",
              },
              {
                item: "Electronics",
                co2: "50 kg",
                water: "15,000 L",
                icon: "\uD83D\uDCF1",
              },
              {
                item: "Bag",
                co2: "10 kg",
                water: "3,500 L",
                icon: "\uD83D\uDC5C",
              },
            ].map((row) => (
              <div
                key={row.item}
                className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm text-center"
              >
                <p className="text-2xl mb-1">{row.icon}</p>
                <p className="font-bold text-gray-900 text-sm">{row.item}</p>
                <p className="mt-1.5 text-sm">
                  <span className="font-semibold text-red-500">{row.co2}</span>{" "}
                  CO₂ used
                </p>
                <p className="text-sm">
                  <span className="font-semibold text-blue-600">
                    {row.water}
                  </span>{" "}
                  water used
                </p>
              </div>
            ))}
          </div>

          <p className="mt-5 text-[11px] text-gray-400 text-center">
            Levi Strauss LCA &middot; MIT Materials Systems Lab &middot; WRAP UK
            &middot; Water Footprint Network &middot; WWF
          </p>
        </div>
      </section>

      {/* ═══════════════════ SUPPLY CHAIN ═══════════════════ */}
      <section className="bg-gray-950 text-white py-16 sm:py-20">
        <div className="max-w-5xl mx-auto px-6">
          <p className="text-sm font-semibold uppercase tracking-widest text-indigo-400 text-center">
            by the way
          </p>
          <h2 className="mt-3 text-3xl sm:text-4xl font-black tracking-tight text-center">
            Your new shirt traveled 8,000 miles to get to you.
          </h2>
          <p className="mt-3 text-base text-gray-400 text-center max-w-xl mx-auto">          </p>

          <div className="grid md:grid-cols-2 gap-10 mt-12">
            {/* New */}
            <div>
              <h3 className="text-sm font-bold text-coral-400 uppercase tracking-wide mb-5 flex items-center gap-2">
                <Globe className="w-4 h-4" /> Buying new — ~15 kg CO₂
              </h3>
              <div className="space-y-1">
                {[
                  {
                    icon: Factory,
                    label: "Raw materials",
                    loc: "Uzbekistan / India",
                    co2: "3.5 kg",
                  },
                  {
                    icon: Factory,
                    label: "Manufacturing",
                    loc: "Bangladesh / China",
                    co2: "8 kg",
                  },
                  {
                    icon: Ship,
                    label: "Ocean freight",
                    loc: "8,000+ miles",
                    co2: "2 kg",
                  },
                  {
                    icon: Warehouse,
                    label: "Port warehouse",
                    loc: "Los Angeles",
                    co2: "0.3 kg",
                  },
                  {
                    icon: Truck,
                    label: "Regional freight",
                    loc: "LA → Phoenix, 370 mi",
                    co2: "0.7 kg",
                  },
                  {
                    icon: Truck,
                    label: "Last few miles",
                    loc: "A delivery to your door",
                    co2: "0.5 kg",
                  },
                ].map((s, i, arr) => (
                  <div key={s.label}>
                    <div className="flex items-center gap-3 bg-white/5 rounded-lg px-4 py-3 border border-white/10">
                      <s.icon className="w-4 h-4 text-coral-400 shrink-0" />
                      <span className="font-medium text-sm flex-1">
                        {s.label}
                      </span>
                      <span className="text-xs text-gray-500">{s.loc}</span>
                      <span className="text-xs font-mono font-bold text-coral-400">
                        {s.co2}
                      </span>
                    </div>
                    {i < arr.length - 1 && (
                      <div className="flex justify-center py-0.5">
                        <ArrowDown className="w-3 h-3 text-gray-700" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Secondhand */}
            <div>
              <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wide mb-5 flex items-center gap-2">
                <Recycle className="w-4 h-4" /> Buying secondhand — ~0 kg CO₂
              </h3>
              <div className="space-y-1">
                {[
                  {
                    icon: Store,
                    label: "Already exists",
                    detail: "No manufacturing needed.",
                  },
                  {
                    icon: MapPin,
                    label: "2 miles away",
                    detail: "Local thrift store in Tempe.",
                  },
                  {
                    icon: ShoppingBag,
                    label: "Walk out with it",
                    detail: "Zero packaging. Zero shipping.",
                  },
                ].map((s, i, arr) => (
                  <div key={s.label}>
                    <div className="flex items-center gap-3 bg-indigo-500/10 rounded-lg px-4 py-3 border border-indigo-500/20">
                      <s.icon className="w-4 h-4 text-indigo-400 shrink-0" />
                      <span className="font-medium text-sm flex-1">
                        {s.label}
                      </span>
                      <span className="text-xs text-gray-400">{s.detail}</span>
                    </div>
                    {i < arr.length - 1 && (
                      <div className="flex justify-center py-0.5">
                        <ArrowDown className="w-3 h-3 text-indigo-700" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════ USE CASES ═══════════════════ */}
      <section className="bg-white py-12">
        <div className="max-w-4xl mx-auto px-6">
          <div className="grid grid-cols-3 gap-4 text-center">
            {[
              { icon: ShoppingBag, label: "Browse", detail: "Scroll everything from your couch" },
              { icon: Tag, label: "Search", detail: "Red dress, size M, under $15" },
              { icon: MapPin, label: "Scout", detail: "Check stores in a city before you visit" },
            ].map((m) => (
              <div key={m.label}>
                <m.icon className="w-5 h-5 text-indigo-500 mx-auto mb-2" />
                <p className="font-bold text-sm text-gray-900">{m.label}</p>
                <p className="text-xs text-gray-500 mt-0.5">{m.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ CLOSER ═══════════════════ */}
      <section className="bg-gray-50 py-16 sm:py-20">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
            People already want to buy secondhand.
            <br />
            <span className="text-indigo-600">Let's help them.</span>
          </h2>
          <div className="mt-8">
            <Link
              href="/"
              className="inline-block px-7 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-colors"
            >
              See it live
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────── */}
      <footer className="bg-gray-950 border-t border-white/10 text-gray-500 text-xs py-6">
        <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Wind className="w-4 h-4 text-indigo-500" />
            <span>SecondWind</span>
          </div>
          <p>InnovationHacks 2026 &middot; Tempe, AZ</p>
        </div>
      </footer>
    </div>
  );
}
