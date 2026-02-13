// Made by ClaudeCode
// Centralized cache configuration for Tan Stack Query hooks
// Based on data change frequency and usage patterns

/**
 * Data Classification:
 * - Exchange Rate: Updates every second (highly dynamic)
 * - Transactions: Financial data that changes moderately 
 * - Users/Residents: Profile data that rarely changes
 * - Planets: Reference data that never changes
 */

export const STALE_TIME = {
  // Exchange Rate: 0 seconds (updates every second)
  // Always fresh due to 1s updates in server.ts
  EXCHANGE_RATE: 0,

  // Transactions: 5 minutes (moderately dynamic financial data)
  TRANSACTIONS: 5 * 60 * 1000, // 5 minutes

  // Users/Residents: 30 minutes (mostly static profile data)
  RESIDENTS: 30 * 60 * 1000, // 30 minutes

  // Planets: 24 hours (completely static reference data)
  PLANETS: 24 * 60 * 60 * 1000, // 24 hours
} as const;

export const GC_TIME = {
  // gcTime: 5x staleTime for optimal memory usage
  EXCHANGE_RATE: 5 * 1000, // 5 seconds (very short due to 1s updates)
  TRANSACTIONS: 5 * STALE_TIME.TRANSACTIONS, // 25 minutes
  RESIDENTS: 5 * STALE_TIME.RESIDENTS, // 2.5 hours
  PLANETS: 5 * STALE_TIME.PLANETS, // 5 days
} as const;

// Type helpers for better TypeScript support
export type StaleTimeKey = keyof typeof STALE_TIME;
export type GcTimeKey = keyof typeof GC_TIME;