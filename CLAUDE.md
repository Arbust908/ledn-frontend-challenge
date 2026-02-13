# Development Assistant Guidelines

This file provides comprehensive guidance for AI assistants (including Claude Code) working with code in this repository.

## Project Overview

**Star Wars themed financial admin app for "Coruscant Bank."** Built as a frontend technical challenge using React + TypeScript + MirageJS mock API.

## Quick Reference

### Commands
```bash
npm start          # Dev server on localhost:3000
npm test           # Jest test runner (watch mode by default)
npm run build      # Production build
npx react-scripts test --watchAll=false  # Single test run (CI mode)
npx react-scripts test --testPathPattern="path/to/file"  # Run specific test
```

### Technology Stack
- **Framework:** React 18 (Create React App), TypeScript 5.6
- **UI:** Mantine 7 theme tokens via CSS variables, custom styled-components (NO Mantine UI components)
- **State/API:** Tan Stack Query 5, axios
- **Routing:** react-router-dom 6
- **Financial:** decimal.js for all monetary calculations
- **Testing:** Jest + React Testing Library
- **Mock Backend:** MirageJS (read-only)

---

## Core Principles

### Explore First, Modify Later

Before proposing file changes:

1. **Read existing code** - Use search and read tools to understand patterns
2. **Find similar features** - Look for reference implementations  
3. **Understand context** - Trace through related files
4. **Ask clarifying questions** - If requirements are unclear, ask first

**Example:** "Before I modify X, let me check how similar feature Y is implemented..."

This prevents:
- Over-engineering solutions that don't match existing patterns
- Breaking established conventions
- Duplicate implementations
- Unnecessary complexity

**Reading code is cheap, fixing broken code is expensive.**

---

## Architecture & Key Constraints

### Mock Backend (⚠️ DO NOT MODIFY ⚠️)
- **`src/server.ts`** and **`src/mockData/`** are read-only — treat as external services
- MirageJS intercepts HTTP requests and returns mock data
- Exchange rate updates every 1 second (ICS → GCS conversion)

### API Endpoints
- `GET /api/planets`, `GET /api/planets/:id`
- `GET /api/users`, `GET /api/users/:id`, `GET /api/users/planet/:planetId`
- `GET /api/transactions`, `GET /api/transactions/:id`, `GET /api/transactions/user/:userId`, `GET /api/transactions/users/:userIds` (JSON array)
- `PUT /api/transactions/update-batch` — batch update transactions
- `GET /api/exchange-rate` — real-time rate (fluctuates every second)

### Data Models
- **Planet** — name, climate, terrain, population, residents (user IDs)
- **User** — name, homeworld (planet ID), physical attributes
- **Transaction** — user (ID), amount, currency (`"ICS"` | `"GCS"`), date (ISO-8601), status (`"inProgress"` | `"completed"` | `"blocked"`)
- **ExchangeRate** — rate (string, how many GCS = 1 ICS)

### Entry Points
- `src/index.tsx` — initializes MirageJS server, renders App
- `src/App.tsx` — Tan Stack Query provider, Mantine theme, color scheme detection

---

## Critical Constraints (Must Follow)

### ❌ NEVER DO THESE
1. **Modify** `src/server.ts` or `src/mockData/` - treat as external services
2. **Use Mantine UI components** - custom styled-components only
3. **Raw `useEffect` data fetching** - Tan Stack Query exclusively
4. **Native number math for financials** - `decimal.js` required
5. **Add UI component libraries** - other libraries may be added to package.json, but NOT UI component libraries

### ✅ ALWAYS DO THESE
1. **Use TypeScript exclusively** - no JavaScript files
2. **ES modules format only** - import/export, not require/module.exports
3. **Import all methods, classes, and types used**
4. **Build custom filter component from scratch** - no pre-built solutions
5. **Design responsively** - must work on very small screens (320px)
6. **Use modern CSS** - grid, nesting, custom properties; prefer grid over flexbox when both make sense

---

## Quality Standards

