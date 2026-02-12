// Written by ClaudeCode. Edited by hand for better logic

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchPlanets, fetchPlanet } from '../api/endpoints';
import { STALE_TIME, GC_TIME } from '../config/staleTime';
import type { Planet } from '../types';

export function usePlanets() {
  return useQuery({
    queryKey: ['planets'],
    queryFn: fetchPlanets,
    staleTime: STALE_TIME.PLANETS,
    gcTime: GC_TIME.PLANETS,
  });
}

export function usePlanet(id: string) {
  const queryClient = useQueryClient();
  
  return useQuery({
    queryKey: ['planets', id],
    queryFn: () => fetchPlanet(id),
    enabled: !!id,
    staleTime: STALE_TIME.PLANETS,
    gcTime: GC_TIME.PLANETS,
    initialData: () => {
      // Try to get from cached planets list first
      const planets = queryClient.getQueryData<Planet[]>(['planets']);
      return planets?.find(p => p.id === id);
    },
    initialDataUpdatedAt: () => {
      const planetsState = queryClient.getQueryState(['planets']);
      return planetsState?.dataUpdatedAt;
    },
  });
}
