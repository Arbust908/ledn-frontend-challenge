// Written by ClaudeCode.
import { useQuery } from '@tanstack/react-query';
import { fetchExchangeRate } from '../api/endpoints';
import { STALE_TIME, GC_TIME } from '../config/staleTime';

export function useExchangeRate() {
  return useQuery({
    queryKey: ['exchangeRate'],
    queryFn: fetchExchangeRate,
    refetchInterval: 1000,
    staleTime: STALE_TIME.EXCHANGE_RATE, // 0 - always fresh due to 1s updates
    gcTime: GC_TIME.EXCHANGE_RATE, // 5 seconds - very short due to high update frequency
  });
}
