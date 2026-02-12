// Written by Kimi K2.5
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import {
  useTransactions,
  useTransactionsByUser,
  useTransactionsByUsers,
  useUpdateTransactionsBatch,
} from './useTransactions';
import * as endpoints from '../api/endpoints';

jest.mock('../api/endpoints', () => ({
  fetchTransactions: jest.fn(),
  fetchTransactionsByResident: jest.fn(),
  fetchTransactionsByResidents: jest.fn(),
  updateTransactionsBatch: jest.fn(),
}));

jest.mock('../api/client', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    put: jest.fn(),
  },
}));

const mockedEndpoints = endpoints as jest.Mocked<typeof endpoints>;

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useTransactions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fetches transactions', async () => {
    const mockTransactions = [
      { id: '1', user: '1', amount: 100, currency: 'ICS' as const, date: '2024-01-01', status: 'completed' as const },
    ];
    mockedEndpoints.fetchTransactions.mockResolvedValueOnce(mockTransactions);

    const { result } = renderHook(() => useTransactions(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockedEndpoints.fetchTransactions).toHaveBeenCalled();
    expect(result.current.data).toEqual(mockTransactions);
  });

  it('handles fetch error', async () => {
    mockedEndpoints.fetchTransactions.mockRejectedValueOnce(new Error('Failed'));

    const { result } = renderHook(() => useTransactions(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeDefined();
  });
});

describe('useTransactionsByUser', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fetches transactions by user id', async () => {
    const mockTransactions = [
      { id: '1', user: '1', amount: 100, currency: 'ICS' as const, date: '2024-01-01', status: 'completed' as const },
    ];
    mockedEndpoints.fetchTransactionsByResident.mockResolvedValueOnce(mockTransactions);

    const { result } = renderHook(() => useTransactionsByUser('1'), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockedEndpoints.fetchTransactionsByResident).toHaveBeenCalledWith('1');
    expect(result.current.data).toEqual(mockTransactions);
  });

  it('does not fetch when userId is empty', async () => {
    const { result } = renderHook(() => useTransactionsByUser(''), { wrapper: createWrapper() });

    expect(result.current.isFetching).toBe(false);
    expect(mockedEndpoints.fetchTransactionsByResident).not.toHaveBeenCalled();
  });
});

describe('useTransactionsByUsers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fetches transactions by multiple user ids', async () => {
    const mockTransactions = [
      { id: '1', user: '1', amount: 100, currency: 'ICS' as const, date: '2024-01-01', status: 'completed' as const },
    ];
    mockedEndpoints.fetchTransactionsByResidents.mockResolvedValueOnce(mockTransactions);

    const { result } = renderHook(() => useTransactionsByUsers(['1', '2']), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockedEndpoints.fetchTransactionsByResidents).toHaveBeenCalledWith(['1', '2']);
    expect(result.current.data).toEqual(mockTransactions);
  });

  it('does not fetch when userIds is empty', async () => {
    const { result } = renderHook(() => useTransactionsByUsers([]), { wrapper: createWrapper() });

    expect(result.current.isFetching).toBe(false);
    expect(mockedEndpoints.fetchTransactionsByResidents).not.toHaveBeenCalled();
  });
});

describe('useUpdateTransactionsBatch', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('updates transactions batch', async () => {
    const mockTransactions = [
      { id: '1', user: '1', amount: 100, currency: 'ICS' as const, date: '2024-01-01', status: 'completed' as const },
    ];
    mockedEndpoints.updateTransactionsBatch.mockResolvedValueOnce({ message: 'Updated', transactions: mockTransactions });

    const { result } = renderHook(() => useUpdateTransactionsBatch(), { wrapper: createWrapper() });

    result.current.mutate([{ id: '1', status: 'completed' as const }]);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockedEndpoints.updateTransactionsBatch).toHaveBeenCalledWith([{ id: '1', status: 'completed' }]);
  });

  it('handles mutation error', async () => {
    mockedEndpoints.updateTransactionsBatch.mockRejectedValueOnce(new Error('Failed'));

    const { result } = renderHook(() => useUpdateTransactionsBatch(), { wrapper: createWrapper() });

    result.current.mutate([{ id: '1', status: 'completed' as const }]);

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeDefined();
  });
});
