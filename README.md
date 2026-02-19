<div align="center">

# 🅿️ SmartPark

### Intelligent Parking Lot Management System

**A fully client-side React app to manage parking slots, park vehicles with smart filtering, and track lot occupancy in real time.**

[![React](https://img.shields.io/badge/React-18.2-61DAFB?style=flat-square&logo=react&logoColor=black)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38BDF8?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

</div>

---

## 📌 Overview

SmartPark is a **Round 2 Assignment MVP** — a Smart Parking Lot Management System built entirely on the frontend with React and Tailwind CSS. It lets users define parking slots with custom features, intelligently allocate the nearest matching slot for a vehicle, and free or delete slots — all persisted via `localStorage` with zero backend needed.

The core idea: when a vehicle arrives, instead of manually searching for a free spot, the system's `ParkVehicle(needsEV, needsCover)` algorithm does it automatically — filtering by availability, EV charging requirement, and covered/indoor preference, then returning the nearest match.

---

## ✨ Features

| Feature | Description |
|---|---|
| ➕ **Add Slot** | Define a new slot with a custom ID, covered toggle, and EV charging toggle |
| 🅿️ **All Slots View** | Filterable card grid — filter by Free, Busy, EV, or Covered |
| 📋 **Data Model Table** | Sortable table showing all 4 exact schema fields per slot |
| 🚗 **Park Vehicle** | Smart `ParkVehicle(needsEV, needsCover)` algorithm allocates the best slot |
| 🔓 **Free a Slot** | Remove a vehicle from any occupied slot via dropdown |
| 🗑️ **Delete Slot** | Remove a slot from the lot with confirmation guard |
| ✏️ **Edit Slot** | Update `isCovered` and `isEVCharging` on any existing slot |
| 🔍 **Slot Detail Modal** | Full data model card + JSON preview + actions for any slot |
| 📊 **Live Stats Dashboard** | Real-time Total / Available / Occupied / Occupancy% with dynamic capacity bar |
| 💾 **Persistent Storage** | All data saved to `localStorage` — survives page refreshes |

---

## 🧠 Core Algorithm — `ParkVehicle`

The heart of the system lives in `src/utils/parkingLogic.js`:

```js
function ParkVehicle(slots, needsEV, needsCover) {

  // Step 1 — Filter out all occupied slots
  const available = slots.filter(s => !s.isOccupied)

  if (available.length === 0) {
    return { slot: null, message: 'Parking lot is completely full.' }
  }

  // Step 2 — Apply user preference filters
  const matching = available.filter(s => {
    const evOk    = needsEV    ? s.isEVCharging : true
    const coverOk = needsCover ? s.isCovered    : true
    return evOk && coverOk
  })

  if (matching.length === 0) {
    return { slot: null, message: 'No slot with required features found.' }
  }

  // Step 3 — Allocate nearest slot (first in sorted order)
  const allocated = matching[0]
  return { slot: allocated, message: `Slot ${allocated.slotNo} allocated!` }
}
```

**Logic walkthrough:**
- If `needsEV = false` and `needsCover = false` → returns the first available slot, no filter applied
- If `needsEV = true` → only considers slots where `isEVCharging === true`
- If `needsCover = true` → only considers slots where `isCovered === true`
- Both can be `true` simultaneously for a slot with both features
- Slots are pre-sorted by `slotNo` (numeric first, then alphanumeric) before the function runs — so "nearest" means lowest slot number

---

## 📐 Data Model

Every parking slot object follows this exact schema:

```ts
{
  slotNo:      string    // Unique slot identifier e.g. "A1", "B3", "101"
  isCovered:   boolean   // true = indoor / covered parking
  isEVCharging: boolean  // true = EV charging station available
  isOccupied:  boolean   // true = a vehicle is currently parked here
}
```

> `isOccupied` is the only field the system controls automatically.  
> `slotNo`, `isCovered`, and `isEVCharging` are set by the user when adding or editing a slot.

---

## 🗂️ Project Structure

```
smart-parking/
│
├── index.html                  ← Entry HTML, loads Google Fonts, mounts React
├── package.json                ← Dependencies & npm scripts
├── vite.config.js              ← Vite build config with React plugin
├── tailwind.config.js          ← Custom colour palette, fonts, animations, safelist
├── postcss.config.js           ← PostCSS pipeline (Tailwind + Autoprefixer)
├── .gitignore                  ← Ignores node_modules, dist, .env, OS files
├── README.md                   ← You are here
│
└── src/
    ├── main.jsx                ← React root — mounts <App /> into #root
    ├── App.jsx                 ← Root component — wires tabs, modal, all state
    ├── index.css               ← Tailwind directives + custom utility classes
    │
    ├── components/
    │   ├── Header.jsx          ← Live stats bar + dynamic occupancy progress bar
    │   ├── TabNav.jsx          ← 4-tab navigation (Slots / Data Model / Add / Park)
    │   ├── AddSlotForm.jsx     ← Create slot form with live preview card
    │   ├── SlotGrid.jsx        ← Filterable slot cards with Free / Delete / View
    │   ├── ParkVehiclePanel.jsx← ParkVehicle UI + Free a Slot dropdown
    │   ├── SlotDetailModal.jsx ← Full modal: data model view, edit toggles, actions
    │   ├── DataModelBadge.jsx  ← Reusable: renders all 4 fields (inline/card/table)
    │   └── DataModelTable.jsx  ← Sortable table view with schema legend
    │
    ├── hooks/
    │   └── useParking.js       ← All state + localStorage: add/park/free/delete/update
    │
    └── utils/
        └── parkingLogic.js     ← ParkVehicle() · sortSlots() · getParkingStats() · isSlotNumberTaken()
```

---

## 🛠️ Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| [React](https://reactjs.org/) | 18.2 | UI framework — components, hooks, state |
| [Vite](https://vitejs.dev/) | 5.0 | Build tool & blazing-fast dev server |
| [Tailwind CSS](https://tailwindcss.com/) | 3.4 | Utility-first styling |
| [PostCSS](https://postcss.org/) | 8.4 | CSS build pipeline |
| [Autoprefixer](https://github.com/postcss/autoprefixer) | 10.4 | Cross-browser vendor prefixes |
| localStorage | Native | Client-side data persistence |

> **No backend. No database. No external API.** Fully self-contained frontend.

---

## ⚙️ Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- npm v9 or higher

### Installation & Run

```bash
# 1. Clone the repository
git clone https://github.com/your-username/smart-parking.git
cd smart-parking

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
# → Opens at http://localhost:5173
```

### Build for Production

```bash
npm run build
# Output → dist/

npm run preview
# Preview the production build locally
```

---

## 🚀 Deployment

The app is fully static — deploy the `dist/` folder anywhere.

### Vercel (Recommended)

```bash
npm install -g vercel
vercel
```

### Netlify

```bash
npm run build
# Drag and drop the dist/ folder at netlify.com/drop
```

### GitHub Pages

```bash
# Add to vite.config.js: base: '/smart-parking/'
npm run build
# Push dist/ to gh-pages branch
```

---

## 📋 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server at `localhost:5173` with hot reload |
| `npm run build` | Build optimised production bundle to `dist/` |
| `npm run preview` | Serve the production build locally for testing |

---

## 🎨 Design System

SmartPark uses a custom **dark industrial** theme — built for a techy, high-contrast feel.

### Colour Palette

| Token | Hex | Used For |
|---|---|---|
| `parking-bg` | `#0a0a0f` | Page background |
| `parking-surface` | `#12121a` | Input fields, secondary surfaces |
| `parking-card` | `#1a1a26` | Card backgrounds |
| `parking-accent` | `#6ee7f7` | Primary CTA, highlights, active states |
| `parking-green` | `#4ade80` | Available slots, success states |
| `parking-red` | `#f87171` | Occupied slots, error states |
| `parking-amber` | `#fbbf24` | EV charging badges |
| `parking-purple` | `#a78bfa` | Covered slot badges |
| `parking-muted` | `#64748b` | Secondary text, placeholders |

### Typography

| Role | Font | Usage |
|---|---|---|
| Display | **Syne** | Headings, slot numbers, buttons |
| Body | **DM Sans** | Paragraphs, labels, descriptions |
| Mono | **JetBrains Mono** | Field names, JSON, badges, stats |

### Custom Utilities (index.css)

| Class | Effect |
|---|---|
| `.glass` | Glass-morphism card — blurred translucent background |
| `.glow-accent` | Cyan outer glow on CTA buttons |
| `.glow-green` | Green outer glow on Free slot button |
| `.grid-bg` | Subtle blueprint grid on page background |
| `.noise-bg` | Grain texture overlay for depth |
| `.text-gradient` | Cyan → purple gradient text for logo |
| `.btn-press` | Scale-down on `:active` for tactile feel |
| `.slot-card` | Smooth lift on hover for slot cards |
| `.stagger-1/2/3/4` | Staggered animation delays for stat cards |

---

## 🔌 Component API Reference

### `useParking` Hook

Central state manager — imported only by `App.jsx`.

```js
const {
  slots,          // Slot[] — sorted array of all slots
  lastResult,     // { type, message, slot } | null — last park/free result
  activeTab,      // 'slots' | 'data' | 'add' | 'park'
  setActiveTab,   // (tab: string) => void
  addSlot,        // (slotNo, isCovered, isEVCharging) => { ok, message }
  parkVehicle,    // (needsEV, needsCover) => { slot, message }
  removeVehicle,  // (slotId) => void
  deleteSlot,     // (slotId) => void
  updateSlot,     // (slotId, { isCovered?, isEVCharging? }) => void
  clearResult,    // () => void
} = useParking()
```

### `DataModelBadge` Component

Reusable display for all 4 schema fields — 3 render modes:

```jsx
// Inline chips row — used inside cards
<DataModelBadge slot={slot} mode="inline" />

// Full card with JSON preview — used in SlotDetailModal
<DataModelBadge slot={slot} mode="card" />

// Table row (<tr>) — used in DataModelTable
<DataModelBadge slot={slot} mode="table" />
```

---

## 💡 Key Implementation Notes

- **No `id` in the assignment schema** — `id` is an internal React key only (generated via `Date.now()`), never exposed in the UI
- **Slot sorting** — `sortSlots()` sorts numerically first (`1, 2, 10`) then falls back to `localeCompare` for alphanumeric IDs (`A1, A2, B1`)
- **Dynamic Tailwind classes** — classes assembled at runtime (e.g. conditional borders) are protected from purging via the `safelist` array in `tailwind.config.js`
- **Persistence key** — `smartpark_slots_v1` in `localStorage`; versioned so future schema changes won't break existing data

---

## 👨‍💻 Author

Built as part of **Round 2 Assignment** — Smart Parking Lot System.

---

<div align="center">

Made with ⚡ React · Tailwind CSS · Vite

</div>
