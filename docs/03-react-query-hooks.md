# React Query Hooks

## Context
Custom React Query hooks for all API endpoints. Implements cache optimization patterns including initialData to reduce network requests by checking the query cache first.

## Dependencies
- `@tanstack/react-query` 5.62.0
- `src/api/endpoints.ts` (all fetch functions)
- `src/config/staleTime.ts` (STALE_TIME, GC_TIME constants)
- `src/types/index.ts` (Planet, Resident, Transaction types)

## Prompt

> Create custom React Query hooks for all API endpoints with cache optimization patterns.
>
> **Create 4 hook files:**
>
> **1. `src/hooks/useExchangeRate.ts`:**
> ```typescript
> import { useQuery } from '@tanstack/react-query';
> import { fetchExchangeRate } from '../api/endpoints';
> import { STALE_TIME, GC_TIME } from '../config/staleTime';
>
> export function useExchangeRate() {
>   return useQuery({
>     queryKey: ['exchangeRate'],
>     queryFn: fetchExchangeRate,
>     refetchInterval: 1000, // Refetch every 1 second
>     staleTime: STALE_TIME.EXCHANGE_RATE, // 0 - always fresh
>     gcTime: GC_TIME.EXCHANGE_RATE, // 5 seconds
>   });
> }
> ```
>
> **2. `src/hooks/usePlanets.ts`:**
> - Import useQuery, useQueryClient from '@tanstack/react-query'
> - Import fetchPlanets, fetchPlanet from '../api/endpoints'
> - Import STALE_TIME, GC_TIME from '../config/staleTime'
> - Import Planet type from '../types'
>
> **Create `usePlanets()` hook:**
> - queryKey: `['planets']`
> - queryFn: fetchPlanets
> - staleTime: STALE_TIME.PLANETS
> - gcTime: GC_TIME.PLANETS
>
> **Create `usePlanet(id: string)` hook with cache optimization:**
> - Get queryClient with useQueryClient()
> - queryKey: `['planets', id]`
> - queryFn: `() => fetchPlanet(id)`
> - enabled: `!!id` (only run if id exists)
> - staleTime: STALE_TIME.PLANETS
> - gcTime: GC_TIME.PLANETS
> - **initialData:** Try to get from cached planets list first:
>   ```typescript
>   initialData: () => {
>     const planets = queryClient.getQueryData<Planet[]>(['planets']);
>     return planets?.find(p => p.id === id);
>   }
>   ```
> - **initialDataUpdatedAt:** Get timestamp from planets cache:
>   ```typescript
>   initialDataUpdatedAt: () => {
>     const planetsState = queryClient.getQueryState(['planets']);
>     return planetsState?.dataUpdatedAt;
>   }
>   ```
>
> **3. `src/hooks/useTransactions.ts`:**
> - Import useQuery, useMutation, useQueryClient
> - Import all transaction fetch functions and updateTransactionsBatch
> - Import Transaction type, STALE_TIME, GC_TIME
>
> **Create `useTransactions()` hook:**
> - queryKey: `['transactions']`
> - queryFn: fetchTransactions
> - staleTime/gcTime: TRANSACTIONS
>
> **Create `useTransactionsByUser(userId: string)` hook with cache optimization:**
> - Similar pattern to usePlanet
> - queryKey: `['transactions', 'user', userId]`
> - queryFn: `() => fetchTransactionsByResident(userId)`
> - enabled: `!!userId`
> - initialData: filter cached transactions by userId
> - initialDataUpdatedAt: from transactions cache
>
> **Create `useTransactionsByUsers(userIds: string[])` hook:**
> - queryKey: `['transactions', 'users', userIds]`
> - queryFn: `() => fetchTransactionsByResidents(userIds)`
> - enabled: `userIds.length > 0`
> - staleTime/gcTime: TRANSACTIONS
> - NO initialData (multi-user queries are too complex to cache-optimize)
>
> **Create `useUpdateTransactionsBatch()` mutation hook:**
> - Use useMutation
> - mutationFn: `(transactions: Partial<Transaction>[]) => updateTransactionsBatch(transactions)`
> - onSuccess: `queryClient.invalidateQueries({ queryKey: ['transactions'] })`
>
> **4. `src/hooks/useUsers.ts`:**
> - Similar patterns to usePlanets.ts
> - Export: `useResidents()`, `useResident(id)`, `useResidentsByPlanet(planetId)`
> - useResident has initialData optimization (check cached users list)
> - useResidentsByPlanet does NOT have initialData (can't reliably cache-optimize by planet)
>
> **Cache Optimization Pattern:**
> The initialData pattern prevents unnecessary network requests when:
> 1. User fetches all planets (`usePlanets`)
> 2. User navigates to planet detail (`usePlanet(id)`)
> 3. Instead of fetching again, check if planet is in the cached list
> 4. Use cached data immediately while background refetch validates it

## Expected Output
Four hook files:
- `src/hooks/useExchangeRate.ts`
- `src/hooks/usePlanets.ts`
- `src/hooks/useTransactions.ts`
- `src/hooks/useUsers.ts`

Each with properly typed React Query hooks and cache optimization patterns.

## Key Constraints
- Import from '@tanstack/react-query' (v5 syntax)
- Use useQuery for reads, useMutation for writes
- Apply initialData pattern only where safe (single-item lookups from list cache)
- Use enabled flag to prevent queries from running when params are invalid
- Invalidate cache on mutations (onSuccess callback)
- Export all hooks as named exports
- Use proper TypeScript types for all generics
