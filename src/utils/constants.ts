// Written by ClaudeCode. Edited by hand for better logic
// Shared constants used across the application

// Breakpoints
export const BREAKPOINTS = {
  TABLET: '48em', // matches Mantine sm --mantine-breakpoint-sm
  MIN_MOBILE_WIDTH: 320, // minimum responsive design width
} as const;

// Financial formatting precision
export const FINANCIAL_PRECISION = {
  CRYPTO_AMOUNT: 8, // for ICS and GCS amounts in transactions
} as const;
