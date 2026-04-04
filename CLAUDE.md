@AGENTS.md

# SecondWind

AI-powered platform that digitizes physical secondhand store inventory using computer vision, making it browsable and searchable online — increasing secondhand sell-through rates and reducing textile waste.

**Context:** Built for a sustainability-focused hackathon at ASU (Tempe, AZ). Prioritize demo polish and impact over production robustness.

**Deployment:** Live on Vercel via GitHub (m-irmir/secondwind). Auto-deploys on push to main.

## Quick Start

```bash
npm install
npm run dev        # runs on http://localhost:3000
```

Set your Gemini API key in `.env.local`:
```
GEMINI_API_KEY=your_key_here
```

The app works without a key — the upload flow will show an error but still let users fill in item details manually. Seed data (50 items across 4 Tempe stores) is pre-loaded.

## Tech Stack

- **Framework:** Next.js 16 (App Router) + TypeScript
- **Styling:** Tailwind CSS v4 — indigo/coral theme (NOT earthy/leaf — intentionally modern and bold)
- **Icons:** lucide-react
- **Vision AI:** Google Gemini 2.5 Flash via `@google/generative-ai`
- **Data:** Flat JSON — stores.json is static; items.json uses Vercel Blob on prod (`BLOB_READ_WRITE_TOKEN`), filesystem locally. Thin abstraction in `src/lib/db.ts`
- **Images:** Uploaded to Vercel Blob on prod, `public/uploads/` locally. Client-side compression to stay under Vercel's 4.5MB body limit. Seed items use color gradient placeholders

## Architecture

```
Phone Camera → Upload → Gemini Vision API → Structured JSON → items.json → Consumer Web App
                                                                          → Employee Dashboard
```

### Data Flow
1. Store employee logs in at `/employee` (mock PIN auth) → accesses dashboard
2. Employee uploads photo via `/upload` (or from dashboard "Add Item")
3. Employee uploads item photo + optional tag/label photos via `/upload` (or from dashboard "Add Item")
4. Images compressed client-side, sent to `/api/process-image` → saved to Vercel Blob (prod) or disk (local) + sent to Gemini
5. Gemini analyzes ALL photos together → returns structured extraction (type, brand, size, color, condition, material, etc.)
6. Employee reviews/edits AI results, sets price (store pre-selected from dashboard)
7. Published via `POST /api/items` → prepended to `data/items.json`
8. Consumers browse at `/`, filter, search, favorite, view detail at `/item/[id]`

### Key Design Decisions
- **Mock employee auth** — PIN-based login (all PINs are "1234") scoped to a store. Session stored in localStorage. Consumer/employee views are separated.
- **Favorites are a simple counter** — no user tracking, POST increments server-side
- **Carbon savings** — lookup table in `src/lib/carbon.ts` based on item type (sources: ThredUp, WRAP UK). Three stats: CO₂ saved, water saved, shipping CO₂ avoided. Supports clothing, furniture, electronics, and home goods. Framed as "if you bought this new instead..."
- **4 real Tempe, AZ stores** near ASU — Habitat for Humanity ReStore (furniture, electronics, shoes), Buffalo Exchange (curated fashion), Savers and Goodwill (volume secondhand)
- **Sold workflow:** Employees mark items sold from their dashboard. Consumers see "Check Availability" button (demo toast). Sold items stay visible in employee inventory but hidden from consumer browse.
- **Multi-image upload** — item photo + tag/label photos analyzed together by Gemini for better extraction
- **Gemini failure is graceful** — photos still save, user can fill in fields manually
- **Vercel Blob storage** — items.json and uploaded images stored in Vercel Blob on prod (auto-seeds from bundled items.json on first read). Falls back to filesystem locally. Client-side Canvas compression keeps payloads under 4.5MB
- **Shared store constant** — `src/lib/stores.ts` is the single source of truth for store data, imported by both client components and server API

## File Structure

