# API Layer

## Context
HTTP client and API endpoint functions for communicating with the MirageJS mock backend. Provides type-safe functions for all REST endpoints.

## Dependencies
- `src/types/index.ts` (Planet, Resident, Transaction, ExchangeRate types)
- axios 1.7.7

## Prompt

> Create the API layer for a React + TypeScript application that communicates with a MirageJS mock backend.
>
> **Create two files:**
>
> **1. `src/api/client.ts` - Axios instance:**
> ```typescript
> import axios from 'axios';
>
> const client = axios.create({
>   baseURL: '/api',
> });
>
> export default client;
> ```
>
> **2. `src/api/endpoints.ts` - API endpoint functions:**
>
> Import the client and all types from `../types`.
>
> **Create these async functions (all return Promises):**
>
> **Planets:**
> - `fetchPlanets()` → `Promise<Planet[]>`
>   - GET /planets
>   - Response shape: `{ planets: Planet[] }`
> - `fetchPlanet(id: string)` → `Promise<Planet>`
>   - GET /planets/:id
>   - Response shape: `{ planet: Planet }`
>
> **Residents/Users:**
> - `fetchResidents()` → `Promise<Resident[]>`
>   - GET /users
>   - Response shape: `{ users: Resident[] }`
> - `fetchResident(id: string)` → `Promise<Resident>`
>   - GET /users/:id
>   - Response shape: `{ user: Resident }`
> - `fetchResidentsByPlanet(planetId: string)` → `Promise<Resident[]>`
>   - GET /users/planet/:planetId
>   - Response shape: `{ users: Resident[] }`
>
> **Transactions:**
> - `fetchTransactions()` → `Promise<Transaction[]>`
>   - GET /transactions
>   - Response shape: `{ transactions: Transaction[] }`
> - `fetchTransactionsByResident(userId: string)` → `Promise<Transaction[]>`
>   - GET /transactions/user/:userId
>   - Response shape: `{ transactions: Transaction[] }`
> - `fetchTransactionsByResidents(userIds: string[])` → `Promise<Transaction[]>`
>   - GET /transactions/users/:userIds
>   - **Important:** userIds must be JSON stringified: `JSON.stringify(userIds)`
>   - Response shape: `{ transactions: Transaction[] }`
> - `updateTransactionsBatch(transactions: Partial<Transaction>[])` → `Promise<{ message: string; transactions: Transaction[] }>`
>   - PUT /transactions/update-batch
>   - Request body: `{ transactions }`
>   - Response shape: `{ message: string; transactions: Transaction[] }`
>
> **Exchange Rate:**
> - `fetchExchangeRate()` → `Promise<ExchangeRate>`
>   - GET /exchange-rate
>   - Response shape: `ExchangeRate` (already has correct shape)
>
> **TypeScript patterns:**
> - Use `async/await` syntax
> - Type all responses with generics: `client.get<{ planets: Planet[] }>(...)`
> - Use destructuring: `const { data } = await client.get<...>(...)`
> - Return only the data (unwrap the axios response)
> - Export all functions
>
> **Example structure:**
> ```typescript
> export async function fetchPlanets(): Promise<Planet[]> {
>   const { data } = await client.get<{ planets: Planet[] }>('/planets');
>   return data.planets;
> }
> ```

## Expected Output
Two files:
1. `src/api/client.ts` - Configured axios instance with baseURL '/api'
2. `src/api/endpoints.ts` - All API endpoint functions with proper TypeScript types

## Key Constraints
- Use axios (already installed), not fetch
- Import all types from `../types`
- Use TypeScript generics for type-safe responses
- Always destructure and return just the data
- JSON.stringify userIds array for the multi-user endpoint
- Use Partial<Transaction> for batch update (allows partial updates)
- Export all functions so they can be used in React Query hooks
