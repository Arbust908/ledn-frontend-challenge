# PlanetDetailPage

## Context
Detailed view of a single planet showing information cards, transaction totals (with decimal.js), currency filter, and transactions table. Accessed via route `/planets/:id`.

## Wireframe
See [11-b-planet-detail-draft.jpeg](./11-b-planet-detail-draft.jpeg) for the hand-drawn wireframe showing both mobile and desktop layouts.

## Dependencies
- `src/hooks/usePlanets.ts` (usePlanet)
- `src/hooks/useTransactions.ts` (useTransactionsByUsers)
- `src/hooks/useExchangeRate.ts`
- `src/components/Card.tsx`
- `src/components/TransactionsTable.tsx`
- `src/components/CurrencyFilter.tsx`
- `src/utils/formatBigNumber.ts`
- `src/utils/constants.ts` (BREAKPOINTS, FINANCIAL_PRECISION)
- `src/styles/shared.ts` (SkeletonLoader)
- react-router-dom 6.28.0 (useParams, useNavigate)
- decimal.js 10.4.3
- lucide-react (ArrowLeft icon)
- styled-components 6.1.8

## Layout Structure

### Desktop
1. **Header row** — BackButton + planet name (underlined `Title2`)
2. **Info cards** — 4-column auto-fit grid (Climate, Terrain, Population, Gravity)
3. **Totals** — 2-column grid with separate cards for Total ICS and Total GCS (`TotalsDesktop`)
4. **Transactions header** — `Title3` "Transactions" + `CurrencyFilter`, spaced with `justify-content: space-between`
5. **Transactions table** — Card with `padding="0"` wrapping `TransactionsTable`

### Mobile (below BREAKPOINTS.TABLET)
- BackButton hides the "Back" text, shows only the ArrowLeft icon
- Info cards stack via auto-fit grid (minmax 120px)
- Totals merge into a single card with a divider between ICS and GCS (`TotalsMobile`)
- Desktop totals hidden (`TotalsDesktop` uses `display: none`)
- Table card wrapper strips background, border, box-shadow, and padding from the Card

## Styled Components

- **Stack** — flex column, `gap: lg`, max-width 1328px, centered
- **Group** — flex row, `align-items: center`, `gap: md`
- **TransactionsHeader** — flex row, `justify-content: space-between`, `align-items: center`, `margin-bottom: md`
- **BackButton** — inline-flex, no border/background, violet text, hover: violet-light background; hides `<p>` child on mobile
- **Title2** — h2 size/weight, underlined, no margin
- **Title3** — h3 size/weight, no margin
- **SimpleGrid** — CSS grid, `auto-fit` with `minmax(120px, 1fr)`
- **TotalsDesktop** — 2-column grid, hidden below tablet breakpoint
- **TotalsMobile** — visible only below tablet breakpoint
- **TotalsDivider** — horizontal rule separating ICS/GCS in mobile totals card
- **TagText** — small, dimmed color, no margin
- **ValueText** — medium size, bold, capitalized, `font-variant-numeric: tabular-nums`
- **TableCardWrapper** — on mobile, strips Card styling (background, border, shadow, padding)

## State & Data Fetching

- **Route param:** `id` from `useParams`
- **Navigation:** `useNavigate` for back button (`navigate('/')`)
- **Currency filter:** `useState<CurrencyFilterValue>('')`
- **Planet:** `usePlanet(id)` — drives header and info cards
- **Transactions:** `useTransactionsByUsers(planet.residents)` — drives table and totals
- **Exchange rate:** `useExchangeRate()` — drives total conversions
- **Loading states:** separated into `planetLoading` (header + info cards) and `totalsLoading` (transactions + exchange rate)

## Filtered Transactions

- `useMemo` over `[transactions, currencyFilter]`
- No filter selected: returns all transactions
- Filter selected: returns only transactions matching the currency
- Filter affects table display only, NOT totals

## Total Calculations (decimal.js)

- Computed in `useMemo` over `[transactions, exchangeRateData?.rate]`
- Uses ALL transactions regardless of currency filter
- For each transaction:
  - **ICS transaction:** add amount to totalICS, add `amount * rate` to totalGCS
  - **GCS transaction:** add amount to totalGCS, add `amount / rate` to totalICS
- Rate interpretation: 1 ICS = `rate` GCS
- Displayed with `toFixed(FINANCIAL_PRECISION.CRYPTO_AMOUNT)`

## Loading States

- **Planet loading:** skeleton for title (200px x 32px) and 4 info card skeletons (40px height)
- **Totals loading:** desktop shows 2 card skeletons (40px), mobile shows 1 card skeleton (60px)
- **Transactions loading:** single skeleton (200px height) inside the table card
- **Missing planet:** renders `<TagText>Planet not found</TagText>` after loading completes
- **No transactions:** renders message "No transactions found for residents of this planet."

## Key Constraints
- decimal.js for ALL financial calculations — never native number arithmetic
- Totals calculated from ALL transactions (ignore currency filter)
- Currency filter only affects table display
- Auto-fit grid for responsive info cards
- Back button navigates to `/` (not browser back)
- `Card padding="0"` for the transactions table
- `font-variant-numeric: tabular-nums` for consistent number widths
- Responsive breakpoints use `BREAKPOINTS` from constants
- Financial precision uses `FINANCIAL_PRECISION` from constants
