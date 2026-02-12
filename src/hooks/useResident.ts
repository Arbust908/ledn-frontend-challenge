// Written by ClaudeCode. Edited by hand for better logic

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchResidents, fetchResident, fetchResidentsByPlanet } from '../api/endpoints';
import { STALE_TIME, GC_TIME } from '../config/staleTime';
import type { Resident } from '../types';

export function useResidents() {
  return useQuery({
    queryKey: ['residents'],
    queryFn: fetchResidents,
    staleTime: STALE_TIME.RESIDENTS,
    gcTime: GC_TIME.RESIDENTS,
  });
}

export function useResident(id: string) {
  const queryClient = useQueryClient();
  
  return useQuery({
    queryKey: ['residents', id],
    queryFn: () => fetchResident(id),
    enabled: !!id,
    staleTime: STALE_TIME.RESIDENTS,
    gcTime: GC_TIME.RESIDENTS,
    initialData: () => {
      // Try to get from cached users list first
      const residents = queryClient.getQueryData<Resident[]>(['residents']);
      return residents?.find(r => r.id === id);
    },
    initialDataUpdatedAt: () => {
      const residentsState = queryClient.getQueryState(['residents']);
      return residentsState?.dataUpdatedAt;
    },
  });
}

export function useResidentsByPlanet(planetId: string) {
  return useQuery({
    queryKey: ['residents', 'planet', planetId],
    queryFn: () => fetchResidentsByPlanet(planetId),
    enabled: !!planetId,
    staleTime: STALE_TIME.RESIDENTS,
    gcTime: GC_TIME.RESIDENTS,
  });
}
