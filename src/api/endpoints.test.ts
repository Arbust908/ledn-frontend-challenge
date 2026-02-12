// Written by Kimi K2.5
import {
  fetchPlanets,
  fetchPlanet,
  fetchResidents,
  fetchResident,
  fetchResidentsByPlanet,
  fetchTransactions,
  fetchTransactionsByResident,
  fetchTransactionsByResidents,
  updateTransactionsBatch,
  fetchExchangeRate,
} from './endpoints';
import type { Planet, Resident, Transaction, ExchangeRate } from '../types';
import client from './client';

jest.mock('axios', () => ({
  create: () => ({
    get: jest.fn(),
    put: jest.fn(),
  }),
}));

jest.mock('./client', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    put: jest.fn(),
  },
}));

const mockedClient = client as jest.Mocked<typeof client>;

describe('api/endpoints', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchPlanets', () => {
    it('fetches planets and returns array', async () => {
      const mockPlanets: Planet[] = [
        { id: '1', name: 'Tatooine', climate: 'arid', terrain: 'desert', residents: [], films: [], created: '', edited: '', rotation_period: '', orbital_period: '', diameter: '', gravity: '', surface_water: '', population: '' },
      ];
      mockedClient.get.mockResolvedValueOnce({ data: { planets: mockPlanets } });

      const result = await fetchPlanets();

      expect(mockedClient.get).toHaveBeenCalledWith('/planets');
      expect(result).toEqual(mockPlanets);
    });
  });

  describe('fetchPlanet', () => {
    it('fetches single planet by id', async () => {
      const mockPlanet: Planet = { id: '1', name: 'Tatooine', climate: 'arid', terrain: 'desert', residents: [], films: [], created: '', edited: '', rotation_period: '', orbital_period: '', diameter: '', gravity: '', surface_water: '', population: '' };
      mockedClient.get.mockResolvedValueOnce({ data: { planet: mockPlanet } });

      const result = await fetchPlanet('1');

      expect(mockedClient.get).toHaveBeenCalledWith('/planets/1');
      expect(result).toEqual(mockPlanet);
    });
  });

  describe('fetchResidents', () => {
    it('fetches all residents', async () => {
      const mockResidents: Resident[] = [
        { id: '1', name: 'Luke Skywalker', homeworld: '1', height: '172', mass: '77', hair_color: 'blond', skin_color: 'fair', eye_color: 'blue', birth_year: '19BBY', gender: 'male', films: [], species: [], vehicles: [], starships: [], created: '', edited: '' },
      ];
      mockedClient.get.mockResolvedValueOnce({ data: { users: mockResidents } });

      const result = await fetchResidents();

      expect(mockedClient.get).toHaveBeenCalledWith('/users');
      expect(result).toEqual(mockResidents);
    });
  });

  describe('fetchResident', () => {
    it('fetches single resident by id', async () => {
      const mockResident: Resident = { id: '1', name: 'Luke Skywalker', homeworld: '1', height: '172', mass: '77', hair_color: 'blond', skin_color: 'fair', eye_color: 'blue', birth_year: '19BBY', gender: 'male', films: [], species: [], vehicles: [], starships: [], created: '', edited: '' };
      mockedClient.get.mockResolvedValueOnce({ data: { user: mockResident } });

      const result = await fetchResident('1');

      expect(mockedClient.get).toHaveBeenCalledWith('/users/1');
      expect(result).toEqual(mockResident);
    });
  });

  describe('fetchResidentsByPlanet', () => {
    it('fetches residents by planet id', async () => {
      const mockResidents: Resident[] = [
        { id: '1', name: 'Luke Skywalker', homeworld: '1', height: '172', mass: '77', hair_color: 'blond', skin_color: 'fair', eye_color: 'blue', birth_year: '19BBY', gender: 'male', films: [], species: [], vehicles: [], starships: [], created: '', edited: '' },
      ];
      mockedClient.get.mockResolvedValueOnce({ data: { users: mockResidents } });

      const result = await fetchResidentsByPlanet('1');

      expect(mockedClient.get).toHaveBeenCalledWith('/users/planet/1');
      expect(result).toEqual(mockResidents);
    });
  });

  describe('fetchTransactions', () => {
    it('fetches all transactions', async () => {
      const mockTransactions: Transaction[] = [
        { id: '1', user: '1', amount: 100, currency: 'ICS', date: '2024-01-01', status: 'completed' },
      ];
      mockedClient.get.mockResolvedValueOnce({ data: { transactions: mockTransactions } });

      const result = await fetchTransactions();

      expect(mockedClient.get).toHaveBeenCalledWith('/transactions');
      expect(result).toEqual(mockTransactions);
    });
  });

  describe('fetchTransactionsByResident', () => {
    it('fetches transactions by user id', async () => {
      const mockTransactions: Transaction[] = [
        { id: '1', user: '1', amount: 100, currency: 'ICS', date: '2024-01-01', status: 'completed' },
      ];
      mockedClient.get.mockResolvedValueOnce({ data: { transactions: mockTransactions } });

      const result = await fetchTransactionsByResident('1');

      expect(mockedClient.get).toHaveBeenCalledWith('/transactions/user/1');
      expect(result).toEqual(mockTransactions);
    });
  });

  describe('fetchTransactionsByResidents', () => {
    it('fetches transactions by multiple user ids', async () => {
      const mockTransactions: Transaction[] = [
        { id: '1', user: '1', amount: 100, currency: 'ICS', date: '2024-01-01', status: 'completed' },
      ];
      mockedClient.get.mockResolvedValueOnce({ data: { transactions: mockTransactions } });

      const result = await fetchTransactionsByResidents(['1', '2']);

      expect(mockedClient.get).toHaveBeenCalledWith('/transactions/users/["1","2"]');
      expect(result).toEqual(mockTransactions);
    });

    it('handles empty array', async () => {
      mockedClient.get.mockResolvedValueOnce({ data: { transactions: [] } });

      const result = await fetchTransactionsByResidents([]);

      expect(mockedClient.get).toHaveBeenCalledWith('/transactions/users/[]');
      expect(result).toEqual([]);
    });
  });

  describe('updateTransactionsBatch', () => {
    it('updates batch of transactions', async () => {
      const mockTransactions: Transaction[] = [
        { id: '1', user: '1', amount: 100, currency: 'ICS', date: '2024-01-01', status: 'completed' },
      ];
      mockedClient.put.mockResolvedValueOnce({ data: { message: 'Updated', transactions: mockTransactions } });

      const result = await updateTransactionsBatch([{ id: '1', status: 'completed' }]);

      expect(mockedClient.put).toHaveBeenCalledWith('/transactions/update-batch', { transactions: [{ id: '1', status: 'completed' }] });
      expect(result).toEqual({ message: 'Updated', transactions: mockTransactions });
    });
  });

  describe('fetchExchangeRate', () => {
    it('fetches exchange rate', async () => {
      const mockRate: ExchangeRate = { rate: '1.5' };
      mockedClient.get.mockResolvedValueOnce({ data: mockRate });

      const result = await fetchExchangeRate();

      expect(mockedClient.get).toHaveBeenCalledWith('/exchange-rate');
      expect(result).toEqual(mockRate);
    });
  });
});
