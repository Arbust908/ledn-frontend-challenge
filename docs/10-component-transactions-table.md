# TransactionsTable Component

## Context
Wrapper table that renders a list of transactions using `TransactionRow` for each entry. Provides column headers, zebra striping, hover effects, and collapses to a stacked card layout on small screens.

## Dependencies
- `src/components/TransactionRow.tsx`
- `src/types/index.ts` — Transaction type
- styled-components

## Prompt

> Create a `TransactionsTable` component at `src/components/TransactionsTable.tsx`.
>
> **Props:** accepts a `Transaction[]` array.
>
> **Structure:** semantic HTML table with `thead` (Name, ICS, GCS, Status columns) and `tbody` mapping transactions to `TransactionRow` components keyed by `transaction.id`.
>
> **Desktop styling:**
> - Full width, `border-collapse: collapse`
> - Zebra striping on even rows
> - Hover highlight on rows
> - Bottom borders on cells, left-aligned text
> - All colors/spacing via Mantine CSS variables
>
> **Responsive behavior (≤600px):**
> - Hide the `thead`
> - Convert `tbody` to a grid with gaps between rows
> - Each row renders as a card (styled by `TransactionRow`'s responsive rules)
>
> Example responsive override:
> ```css
> @media (max-width: 600px) {
>   thead { display: none; }
>   tbody { display: grid; gap: var(--mantine-spacing-sm); }
> }
> ```

## Expected Output
A single file at `src/components/TransactionsTable.tsx` rendering a styled HTML table that collapses gracefully on mobile.

## Key Constraints
- Semantic HTML table elements (thead, tbody, th, td)
- Use `TransactionRow` for each row — do not inline row rendering
- Mantine CSS variables for all theming
- Responsive: hide headers and stack as cards on small screens
