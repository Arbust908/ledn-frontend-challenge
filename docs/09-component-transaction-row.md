# TransactionRow Component

## Context
Renders a single transaction as a table row with resident name, dual-currency amounts (ICS/GCS) with real-time conversion, and a status badge. Adapts to a card-like layout on mobile.

## Dependencies
- `src/types/index.ts` — Transaction, Status types
- `src/hooks/useResident.ts` — useResident hook
- `src/hooks/useExchangeRate.ts` — useExchangeRate hook
- `src/styles/shared.ts` — SkeletonLoader
- decimal.js, styled-components, lucide-react

## Prompt

> Create a `TransactionRow` component at `src/components/TransactionRow.tsx`.
>
> **Props:** accepts a single `Transaction` object.
>
> **Data fetching:** use `useResident` and `useExchangeRate` hooks. Show a skeleton loader spanning all columns while loading.
>
> **Currency conversion:** use decimal.js for all math. The exchange rate represents how many GCS = 1 ICS:
> - ICS → GCS: multiply by rate
> - GCS → ICS: divide by rate
>
> Display both ICS and GCS amounts, highlighting the original currency column (violet).
>
> **Status badge:** render an inline badge with an icon and label for each status (`completed`, `inProgress`, `blocked`). Use a config object mapping statuses to colors (light/dark variants) and lucide-react icons. Example:
> ```typescript
> const statusConfig: Record<Status, { light: string; dark: string; icon: typeof CircleCheck; label: string }> = {
>   completed: { light: 'var(--mantine-color-teal-6)', dark: 'var(--mantine-color-teal-4)', icon: CircleCheck, label: 'Completed' },
>   // ...
> };
> ```
>
> **Responsive behavior (≤768px):** switch the row to a CSS grid card layout:
> - Name and status on the first row (name left, status right)
> - ICS and GCS amounts stacked below, each prefixed with a `::before` label (e.g., `content: 'ICS: '`)
> - Use `order` properties to control visual sequence
>
> **Styling notes:**
> - `font-variant-numeric: tabular-nums` on amount cells for column alignment
> - Amount cells fixed at `24ch` width on desktop
> - Dark mode support via `[data-mantine-color-scheme='dark']` selector on the status badge

## Expected Output
A single file at `src/components/TransactionRow.tsx` rendering a table row with resident name, ICS amount, GCS amount, and status badge — responsive down to mobile.

## Key Constraints
- decimal.js for ALL financial math — never native number arithmetic on amounts
- Highlight original currency column (violet)
- Show skeleton loader while data is loading
- Status badge with icon, color-coded per status, dark mode aware
- Mobile layout: grid-based card with labeled amounts