### Code Style
```typescript
// ✅ Correct: TypeScript, ES modules, all imports included
import Decimal from 'decimal.js';
import { useQuery } from '@tanstack/react-query';
import styled from 'styled-components';

// ❌ Incorrect: JavaScript, missing imports, CommonJS
const Decimal = require('decimal.js');
```

### Testing
- Use descriptive test names that clearly indicate purpose
- Test descriptions should begin with lowercase
- Example: `test("validates transaction amount with decimal.js", () => {...})`

### Performance
- Prioritize responsive design for very small screens
- Use CSS grid over flexbox when both are viable
- Leverage CSS variables from Mantine theme tokens

---

## Implementation Patterns

### API Integration (Tan Stack Query ONLY)
```typescript
// ✅ Correct: Tan Stack Query for all API calls
const { data, isLoading, error } = useQuery({
  queryKey: ['transactions', userId],
  queryFn: () => fetchTransactions(userId)
});

// ❌ Incorrect: Raw useEffect fetching
useEffect(() => {
  fetch('/api/transactions').then(...)
}, []);
```

### Financial Calculations (decimal.js ONLY)
```typescript
// ✅ Correct: decimal.js for precision
import Decimal from 'decimal.js';
const amount = new Decimal(transaction.amount);
const converted = amount.mul(exchangeRate);
const total = amount.plus(new Decimal(otherAmount));

// ❌ Incorrect: Native number math
const amount = parseFloat(transaction.amount);
const converted = amount * exchangeRate;
```

### Styling (styled-components ONLY)
```typescript
// ✅ Correct: styled-components with Mantine CSS variables
import styled from 'styled-components';

const Container = styled.div`
  background: var(--mantine-color-gray-0);
  padding: var(--mantine-spacing-md);
  
  @media (max-width: 320px) {
    padding: var(--mantine-spacing-xs);
  }
`;

// ❌ Incorrect: Mantine components
import { Container } from '@mantine/core';
```

---

## Development Workflow

### Before Making Changes
1. **Read relevant files** to understand existing patterns
2. **Check for similar implementations** in the codebase
3. **Verify constraints** - especially mock backend read-only rule
4. **Ask clarifying questions** if requirements are unclear

### After Making Changes
1. **Run type checks** - TypeScript compilation must succeed
2. **Run linting** - ESLint (react-app preset) must pass
3. **Run tests** - ensure existing tests pass
4. **Verify responsive design** - test at 320px breakpoint
5. **Validate financial calculations** - confirm decimal.js usage

---

## Communication Guidelines

### Progress Updates
- Use **fact-based updates**: "Migrated 6 files, found 2 type errors, fixed both"
- Track progress in **todo lists** for multi-step tasks
- **Mark tasks complete immediately** when done

### Response Format
- Include **file paths** in code references
- Use **diff format** for modifications
- Keep responses **concise and actionable**

---

## Verification Checklist

Before marking any task complete:

- [ ] TypeScript compilation succeeds (no `any` types, strict mode satisfied)
- [ ] ESLint passes (react-app preset)
- [ ] Tests pass (run `npx react-scripts test --watchAll=false`)
- [ ] Responsive design works on small screens (320px)
- [ ] Financial calculations use `decimal.js`
- [ ] API calls use Tan Stack Query hooks
- [ ] No Mantine UI components imported
- [ ] Mock backend files untouched (`src/server.ts`, `src/mockData/`)
- [ ] Custom components built from scratch (especially filter component)

---

## TypeScript Configuration

- **Strict mode:** Enabled
- **Target:** ES2015
- **Modules:** ESNext
- **JSX transform:** react-jsx
- **ESLint preset:** react-app (configured in package.json)

---

## Need Help?

If requirements are unclear or you're unsure about an approach:
1. **Ask first** - don't assume
2. **Reference similar implementations** in the codebase
3. **Check existing patterns** before proposing new ones

Remember: This is a carefully architected codebase with specific constraints. When in doubt, explore first, modify later.
