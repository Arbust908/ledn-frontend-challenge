# SummaryPage

## Context
Main page that displays all planets in a responsive grid with search and filter controls. Entry point of the application at route "/".

## Dependencies
- `src/hooks/usePlanets.ts`
- `src/components/PlanetCard.tsx`
- `src/styles/shared.ts` (SkeletonLoader)
- styled-components 6.1.8

## Prompt

> Create a SummaryPage component that displays all planets with search and filter capabilities.
>
> **Create `src/pages/SummaryPage.tsx`:**
>
> **State management:**
> ```typescript
> const [searchQuery, setSearchQuery] = useState('');
> const [climateFilter, setClimateFilter] = useState('');
> const [terrainFilter, setTerrainFilter] = useState('');
> ```
>
> **Data fetching:**
> ```typescript
> const { data: planets, isLoading } = usePlanets();
> const allPlanets = planets ?? [];
> ```
>
> **Styled components:**
>
> **1. Container:**
> Flex container with padding and max-width
>
> **2. Title:**
> H2 with margin and font size
>
>
> **4. PlanetGrid (responsive):**
> A grid container that will display the cards in groups depending on screen size using the PlanetCard
>
>
> **Key features:**
> - Responsive grid
> - Real-time filtering (no submit button needed)
> - Case-insensitive search
> - Loading state with centered skeleton
> - All state is local (no global state needed)
>

## Expected Output
A single page component at `src/pages/SummaryPage.tsx` that displays all planets with search and filter controls in a responsive grid.

## Key Constraints
- Use CSS Grid for planet layout (NOT flexbox)
- Responsive design
- All filtering is client-side (no API filtering)
- Case-insensitive search and filtering
- Show loading state while fetching
- Use PlanetFilter and PlanetCard components
- No empty state needed (planets always exist in mock data)
