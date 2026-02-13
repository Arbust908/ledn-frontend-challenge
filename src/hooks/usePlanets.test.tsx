// Written by Kimi K2.5
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { usePlanets, usePlanet } from './usePlanets';
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
  fetchPlanets: jest.fn(),
  fetchPlanet: jest.fn(),
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

describe('usePlanets', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fetches planets', async () => {
    const mockPlanets = [
      { id: '1', name: 'Tatooine', climate: 'arid', terrain: 'desert', residents: [], films: [], created: '', edited: '', rotation_period: '', orbital_period: '', diameter: '', gravity: '', surface_water: '', population: '' },
    ];
    mockedEndpoints.fetchPlanets.mockResolvedValueOnce(mockPlanets);

    const { result } = renderHook(() => usePlanets(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockedEndpoints.fetchPlanets).toHaveBeenCalled();
    expect(result.current.data).toEqual(mockPlanets);
  });

  it('handles fetch error', async () => {
    mockedEndpoints.fetchPlanets.mockRejectedValueOnce(new Error('Failed'));

    const { result } = renderHook(() => usePlanets(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeDefined();
  });
});

describe('usePlanet', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fetches single planet by id', async () => {
    const mockPlanet = { id: '1', name: 'Tatooine', climate: 'arid', terrain: 'desert', residents: [], films: [], created: '', edited: '', rotation_period: '', orbital_period: '', diameter: '', gravity: '', surface_water: '', population: '' };
    mockedEndpoints.fetchPlanet.mockResolvedValueOnce(mockPlanet);

    const { result } = renderHook(() => usePlanet('1'), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockedEndpoints.fetchPlanet).toHaveBeenCalledWith('1');
    expect(result.current.data).toEqual(mockPlanet);
  });

  it('does not fetch when id is empty', async () => {
    const { result } = renderHook(() => usePlanet(''), { wrapper: createWrapper() });

    expect(result.current.isFetching).toBe(false);
    expect(mockedEndpoints.fetchPlanet).not.toHaveBeenCalled();
  });
});
