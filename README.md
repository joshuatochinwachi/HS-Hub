# HS Hub — Product Unified Space

A single-page cinematic scrollytelling website unifying three products:
1. **YieldSage** (DeFi yield intelligence on Mantle Network) — [yieldsageai.xyz](https://www.yieldsageai.xyz)
2. **HollowScan** (retail arbitrage deal-scanning app) — [hollowscan.com](https://www.hollowscan.com)
3. **Polymarket Trading** (prediction market analytics tool) — [pmkt.hollowscan.com](https://pmkt.hollowscan.com)

This site replicates and extends the custom performance-optimized HTML5 Canvas scroll-scrub sequence, spring-smoothed overlay transitions, and luxury fintech design language from the YieldSage frontend.

---

## Getting Started

### 1. Install Dependencies
Open your command prompt or terminal in the repository root directory (`c:\Users\Jo$h\Desktop\Visual Studio Code\HS Hub`) and run:
```bash
npm install
```

### 2. Run the Development Server
Launch the local Turbopack development instance:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Narrative Mapping & Animation Details

- **Loading Screen (Initial Preload)**: The site preloads the first **40 frames** of the image sequence immediately on mount. This ensures the user can enter the page instantly without waiting for all 240 frames to cache.
- **Background Preloader**: Once the page is loaded and scrolling starts (past 5% progress), a background thread loads the remaining **200 frames** (41 to 240) in batches of 20.
- **Canvas Rendering**: Calculates target frames inside a `requestAnimationFrame` drawing tick. If a frame has not loaded yet, the renderer scans backwards for the nearest loaded cached frame to eliminate black flashing.
- **Overlays (Framer Motion)**: Copy panels translate and fade in/out in sync with specific frames:
  - **Frames 1–40**: Cold open, dormant desk objects, intro hero statement.
  - **Frames 41–100**: YieldSage DeFi story beat (Green theme details).
  - **Frames 101–160**: HollowScan scanning beat (Orange/Fiery theme details).
  - **Frames 161–220**: Polymarket analytics beat (Electric blue theme details).
  - **Frames 221–240**: Resolution, all objects connected.

---

## Action Items for Deploy

- **HollowScan Interface Assets**: Currently placeholdered in the code. Place screenshots or scanning graphics inside `/public/assets/` and link them in [page.tsx](file:///c:/Users/Jo$h/Desktop/Visual%20Studio%20Code/HS%20Hub/app/page.tsx).
- **Polymarket Trading Chart Assets**: Currently placeholdered as CSS data tables. Place prediction chart graphics in `/public/assets/` and link them in [page.tsx](file:///c:/Users/Jo$h/Desktop/Visual%20Studio%20Code/HS%20Hub/app/page.tsx).
