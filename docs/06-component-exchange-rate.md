# ExchangeRateDisplay Component

## Context
Displays the current exchange rate between ICS and GCS currencies. Updates every second via Tan Stack Query. Shows a skeleton loader during initial load.

## Dependencies
- `src/hooks/useExchangeRate.ts`
- `src/styles/shared.ts` (SkeletonLoader)
- decimal.js 10.4.3
- styled-components 6.1.8

## Prompt

> Create an ExchangeRateDisplay component that shows the current ICS→GCS exchange rate.
>
> **Create `src/components/ExchangeRateDisplay.tsx`:**
>
> **Imports:**
> - Decimal from decimal.js for precise financial formatting
> - styled from styled-components
> - useExchangeRate hook for fetching exchange rate
> - SkeletonLoader from shared styles for loading state
>
> **Shared styles (DRY principle):**
> ```typescript
> const sharedStyles = `
>   display: inline-block;
>   border-radius: var(--mantine-radius-md);
>   min-width: 120px;
>   overflow: clip;
>   font-size: var(--mantine-font-size-sm);
>   font-weight: var(--mantine-font-weight-bold);
>   padding: 2px var(--mantine-spacing-md);
>   background-color: var(--mantine-color-default-hover);
>   color: var(--mantine-color-text);
>   font-variant-numeric: tabular-nums;
>   margin: 0;
> `;
> ```
>
> **Styled components:**
> ```typescript
> const Badge = styled.p`${sharedStyles}`;
> const Loader = styled(SkeletonLoader)`${sharedStyles}`;
> ```
>
> **Component logic:**
> 1. Use useExchangeRate() hook
> 2. Format rate using decimal.js
> 3. Show SkeletonLoader while loading
> 4. Show Badge with formatted rate: "1 GCS = {formattedRate} ICS"
>
> **Key CSS features:**
> - `font-variant-numeric: tabular-nums` - monospace numbers for consistent width
> - `overflow: clip` - prevents text overflow
> - `min-width: 120px` - ensures consistent size
> - Uses Mantine CSS variables for theming
> - Same styles for Badge and Loader (DRY)

## Expected Output
A single component file at `src/components/ExchangeRateDisplay.tsx` that displays the exchange rate with a loading skeleton.

## Key Constraints
- Use decimal.js for all financial formatting (NOT native numbers)
- Show loading state with SkeletonLoader
- Display format: "1 GCS = X ICS" (NOT "1 ICS = X GCS")
- Use em-dash (—) as placeholder when no data
- Use Mantine CSS variables only
- Export as default export
