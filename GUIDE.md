# Guidelines for Manual Testing & Code Review

## Starting Solution

### Install & Run

```bash
git clone https://github.com/Arbust908/ledn-frontend-challenge.git
cd ledn-frontend-challenge
npm install

npm start
```

Once the app is running, you can access it in your browser at `http://localhost:3000`. The mock API server is integrated and will automatically serve data to the frontend.

Alternatively you can test the app at [This page](https://arbust908.github.io/ledn-frontend-challenge/)

---

## Manual Verification Checklist

[Video walkthrough of manual testing](https://www.loom.com/share/0874297ceed348d1b0f1e70e7c01b020) (optional)

### 1. Summary Page (`/`)

- [ ] Planet grid renders with all planets
- [ ] Type in the search input — grid filters by planet name
- [ ] Open the **Climate** dropdown — select a value, grid filters accordingly
- [ ] Open the **Terrain** dropdown — select a value, grid filters accordingly
- [ ] Combine search + climate + terrain filters together

### 2. Planet Detail Page (`/planets/:id`)

- [ ] Click any planet card on Summary → navigates to detail view
- [ ] Planet info cards show: Climate, Terrain, Population, Gravity
- [ ] **Currency filter** (All / ICS / GCS) filters the transactions table
- [ ] Each transaction row shows both ICS and GCS amounts (converted via live exchange rate)
- [ ] Totals displayed in both ICS and GCS at the top
- [ ] Exchange rate indicator in the header updates every ~1 second
- [ ] Back button returns to Summary

### 3. Transactions Page (`/transactions`)

- [ ] Select a planet from the dropdown
- [ ] **"Execute Blockade"** button appears with count of in-progress transactions
- [ ] Click the button — all `inProgress` transactions for that planet become `blocked`
- [ ] Button disables when no in-progress transactions remain
- [ ] Status filter (All / In Progress / Completed / Blocked) works
- [ ] Currency filter (All / ICS / GCS) works

### 4. Technical Requirements

| Requirement | How to Verify |
|---|---|
| Tan Stack Query for all API calls | Open Tan Stack Query DevTools (bottom-right icon) — all fetches visible |
| TypeScript + React | All source files are `.ts` / `.tsx` |
| Mock server untouched | `src/server.ts` and `src/mockData/` have no modifications |
| No UI component libraries | Search imports — no `@mantine/core` components, only CSS variables (`var(--mantine-*)`) |
| Custom currency filter | `src/components/CurrencyFilter.tsx` — built from scratch with styled-components |
| Responsive design | Resize browser to 320px width — layout adapts (table → cards, hamburger nav) |
| Financial precision | All monetary math uses `decimal.js` (no native float arithmetic) |

### 5. Flexible Requirements Implemented

| # | Requirement | Status |
|---|---|---|
| 1 | Block `inProgress` → `blocked` for a planet | Implemented |
| 2 | Climate + Terrain filters on Summary | Implemented |
| 3 | UI from scratch (no component libraries) | Implemented |
| 4 | Muli-language support (i18n) | Not implemented |
| 5 | Automated tests for hooks, components, pages | Implemented |


### 6. Automated Tests

Run all 14 test files:

``` bash 
# Tests — watch mode
npm test

# Tests — single run (CI mode)
npx react-scripts test --watchAll=false
```

Run a specific test:

```bash
npx react-scripts test --testPathPattern="TransactionsPage"
```

---

## Section 3: Data Architecture

### Data Flow

```
API endpoint (src/api/endpoints.ts)
  → Tan Stack Query hook (src/hooks/)
    → Page / Component (src/pages/, src/components/)
```

### Key Files

| Layer | Path | Purpose |
|---|---|---|
| Types | `src/types/index.ts` | `Planet`, `Resident`, `Transaction`, `ExchangeRate`, `Currency`, `Status` |
| API client | `src/api/client.ts` | Axios instance with `/api` base URL |
| Endpoints | `src/api/endpoints.ts` | All fetch/update functions |
| Hooks | `src/hooks/` | Tan Stack Query wrappers with caching strategies |
| Config | `src/config/staleTime.ts` | Cache timing (staleTime, gcTime per resource) |

### Caching Strategy

| Resource | staleTime | Rationale |
|---|---|---|
| Planets | 24 hours | Static data |
| Residents | 30 minutes | Rarely changes |
| Transactions | 5 minutes | Updates on blockade |
| Exchange Rate | 0 (always stale) | Refetches every 1 second |

