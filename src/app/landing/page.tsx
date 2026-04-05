"use client";

import {
  Wind,
  Factory,
  Ship,
  Warehouse,
  Truck,
  MapPin,
  ArrowDown,
  Zap,
  Droplets,
  Flame,
  Recycle,
  Camera,
  Sparkles,
  Store,
  ShoppingBag,
  Trash2,
  Globe,
  TrendingDown,
  ChevronRight,
  Users,
  Scaling,
} from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
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
            AI-powered inventory that turns any thrift store into a browsable, searchable online catalog — in seconds,
            with zero technical skill required.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/"
              className="px-7 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-colors"
            >
              See the Live Demo
            </Link>
            <Link
              href="/employee"
              className="px-7 py-3 border border-gray-700 hover:border-gray-500 text-gray-300 hover:text-white font-semibold rounded-xl transition-colors"
            >
              Try the Employee Flow
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════ THE PROBLEM — hard numbers ═══════════════════ */}
      <section className="max-w-6xl mx-auto px-6 py-16 sm:py-20">
        <p className="text-sm font-semibold uppercase tracking-widest text-coral-500 text-center">
          The problem
        </p>
        <h2 className="mt-3 text-3xl sm:text-4xl font-black text-gray-900 tracking-tight text-center max-w-3xl mx-auto">
          The textile industry produces more emissions than aviation and shipping combined.
        </h2>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-10">
          {[
            { n: "8–10%", label: "of global CO₂ emissions", sub: "From textiles alone.", icon: Flame },
            { n: "92M", label: "tons of textile waste / yr", sub: "A garbage truck every second.", icon: Trash2 },
            { n: "70–90%", label: "of donated clothes wasted", sub: "Landfilled or shipped overseas.", icon: TrendingDown },
            { n: "10,000L", label: "of water per pair of jeans", sub: "What you drink in 9 years.", icon: Droplets },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <s.icon className="w-5 h-5 text-coral-500 mb-3" />
              <p className="text-3xl sm:text-4xl font-black text-gray-900">{s.n}</p>
              <p className="mt-1 text-sm font-semibold text-gray-700">{s.label}</p>
              <p className="mt-1 text-xs text-gray-400">{s.sub}</p>
            </div>
          ))}
        </div>

        <p className="mt-6 text-[11px] text-gray-400 text-center">
          UNEP 2023 &middot; Ellen MacArthur Foundation &middot; EPA &middot; ThredUp Resale Report &middot; Water Footprint Network
        </p>
      </section>

      {/* ═══════════════════ THE INNOVATION ═══════════════════ */}
      <section className="bg-indigo-600 text-white py-16 sm:py-20">
        <div className="max-w-5xl mx-auto px-6">
          <p className="text-sm font-semibold uppercase tracking-widest text-indigo-200 text-center">
            The innovation
          </p>
          <h2 className="mt-3 text-3xl sm:text-5xl font-black tracking-tight text-center max-w-3xl mx-auto leading-tight">
            Online cataloguing for secondhand stores has been impossible... until NOW.
          </h2>
          <p className="mt-4 text-sm text-indigo-200 max-w-xl mx-auto text-center">
            Thrift stores are small businesses, often run by people who aren&apos;t tech-savvy.
            SecondWind makes it braindead simple: take two pictures, and Gemini does the rest.
          </p>

          {/* 3-step flow */}
          <div className="grid sm:grid-cols-3 gap-6 mt-12">
            <div className="text-center">
              <div className="w-14 h-14 mx-auto bg-white/20 rounded-2xl flex items-center justify-center mb-3">
                <Camera className="w-7 h-7" />
              </div>
              <p className="text-xl font-black">Snap the item + tags</p>
              <p className="mt-1 text-xs text-indigo-200">
                Any phone. Upload existing pics or take new ones.
              </p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 mx-auto bg-white/20 rounded-2xl flex items-center justify-center mb-3">
                <Sparkles className="w-7 h-7" />
              </div>
              <p className="text-xl font-black">Gemini extracts everything</p>
              <p className="mt-1 text-xs text-indigo-200">
                Brand, size, color, material, condition, price — in milliseconds.
              </p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 mx-auto bg-white/20 rounded-2xl flex items-center justify-center mb-3">
                <Zap className="w-7 h-7" />
              </div>
              <p className="text-xl font-black">Review & publish</p>
              <p className="mt-1 text-xs text-indigo-200">
                Quick glance, hit publish. Instantly browsable and searchable online.
              </p>
            </div>
          </div>

          {/* Process integration + CTA */}
          <p className="mt-10 text-sm text-indigo-200 text-center">
            Fits right into the existing intake processes for donated goods:
            {" "}<span className="text-xl font-black text-white">5s</span> with SecondWind vs.
            {" "}<span className="text-xl font-black text-coral-400">2m+</span> manual entry.
          </p>

          <div className="mt-6 text-center">
            <Link
              href="/upload"
              className="inline-flex items-center gap-2 px-7 py-3 bg-white text-indigo-700 font-bold rounded-xl hover:bg-indigo-50 transition-colors"
            >
              Try it yourself
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════ IMPACT PER ITEM ═══════════════════ */}
      <section className="max-w-5xl mx-auto px-6 py-16 sm:py-20">
        <p className="text-sm font-semibold uppercase tracking-widest text-indigo-600 text-center">
          Measurable impact
        </p>
        <h2 className="mt-3 text-3xl sm:text-4xl font-black text-gray-900 tracking-tight text-center max-w-3xl mx-auto">
          Every item we sell is manufacturing that never happens.
        </h2>
        <p className="mt-3 text-sm text-gray-500 text-center max-w-xl mx-auto">
          CO₂ and water <span className="font-semibold text-gray-700">avoided</span> per secondhand item sold — peer-reviewed lifecycle data.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-10">
          {[
            { item: "T-Shirt", co2: "6.5 kg", water: "2,700 L", icon: "👕" },
            { item: "Jeans", co2: "33.4 kg", water: "10,000 L", icon: "👖" },
            { item: "Jacket", co2: "35 kg", water: "12,000 L", icon: "🧥" },
            { item: "Dress", co2: "22 kg", water: "8,000 L", icon: "👗" },
            { item: "Shoes", co2: "14 kg", water: "4,500 L", icon: "👟" },
            { item: "Furniture", co2: "80 kg", water: "20,000 L", icon: "🛋️" },
            { item: "Electronics", co2: "50 kg", water: "15,000 L", icon: "📱" },
            { item: "Bag", co2: "10 kg", water: "3,500 L", icon: "👜" },
          ].map((row) => (
            <div key={row.item} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm text-center">
              <p className="text-2xl mb-1">{row.icon}</p>
              <p className="font-bold text-gray-900 text-sm">{row.item}</p>
              <p className="mt-1.5 text-sm"><span className="font-semibold text-green-600">{row.co2}</span> CO₂ saved</p>
              <p className="text-sm"><span className="font-semibold text-blue-600">{row.water}</span> water saved</p>
            </div>
          ))}
        </div>

        <p className="mt-5 text-[11px] text-gray-400 text-center">
          Levi Strauss LCA &middot; MIT Materials Systems Lab &middot; WRAP UK &middot; Water Footprint Network &middot; WWF
        </p>
      </section>

      {/* ═══════════════════ SUPPLY CHAIN — lower, condensed ═══════════════════ */}
      <section className="bg-gray-950 text-white py-16 sm:py-20">
        <div className="max-w-5xl mx-auto px-6">
          <p className="text-sm font-semibold uppercase tracking-widest text-indigo-400 text-center">
            Isn&apos;t this insane?
          </p>
          <h2 className="mt-3 text-3xl sm:text-4xl font-black tracking-tight text-center">
            Your new shirt traveled 8,000 miles to get to you.
          </h2>
          <p className="mt-3 text-base text-gray-400 text-center max-w-xl mx-auto">
            That same shirt is sitting on a rack 2 miles away.
          </p>

          <div className="grid md:grid-cols-2 gap-10 mt-12">
            {/* New */}
            <div>
              <h3 className="text-sm font-bold text-coral-400 uppercase tracking-wide mb-5 flex items-center gap-2">
                <Globe className="w-4 h-4" /> Buying new — ~15 kg CO₂
              </h3>
              <div className="space-y-1">
                {[
                  { icon: Factory, label: "Raw materials", loc: "Uzbekistan / India", co2: "3.5 kg" },
                  { icon: Factory, label: "Manufacturing", loc: "Bangladesh / China", co2: "8 kg" },
                  { icon: Ship, label: "Ocean freight", loc: "8,000+ miles", co2: "2 kg" },
                  { icon: Warehouse, label: "Port warehouse", loc: "Los Angeles", co2: "0.3 kg" },
                  { icon: Truck, label: "Regional freight", loc: "LA → Phoenix, 370 mi", co2: "0.7 kg" },
                  { icon: Truck, label: "Last few miles", loc: "A delivery to your door", co2: "0.5 kg" },
                ].map((s, i, arr) => (
                  <div key={s.label}>
                    <div className="flex items-center gap-3 bg-white/5 rounded-lg px-4 py-3 border border-white/10">
                      <s.icon className="w-4 h-4 text-coral-400 shrink-0" />
                      <span className="font-medium text-sm flex-1">{s.label}</span>
                      <span className="text-xs text-gray-500">{s.loc}</span>
                      <span className="text-xs font-mono font-bold text-coral-400">{s.co2}</span>
                    </div>
                    {i < arr.length - 1 && (
                      <div className="flex justify-center py-0.5"><ArrowDown className="w-3 h-3 text-gray-700" /></div>
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
                  { icon: Store, label: "Already exists", detail: "No manufacturing needed." },
                  { icon: MapPin, label: "2 miles away", detail: "Local thrift store in Tempe." },
                  { icon: ShoppingBag, label: "Walk out with it", detail: "Zero packaging. Zero shipping." },
                ].map((s, i, arr) => (
                  <div key={s.label}>
                    <div className="flex items-center gap-3 bg-indigo-500/10 rounded-lg px-4 py-3 border border-indigo-500/20">
                      <s.icon className="w-4 h-4 text-indigo-400 shrink-0" />
                      <span className="font-medium text-sm flex-1">{s.label}</span>
                      <span className="text-xs text-gray-400">{s.detail}</span>
                    </div>
                    {i < arr.length - 1 && (
                      <div className="flex justify-center py-0.5"><ArrowDown className="w-3 h-3 text-indigo-700" /></div>
                    )}
                  </div>
                ))}
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════ FEASIBILITY & SCALE ═══════════════════ */}
      <section className="max-w-5xl mx-auto px-6 py-16 sm:py-20">
        <p className="text-sm font-semibold uppercase tracking-widest text-indigo-600 text-center">
          Built to work today
        </p>
        <h2 className="mt-3 text-3xl sm:text-4xl font-black text-gray-900 tracking-tight text-center max-w-2xl mx-auto">
          No new hardware. No training. Just a phone and a browser.
        </h2>

        <div className="grid sm:grid-cols-3 gap-5 mt-10">
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm text-center">
            <Users className="w-6 h-6 text-indigo-600 mx-auto mb-3" />
            <p className="font-bold text-gray-900">Built for real people</p>
            <p className="mt-2 text-sm text-gray-500">
              Most thrift stores are run by older, non-technical staff. But if you can take a photo, you can use SecondWind.
            </p>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm text-center">
            <Scaling className="w-6 h-6 text-indigo-600 mx-auto mb-3" />
            <p className="font-bold text-gray-900">Scales to any store</p>
            <p className="mt-2 text-sm text-gray-500">
              Works for a 50-item boutique or a 5,000-item Goodwill. No setup cost.
            </p>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm text-center">
            <Zap className="w-6 h-6 text-indigo-600 mx-auto mb-3" />
            <p className="font-bold text-gray-900">Works right now</p>
            <p className="mt-2 text-sm text-gray-500">
              Live with 4 Tempe stores, 50+ items, and working AI data extraction. Ready for deployment.
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════════ CTA ═══════════════════ */}
      <section className="bg-gray-950 text-white py-16 sm:py-20">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <Wind className="w-10 h-10 text-indigo-400 mx-auto mb-5" />
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
            The stuff already exists.
            <br />
            <span className="text-indigo-400">Let people find it.</span>
          </h2>
          <p className="mt-4 text-base text-gray-400 max-w-lg mx-auto">
            70–90% of donated goods get landfilled or shipped overseas because nobody knows they&apos;re there.
            SecondWind changes that.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/"
              className="px-7 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-colors"
            >
              Browse Items Near You
            </Link>
            <Link
              href="/upload"
              className="px-7 py-3 border border-gray-700 hover:border-gray-500 text-gray-300 hover:text-white font-semibold rounded-xl transition-colors"
            >
              Try the AI Upload
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
