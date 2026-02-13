// Written by Kimi K2.5
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { useExchangeRate } from './useExchangeRate';
import * as endpoints from '../api/endpoints';

jest.mock('axios');
jest.mock('../api/client', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    put: jest.fn(),
  },
}));

jest.mock('../api/endpoints', () => ({
  ...jest.requireActual('../api/endpoints'),
  fetchExchangeRate: jest.fn(),
}));

const mockedEndpoints = endpoints as jest.Mocked<typeof endpoints>;

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useExchangeRate', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fetches exchange rate', async () => {
    const mockRate = { rate: '1.5' };
    mockedEndpoints.fetchExchangeRate.mockResolvedValueOnce(mockRate);

    const { result } = renderHook(() => useExchangeRate(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockedEndpoints.fetchExchangeRate).toHaveBeenCalled();
    expect(result.current.data).toEqual(mockRate);
  });

  it('handles fetch error', async () => {
    mockedEndpoints.fetchExchangeRate.mockRejectedValueOnce(new Error('Failed'));

    const { result } = renderHook(() => useExchangeRate(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeDefined();
  });
});
