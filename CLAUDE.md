# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Star Wars themed financial admin app for "Coruscant Bank." Built as a frontend technical challenge using React + TypeScript + MirageJS mock API.

## Commands

```bash
npm start          # Dev server on localhost:3000
npm test           # Jest test runner (watch mode by default)
npm run build      # Production build
npx react-scripts test --watchAll=false  # Single test run (CI mode)
npx react-scripts test --testPathPattern="path/to/file"  # Run specific test
```

## Architecture

**Stack:** React 18 (CRA), TypeScript 5.6, Mantine 7 UI, React Query 5, styled-components 6, react-router-dom 6, decimal.js for financial math, axios for HTTP.

**Mock Backend (DO NOT MODIFY):**
- `src/server.ts` and `src/mockData/` are read-only — treat as external services
- MirageJS intercepts HTTP requests and returns mock data
- Exchange rate updates every 1 second (ICS → GCS conversion)

**API Endpoints:**
- `GET /api/planets`, `GET /api/planets/:id`
- `GET /api/users`, `GET /api/users/:id`, `GET /api/users/planet/:planetId`
- `GET /api/transactions`, `GET /api/transactions/:id`, `GET /api/transactions/user/:userId`, `GET /api/transactions/users/:userIds` (JSON array)
- `PUT /api/transactions/update-batch` — batch update transactions
- `GET /api/exchange-rate` — real-time rate (fluctuates every second)

**Data Models:**
- `Planet` — name, climate, terrain, population, residents (user IDs)
- `User` — name, homeworld (planet ID), physical attributes
- `Transaction` — user (ID), amount, currency (`"ICS"` | `"GCS"`), date (ISO-8601), status (`"inProgress"` | `"completed"` | `"blocked"`)
- `ExchangeRate` — rate (string, how many GCS = 1 ICS)

**Entry Points:**
- `src/index.tsx` — initializes MirageJS server, renders App
- `src/App.tsx` — React Query provider, Mantine theme, color scheme detection

## Key Constraints

- **Mantine is the required UI library** — no other UI component libraries allowed
- **Custom filter component must be built from scratch** (no Mantine for that specific component)
- **React Query for all API calls** — no raw useEffect data fetching
- **Use decimal.js** for all financial calculations (precision matters)
- **Responsive design required** — must work on very small screens
- Libraries can be added to package.json except UI component libraries

## TypeScript Config

Strict mode enabled, target ES2015, ESNext modules, react-jsx transform. ESLint uses `react-app` preset (configured in package.json).
