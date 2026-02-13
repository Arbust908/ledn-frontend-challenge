# Tan Stack Query Cache Configuration

## Context
Centralized cache configuration for Tan Stack Query hooks. Defines staleTime and gcTime based on data change frequency and usage patterns. This optimizes network requests and memory usage.

## Dependencies
None (pure configuration constants).

## Prompt

> Create a centralized cache configuration file for Tan Stack Query that defines staleTime and gcTime constants based on data change frequency.
>
> **Create `src/config/staleTime.ts`:**
>
> **Data Classification:**
> - **Exchange Rate:** Updates every 1 second (highly dynamic)
> - **Transactions:** Moderately dynamic financial data
> - **Users/Residents:** Profile data that rarely changes
> - **Planets:** Reference data that never changes
>
> **Export STALE_TIME object with:**
> - `EXCHANGE_RATE: 0` (0 seconds - always fresh due to 1s updates)
> - `TRANSACTIONS: 5 * 60 * 1000` (5 minutes in milliseconds)
> - `USERS: 30 * 60 * 1000` (30 minutes in milliseconds)
> - `PLANETS: 24 * 60 * 60 * 1000` (24 hours in milliseconds)
> - Mark as `as const` at the end
>
> **Export GC_TIME object with:**
> - Rule: gcTime should be ~5x staleTime for optimal memory usage
> - `EXCHANGE_RATE: 5 * 1000` (5 seconds - very short due to 1s updates)
> - `TRANSACTIONS: 25 * 60 * 1000` (25 minutes)
> - `USERS: 2.5 * 60 * 60 * 1000` (2.5 hours)
> - `PLANETS: 5 * 24 * 60 * 60 * 1000` (5 days)
> - Mark as `as const` at the end
>
> **Add TypeScript type helpers:**
> ```typescript
> export type StaleTimeKey = keyof typeof STALE_TIME;
> export type GcTimeKey = keyof typeof GC_TIME;
> ```
>
> **Add comprehensive comments explaining:**
> - The data classification (what changes when)
> - Why exchange rate is 0 (updates every second in server.ts)
> - The 5x rule for gcTime vs staleTime
> - What staleTime and gcTime mean in Tan Stack Query context
>
> **Example structure:**
> ```typescript
> // Centralized cache configuration for Tan Stack Query hooks
> // Based on data change frequency and usage patterns
>
> /**
>  * Data Classification:
>  * - Exchange Rate: Updates every second (highly dynamic)
>  * - Transactions: Financial data that changes moderately
>  * - Users/Residents: Profile data that rarely changes
>  * - Planets: Reference data that never changes
>  */
>
> export const STALE_TIME = {
>   EXCHANGE_RATE: 0, // comment
>   // ... etc
> } as const;
> ```
>
> **Tan Stack Query Context:**
> - `staleTime`: How long data is considered "fresh" (won't refetch during this time)
> - `gcTime` (formerly cacheTime): How long unused data stays in memory before garbage collection

## Expected Output
A single configuration file at `src/config/staleTime.ts` that exports STALE_TIME and GC_TIME constants with descriptive comments explaining the cache strategy.

## Key Constraints
- Use milliseconds for all time values (consistency)
- Show the math in the code (e.g., `5 * 60 * 1000` not `300000`)
- Use `as const` to make values readonly
- Export type helpers for TypeScript safety
- Include detailed comments explaining the cache strategy
- Exchange rate must be 0 (updates every second)
