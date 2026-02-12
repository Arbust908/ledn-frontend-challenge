// Written by ClaudeCode. Edited by hand for better logic

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchTransactions,
  fetchTransactionsByResident,
  fetchTransactionsByResidents,
  updateTransactionsBatch,
} from '../api/endpoints';
import type { Transaction } from '../types';
import { STALE_TIME, GC_TIME } from '../config/staleTime';

export function useTransactions() {
  return useQuery({
    queryKey: ['transactions'],
    queryFn: fetchTransactions,
    staleTime: STALE_TIME.TRANSACTIONS,
    gcTime: GC_TIME.TRANSACTIONS,
  });
}

export function useTransactionsByUser(userId: string) {
  const queryClient = useQueryClient();
  
  return useQuery({
    queryKey: ['transactions', 'user', userId],
    queryFn: () => fetchTransactionsByResident(userId),
    enabled: !!userId,
    staleTime: STALE_TIME.TRANSACTIONS,
    gcTime: GC_TIME.TRANSACTIONS,
    initialData: () => {
      // Try to get from cached transactions list first
      const transactions = queryClient.getQueryData<Transaction[]>(['transactions']);
      return transactions?.filter(t => t.user === userId);
    },
    initialDataUpdatedAt: () => {
      const transactionsState = queryClient.getQueryState(['transactions']);
      return transactionsState?.dataUpdatedAt;
    },
  });
}

export function useTransactionsByUsers(userIds: string[]) {
  return useQuery({
    queryKey: ['transactions', 'users', userIds],
    queryFn: () => fetchTransactionsByResidents(userIds),
    enabled: userIds.length > 0,
    staleTime: STALE_TIME.TRANSACTIONS,
    gcTime: GC_TIME.TRANSACTIONS,
  });
}

export function useUpdateTransactionsBatch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (transactions: Partial<Transaction>[]) =>
      updateTransactionsBatch(transactions),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
  });
}