```
src/
├── app/
│   ├── page.tsx                    # Browse feed — grid + dropdown filters + search
│   ├── layout.tsx                  # Root layout with Header
│   ├── globals.css                 # Tailwind theme (indigo/coral palette)
│   ├── item/[id]/page.tsx          # Item detail — photo, tags, carbon badge, store, check availability
│   ├── upload/page.tsx             # Two-step: photo upload → review AI extraction → publish
│   ├── employee/
│   │   ├── page.tsx                # Employee login (store selector + PIN)
│   │   └── dashboard/page.tsx      # Store inventory management, mark sold, stats
│   └── api/
│       ├── items/route.ts          # GET (list + filter + search + sort + includeSold) / POST (create)
│       ├── items/[id]/route.ts     # GET (single) / PATCH (update/mark sold)
│       ├── items/[id]/favorite/route.ts  # POST (increment counter)
│       ├── stores/route.ts         # GET (list stores)
│       └── process-image/route.ts  # POST (upload image → Gemini → structured JSON)
├── components/
│   ├── Header.tsx                  # Logo, search toggle, Employee link, "Add Item" CTA
│   ├── ItemCard.tsx                # Card with gradient placeholder or real photo
│   ├── ItemGrid.tsx                # Responsive 2/3/4-col grid
│   ├── FilterBar.tsx               # Dropdown selects: distance, category, size, color, store, sort
│   ├── FavoriteButton.tsx          # Heart + counter with optimistic update
│   ├── CarbonBadge.tsx             # CO₂, water, and shipping CO₂ savings display
│   ├── PhotoUpload.tsx             # Multi-image upload (item + tag photos) with client-side compression
│   └── ItemForm.tsx                # Review/edit form for AI-extracted data (accepts preSelectedStoreId)
└── lib/
    ├── types.ts                    # Item, Store, CarbonSavings, GeminiExtractionResult
    ├── stores.ts                   # Shared STORES constant (single source of truth)
    ├── db.ts                       # getItems, getItem, createItem, updateItem, getStores
    ├── carbon.ts                   # getCarbonSavings(type) — lookup table (clothing + furniture + electronics + home)
    └── gemini.ts                   # extractItemData(images[]) — Gemini 2.5 Flash multi-image analysis
data/
├── items.json                      # ~50 seed items (clothing, furniture, electronics, home goods)
└── stores.json                     # 4 Tempe, AZ stores near ASU
```

## API Reference

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/items?type=&size=&color=&store=&q=&sort=&radius=&includeSold=` | List/filter/search items |
| POST | `/api/items` | Create item (JSON body) |
| GET | `/api/items/[id]` | Get single item |
| PATCH | `/api/items/[id]` | Update item (e.g. mark sold) |
| POST | `/api/items/[id]/favorite` | Increment favorites counter |
| GET | `/api/stores` | List all stores |
| POST | `/api/process-image` | Upload images (FormData, multiple), returns Gemini extraction + saved photo paths |

## Visual Design

- **NOT earthy/green/leaf** — intentionally modern: deep indigo `#4F46E5` primary, warm coral `#F97066` accent
- Clean white cards on `#FAFAFA` background
- Inter font, tight spacing
- Carbon stats use bold typography + icons (Zap, Droplets), not nature imagery
- Photo-forward cards with condition badges and favorite counters
- Seed items display as color gradients (based on item colors) — real photos come from uploads
- Filter bar uses clean dropdown selects (distance, category, size, color, store, sort)

## Known Limitations (MVP/Demo)

- `items.json` has no concurrent write protection — fine for demo, not for production
- Items.json on Vercel Blob has no concurrent write protection — fine for demo, not for production
- Client-side compression helps but very large images may still approach limits
- Search is basic substring matching (no fuzzy/semantic)
- Radius filtering is UI-only (stores are hardcoded, no actual geolocation)
- Employee auth is localStorage-only (trivially bypassable, demo-appropriate)
- Gemini extraction quality depends on photo quality — UI guides users to include tag photos

## Next Steps (Post-Hackathon)

- SQLite or Postgres for proper data persistence
- Image optimization pipeline (sharp/cloudinary)
- Real geolocation with browser API + Haversine distance
- Real employee auth (OAuth, store-scoped roles)
- User accounts + saved favorites
- Store dashboard with inventory analytics
- Push notifications for new items matching saved searches
- Semantic search with embeddings
