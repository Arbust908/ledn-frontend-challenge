// Written by Kimi K2.5
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { useResidents, useResident, useResidentsByPlanet } from './useResident';
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
  fetchResidents: jest.fn(),
  fetchResident: jest.fn(),
  fetchResidentsByPlanet: jest.fn(),
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

describe('useResidents', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fetches all residents', async () => {
    const mockResidents = [
      { id: '1', name: 'Luke Skywalker', homeworld: '1', height: '172', mass: '77', hair_color: 'blond', skin_color: 'fair', eye_color: 'blue', birth_year: '19BBY', gender: 'male', films: [], species: [], vehicles: [], starships: [], created: '', edited: '' },
    ];
    mockedEndpoints.fetchResidents.mockResolvedValueOnce(mockResidents);

    const { result } = renderHook(() => useResidents(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockedEndpoints.fetchResidents).toHaveBeenCalled();
    expect(result.current.data).toEqual(mockResidents);
  });

  it('handles fetch error', async () => {
    mockedEndpoints.fetchResidents.mockRejectedValueOnce(new Error('Failed'));

    const { result } = renderHook(() => useResidents(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeDefined();
  });
});

describe('useResident', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fetches single resident by id', async () => {
    const mockResident = { id: '1', name: 'Luke Skywalker', homeworld: '1', height: '172', mass: '77', hair_color: 'blond', skin_color: 'fair', eye_color: 'blue', birth_year: '19BBY', gender: 'male', films: [], species: [], vehicles: [], starships: [], created: '', edited: '' };
    mockedEndpoints.fetchResident.mockResolvedValueOnce(mockResident);

    const { result } = renderHook(() => useResident('1'), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockedEndpoints.fetchResident).toHaveBeenCalledWith('1');
    expect(result.current.data).toEqual(mockResident);
  });

  it('does not fetch when id is empty', async () => {
    const { result } = renderHook(() => useResident(''), { wrapper: createWrapper() });

    expect(result.current.isFetching).toBe(false);
    expect(mockedEndpoints.fetchResident).not.toHaveBeenCalled();
  });
});

describe('useResidentsByPlanet', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fetches residents by planet id', async () => {
    const mockResidents = [
      { id: '1', name: 'Luke Skywalker', homeworld: '1', height: '172', mass: '77', hair_color: 'blond', skin_color: 'fair', eye_color: 'blue', birth_year: '19BBY', gender: 'male', films: [], species: [], vehicles: [], starships: [], created: '', edited: '' },
    ];
    mockedEndpoints.fetchResidentsByPlanet.mockResolvedValueOnce(mockResidents);

    const { result } = renderHook(() => useResidentsByPlanet('1'), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockedEndpoints.fetchResidentsByPlanet).toHaveBeenCalledWith('1');
    expect(result.current.data).toEqual(mockResidents);
  });

  it('does not fetch when planetId is empty', async () => {
    const { result } = renderHook(() => useResidentsByPlanet(''), { wrapper: createWrapper() });

    expect(result.current.isFetching).toBe(false);
    expect(mockedEndpoints.fetchResidentsByPlanet).not.toHaveBeenCalled();
  });
});
