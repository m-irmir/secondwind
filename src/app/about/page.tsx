"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Wind,
  Zap,
  Droplets,
  Truck,
  Camera,
  Brain,
  Store,
  ShoppingBag,
  Leaf,
  TrendingUp,
  ArrowRight,
  Sparkles,
  Globe,
  Recycle,
  BarChart3,
  CheckCircle2,
} from "lucide-react";
import { Item } from "@/lib/types";
import { getCarbonSavings } from "@/lib/carbon";

export default function AboutPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/items?includeSold=true")
      .then((r) => r.json())
      .then((data) => {
        setItems(data);
        setLoading(false);
      });
  }, []);

  // Compute real stats from actual inventory
  const totalItems = items.length;
  const totalStores = new Set(items.map((i) => i.store.id)).size;
  const totalCo2 = items.reduce((s, i) => s + (i.carbonSavings?.co2Kg ?? 0), 0);
  const totalWater = items.reduce(
    (s, i) => s + (i.carbonSavings?.waterLiters ?? 0),
    0
  );
  const totalShipping = items.reduce(
    (s, i) => s + (i.carbonSavings?.shippingCo2Kg ?? 0),
    0
  );
  const avgPrice =
    totalItems > 0
      ? items.reduce((s, i) => s + i.price, 0) / totalItems
      : 0;
  const categories = new Set(items.map((i) => i.type)).size;

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-20 w-96 h-96 bg-coral-400 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-5xl mx-auto px-6 py-20 sm:py-28 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/15 backdrop-blur rounded-full text-sm font-medium mb-6">
            <Leaf className="w-4 h-4" />
            Built for EarthHack @ ASU
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
            Every secondhand purchase is a{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-orange-400">
              vote for the planet
            </span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-indigo-100 max-w-2xl mx-auto leading-relaxed">
            SecondWind uses AI-powered computer vision to digitize thrift store
            inventory — making it browsable, searchable, and measurable. We turn
            hidden secondhand gems into visible, accessible choices.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-indigo-700 font-semibold rounded-xl hover:bg-indigo-50 transition-colors"
            >
              Browse Items <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/employee"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/15 backdrop-blur text-white font-semibold rounded-xl hover:bg-white/25 transition-colors border border-white/20"
            >
              Employee Demo <Store className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Live Impact Stats */}
      <section className="relative -mt-12 z-10 max-w-5xl mx-auto px-6">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <h2 className="text-sm font-semibold text-indigo-600 uppercase tracking-wider text-center mb-6">
            Live Impact — Computed from Real Inventory
          </h2>
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="animate-pulse text-center">
                  <div className="h-8 bg-gray-200 rounded w-20 mx-auto mb-2" />
                  <div className="h-4 bg-gray-100 rounded w-24 mx-auto" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <StatCard
                icon={<Zap className="w-6 h-6 text-amber-500" />}
                value={`${Math.round(totalCo2).toLocaleString()} kg`}
                label="CO₂ Manufacturing Emissions Avoided"
                sublabel="From lifecycle assessments (Levi's, WRAP UK)"
              />
              <StatCard
                icon={<Droplets className="w-6 h-6 text-blue-500" />}
                value={`${Math.round(totalWater / 1000).toLocaleString()}k L`}
                label="Water Saved"
                sublabel="WWF & Water Footprint Network data"
              />
              <StatCard
                icon={<Truck className="w-6 h-6 text-green-600" />}
                value={`${Math.round(totalShipping)} kg`}
                label="Shipping CO₂ Avoided"
                sublabel="Local pickup vs. new online orders"
              />
              <StatCard
                icon={<Recycle className="w-6 h-6 text-indigo-600" />}
                value={totalItems.toString()}
                label="Items Digitized"
                sublabel={`Across ${totalStores} Tempe stores`}
              />
            </div>
          )}
          <p className="text-xs text-gray-400 text-center mt-6">
            Stats represent manufacturing footprint avoided when consumers buy
            these items secondhand instead of new. Sources: Levi Strauss LCA
            (2019), WRAP UK (2017), ThredUp Resale Report (2023), MIT Materials
            Systems Lab, Water Footprint Network.
          </p>
        </div>
      </section>

      {/* The Problem */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">
              The $200B secondhand market has a discovery problem
            </h2>
            <div className="mt-6 space-y-4 text-gray-600 leading-relaxed">
              <p>
                <strong className="text-gray-900">92 million tons</strong> of
                textile waste end up in landfills every year. Meanwhile, thrift
                stores overflow with perfectly good items that never find a
                buyer — because nobody knows they exist.
              </p>
              <p>
                Online resale platforms like Poshmark and ThredUp work for
                individual sellers, but{" "}
                <strong className="text-gray-900">
                  brick-and-mortar secondhand stores
                </strong>{" "}
                — the backbone of the circular economy — still operate with
                zero digital presence. Their inventory is invisible online.
              </p>
              <p>
                The result? Consumers default to fast fashion, not because they
                don&apos;t care, but because they{" "}
                <strong className="text-gray-900">
                  can&apos;t see what&apos;s available
                </strong>
                .
              </p>
            </div>
          </div>
          <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-8 border border-red-100">
            <h3 className="font-bold text-gray-900 mb-4">By the Numbers</h3>
            <div className="space-y-3">
              <ProblemStat value="92M tons" label="textile waste annually worldwide" />
              <ProblemStat
                value="73%"
                label="of clothing produced ends up in landfills or incinerated"
              />
              <ProblemStat
                value="10%"
                label="of global carbon emissions from the fashion industry"
              />
              <ProblemStat
                value="<1%"
                label="of thrift store inventory is browsable online"
              />
            </div>
            <p className="text-xs text-gray-400 mt-4">
              Sources: Ellen MacArthur Foundation, UNEP Fashion&apos;s Environmental
              Impact Report
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-900">
              How SecondWind Works
            </h2>
            <p className="mt-3 text-gray-500 max-w-xl mx-auto">
              From phone camera to searchable listing in under 30 seconds — no
              manual data entry, no barcodes, no SKU systems needed.
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            <StepCard
              step={1}
              icon={<Camera className="w-7 h-7" />}
              title="Snap Photos"
              desc="Employee takes a photo of the item plus any tags or labels"
            />
            <StepCard
              step={2}
              icon={<Brain className="w-7 h-7" />}
              title="AI Extracts Data"
              desc="Gemini 2.5 Flash analyzes all images together — type, brand, size, color, condition, material"
            />
            <StepCard
              step={3}
              icon={<Store className="w-7 h-7" />}
              title="Review & Publish"
              desc="Employee reviews AI results, adjusts if needed, sets price, and publishes in one tap"
            />
            <StepCard
              step={4}
              icon={<ShoppingBag className="w-7 h-7" />}
              title="Consumers Browse"
              desc="Items appear instantly — filterable by category, size, color, distance, and store"
            />
          </div>
        </div>
      </section>

      {/* Innovation & Technical Execution */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold text-gray-900">
            What Makes SecondWind Different
          </h2>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <FeatureCard
            icon={<Sparkles className="w-6 h-6 text-indigo-600" />}
            title="Multi-Image AI Analysis"
            desc="Most digitization tools process a single photo. SecondWind sends the item photo AND tag/label photos to Gemini together — extracting brand, material composition, and size from sources the camera can see but a single-image model would miss."
          />
          <FeatureCard
            icon={<BarChart3 className="w-6 h-6 text-indigo-600" />}
            title="Per-Item Carbon Accounting"
            desc="Every item shows its specific environmental impact — CO₂, water, and shipping emissions avoided — computed from peer-reviewed lifecycle data. Not generic slogans, but real numbers tied to real research."
          />
          <FeatureCard
            icon={<Globe className="w-6 h-6 text-indigo-600" />}
            title="Geolocation-Aware Browsing"
            desc="Haversine-distance filtering lets consumers find items near them. Buying local secondhand eliminates shipping emissions entirely — and we quantify exactly how much."
          />
          <FeatureCard
            icon={<TrendingUp className="w-6 h-6 text-indigo-600" />}
            title="Zero Infrastructure for Stores"
            desc="No POS integration, no barcode scanners, no training. An employee with a phone camera can digitize inventory immediately. That's how you actually reach the thousands of small thrift stores that need this."
          />
        </div>
      </section>

      {/* Environmental Impact Deep Dive */}
      <section className="bg-indigo-600 text-white py-20">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold">
              Measurable Environmental Impact
            </h2>
            <p className="mt-3 text-indigo-200 max-w-2xl mx-auto">
              SecondWind doesn&apos;t just claim impact — it quantifies it. Every
              item in our system has source-backed environmental data attached.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <ImpactCard
              title="Manufacturing Avoided"
              desc="Each secondhand purchase means one fewer new item manufactured. A single pair of jeans requires 33.4 kg of CO₂ and 10,000 liters of water to produce. We track and display this for every item category."
              source="Levi Strauss LCA, WRAP UK"
            />
            <ImpactCard
              title="Local > Shipped"
              desc="Buying from a local thrift store eliminates last-mile delivery emissions entirely. For furniture, that's up to 25 kg CO₂ per item. SecondWind makes local secondhand visible so consumers can choose it."
              source="UPS/FedEx lifecycle data"
            />
            <ImpactCard
              title="Landfill Diversion"
              desc="Items that sell secondhand stay out of landfills. With 73% of clothing ending up incinerated or buried, every successful secondhand transaction directly reduces waste volume."
              source="Ellen MacArthur Foundation"
            />
          </div>
        </div>
      </section>

      {/* Feasibility & Scalability */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">
              Built to Scale
            </h2>
            <p className="mt-4 text-gray-600 leading-relaxed">
              SecondWind is designed to be practical today and scalable
              tomorrow. The architecture is deliberately simple — because
              adoption matters more than technical complexity.
            </p>
            <div className="mt-8 space-y-4">
              <FeasibilityItem text="Works with any phone camera — no special hardware" />
              <FeasibilityItem text="30-second listing flow — minimal employee training" />
              <FeasibilityItem text="Gemini API handles the heavy lifting — no custom ML models to maintain" />
              <FeasibilityItem text="Vercel deployment with auto-scaling — handles traffic spikes" />
              <FeasibilityItem text="Flat-file MVP → Postgres migration path for production" />
              <FeasibilityItem text="4 real Tempe stores already onboarded as demo partners" />
            </div>
          </div>
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-8 border border-indigo-100">
            <h3 className="font-bold text-gray-900 mb-4">
              Scaling Roadmap
            </h3>
            <div className="space-y-5">
              <RoadmapItem
                phase="Now"
                title="Working MVP"
                items={[
                  `${totalItems} items across ${totalStores} stores`,
                  "AI extraction, filtering, carbon tracking",
                  "Employee dashboard with sold workflow",
                ]}
              />
              <RoadmapItem
                phase="Next"
                title="Production Ready"
                items={[
                  "Postgres + proper auth",
                  "Store analytics dashboard",
                  "Push notifications for saved searches",
                ]}
              />
              <RoadmapItem
                phase="Future"
                title="Marketplace"
                items={[
                  "Multi-city expansion",
                  "In-app checkout + hold system",
                  "Aggregated impact reports for stores",
                ]}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-10">
            Tech Stack
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <TechBadge name="Next.js 16" detail="App Router + React 19" />
            <TechBadge name="TypeScript" detail="End-to-end type safety" />
            <TechBadge name="Gemini 2.5 Flash" detail="Multi-image vision AI" />
            <TechBadge name="Tailwind CSS v4" detail="Utility-first styling" />
            <TechBadge name="Vercel" detail="Edge deployment + Blob storage" />
            <TechBadge name="Haversine" detail="Real geolocation filtering" />
            <TechBadge name="Vercel Blob" detail="Image + data persistence" />
            <TechBadge name="lucide-react" detail="Icon system" />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-5xl mx-auto px-6 py-20 text-center">
        <h2 className="text-3xl font-bold text-gray-900">
          See it in action
        </h2>
        <p className="mt-4 text-gray-500 max-w-lg mx-auto">
          Browse {totalItems} real items from {totalStores} Tempe thrift stores,
          or try the employee flow to see how AI-powered digitization works.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors"
          >
            Browse Items <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/employee"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-800 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
          >
            Try Employee Demo <Store className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}

// --- Sub-components ---

function StatCard({
  icon,
  value,
  label,
  sublabel,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
  sublabel: string;
}) {
  return (
    <div className="text-center">
      <div className="flex justify-center mb-2">{icon}</div>
      <div className="text-2xl sm:text-3xl font-extrabold text-gray-900">
        {value}
      </div>
      <div className="text-sm font-medium text-gray-700 mt-1">{label}</div>
      <div className="text-xs text-gray-400 mt-0.5">{sublabel}</div>
    </div>
  );
}

function ProblemStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex items-baseline gap-3">
      <span className="text-2xl font-extrabold text-red-600 shrink-0">
        {value}
      </span>
      <span className="text-sm text-gray-600">{label}</span>
    </div>
  );
}

