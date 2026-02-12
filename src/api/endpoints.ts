// Made with ClaudeCode

import client from './client';
import type { Planet, Resident, Transaction, ExchangeRate } from '../types';

export async function fetchPlanets(): Promise<Planet[]> {
  const { data } = await client.get<{ planets: Planet[] }>('/planets');
  return data.planets;
}

export async function fetchPlanet(id: string): Promise<Planet> {
  const { data } = await client.get<{ planet: Planet }>(`/planets/${id}`);
  return data.planet;
}

export async function fetchResidents(): Promise<Resident[]> {
  const { data } = await client.get<{ users: Resident[] }>('/users');
  return data.users;
}

export async function fetchResident(id: string): Promise<Resident> {
  const { data } = await client.get<{ user: Resident }>(`/users/${id}`);
  return data.user;
}

export async function fetchResidentsByPlanet(planetId: string): Promise<Resident[]> {
  const { data } = await client.get<{ users: Resident[] }>(`/users/planet/${planetId}`);
  return data.users;
}

export async function fetchTransactions(): Promise<Transaction[]> {
  const { data } = await client.get<{ transactions: Transaction[] }>('/transactions');
  return data.transactions;
}

export async function fetchTransactionsByResident(userId: string): Promise<Transaction[]> {
  const { data } = await client.get<{ transactions: Transaction[] }>(`/transactions/user/${userId}`);
  return data.transactions;
}

export async function fetchTransactionsByResidents(userIds: string[]): Promise<Transaction[]> {
  const { data } = await client.get<{ transactions: Transaction[] }>(
    `/transactions/users/${JSON.stringify(userIds)}`
  );
  return data.transactions;
}

export async function updateTransactionsBatch(
  transactions: Partial<Transaction>[]
): Promise<{ message: string; transactions: Transaction[] }> {
  const { data } = await client.put('/transactions/update-batch', { transactions });
  return data;
}

export async function fetchExchangeRate(): Promise<ExchangeRate> {
  const { data } = await client.get<ExchangeRate>('/exchange-rate');
  return data;
}
