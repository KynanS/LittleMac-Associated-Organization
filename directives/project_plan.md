# Project Plan: StarCraft 2 Analytics Site (LMAO)

> **Status**: In Development
> **Phase**: Frontend Implementation (Analytics Engine)

## 1. Project Goal
Build a static analytics website for the **LittleMac Associated Organization (LMAO)**, specifically covering:
*   **LMSL** (LittleMac StarCraft II League) - Entering Season 14.
*   **LMML** (LittleMac Master League) - Entering Season 11.

The site is hosted on **GitHub Pages**. Data is fetched from **LiquipediaDB API**, processed into static JSON files, and visualized using **React**.

## 2. Architecture & Data Pipeline
Since GitHub Pages is static, we use a **Build-Time Data Fetching** strategy.

### A. Data Ingestion (The Backend)
*   **Source**: [LiquipediaDB API](https://api.liquipedia.net/documentation/api/v3) (Requires API Key).
*   **Script**: `scripts/fetch_data.js` (Node.js).
    *   Fetches matches for "LittleMac StarCraft II League" and "LittleMac Master League".
    *   Saves output to `public/data/matches.json`.
*   **Automation**: `.github/workflows/update_data.yml`.
    *   Runs **daily at midnight** (CRON) or manually.
    *   Secrets needed: `LIQUIPEDIA_API_KEY`.

### B. The Frontend Stack
*   **Framework**: React 18 + Vite.
*   **Language**: TypeScript.
*   **Styling**: Tailwind CSS + Shadcn UI (for premium generic components).
*   **Routing**: React Router (`/`, `/lmsl`, `/lmml`).
*   **Visualizations**: `recharts` (Bar charts, Line charts, Pie charts).
*   **Icons**: `lucide-react`.

## 3. Current Implementation Status
### ✅ Completed
*   [x] **Repo Setup**: React+Vite+Tailwind configured.
*   [x] **Data Pipeline**: `fetch_data.js` and GitHub Action created.
*   [x] **Type Definitions**: `src/types/data.ts` defines `LiquipediaMatch`.
*   [x] **Skeleton UI**: `Layout.tsx` (Navbar/Footer) and `HomePage.tsx`.
*   [x] **Routing**: `App.tsx` routes configured.
*   [x] **Git**: Repo initialized and pushed to `LittleMac-Associated-Organization/sc2-analytics`.
*   [x] **Analytics Engine**: `src/lib/analytics.ts` implemented with robust stats.
*   [x] **Visualizations**: `WinRateChart`, `MapStats`, and `RaceDistributionChart` implemented.
*   [x] **Tournament Pages**: `LMSLPage` and `LMMLPage` refactored to use `TournamentDashboard`.
*   [x] **Player Profiles**: Dynamic routes for individual player history implemented.

### 🚧 In Progress (Next Steps)
*   **Player Search**: Global search bar to find players and tournaments.
*   **Advanced Player Stats**: Matchup-specific win rates (TvZ, TvP, etc.) and map performance on profile pages.
*   **Visualizations**: Win-rate trends over time for players.
*   **Comparisons**: Head-to-head player comparison tool.
*   **Testing**: Value-add unit tests for analytics logic (`vitest`).
*   **Accessibility & SEO**: Meta tags for social sharing (OpenGraph) and accessibility audit.

## 4. Key Directives for Agents
When working on this project, adhere to these rules:

1.  **Data Source of Truth**: Always read from `/public/data/matches.json` (or via `fetch('/data/matches.json')` not import) to simulate production environment.
2.  **Strict Types**: Use interfaces from `src/types/data.ts`. Do not use `any`.
3.  **Component Design**:
    *   Use **Shadcn-like** aesthetics (clean borders, muted foregrounds).
    *   Keep charts responsive (use `<ResponsiveContainer>` from Recharts).
4.  **Color Theme**:
    *   **Terran**: Blue tones.
    *   **Zerg**: Purple/Creep tones.
    *   **Protoss**: Gold/Yellow tones.
5.  **Handling Secrets**: NEVER hardcode the API Key. It is only used in the GitHub Action environment.

## 5. File Structure Reference
```
/
├── .github/workflows/update_data.yml  # Data fetching automation
├── public/data/                       # Generated JSON data lives here
├── scripts/fetch_data.js              # The script that talks to Liquipedia
├── src/
│   ├── components/
│   │   ├── Layout.tsx                 # Main shell
│   │   ├── HomePage.tsx               # Landing page
│   ├── types/
│   │   └── data.ts                    # TS Interfaces
│   ├── lib/
│   │   └── utils.ts                   # CN helper
│   ├── App.tsx                        # Routes
```