function StepCard({
  step,
  icon,
  title,
  desc,
}: {
  step: number;
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="relative bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
      <div className="absolute -top-3 -left-3 w-7 h-7 bg-indigo-600 text-white text-sm font-bold rounded-full flex items-center justify-center">
        {step}
      </div>
      <div className="text-indigo-600 mb-3">{icon}</div>
      <h3 className="font-bold text-gray-900">{title}</h3>
      <p className="mt-1 text-sm text-gray-500">{desc}</p>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
      <div className="mb-3">{icon}</div>
      <h3 className="font-bold text-gray-900">{title}</h3>
      <p className="mt-2 text-sm text-gray-500 leading-relaxed">{desc}</p>
    </div>
  );
}

function ImpactCard({
  title,
  desc,
  source,
}: {
  title: string;
  desc: string;
  source: string;
}) {
  return (
    <div className="bg-white/10 backdrop-blur rounded-xl p-6 border border-white/20">
      <h3 className="font-bold text-lg">{title}</h3>
      <p className="mt-2 text-sm text-indigo-100 leading-relaxed">{desc}</p>
      <p className="mt-3 text-xs text-indigo-300">Source: {source}</p>
    </div>
  );
}

function FeasibilityItem({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-3">
      <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
      <span className="text-gray-700 text-sm">{text}</span>
    </div>
  );
}

function RoadmapItem({
  phase,
  title,
  items,
}: {
  phase: string;
  title: string;
  items: string[];
}) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-1">
        <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-100 px-2 py-0.5 rounded">
          {phase}
        </span>
        <span className="font-semibold text-gray-900">{title}</span>
      </div>
      <ul className="ml-12 space-y-0.5">
        {items.map((item, i) => (
          <li key={i} className="text-sm text-gray-500">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function TechBadge({ name, detail }: { name: string; detail: string }) {
  return (
    <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm text-center">
      <div className="font-bold text-gray-900 text-sm">{name}</div>
      <div className="text-xs text-gray-400 mt-0.5">{detail}</div>
    </div>
  );
}
