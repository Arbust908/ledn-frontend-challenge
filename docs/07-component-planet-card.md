# PlanetCard Component

## Context
Displays planet information in a card format on the summary page. Clicking navigates to planet detail page. Shows name, resident count, climate, terrain, and population.

## Dependencies
- `src/components/Card.tsx`
- `src/utils/formatBigNumber.ts`
- `src/types/index.ts` (Planet type)
- react-router-dom 6.28.0
- styled-components 6.1.8

## Prompt

> Create a PlanetCard component that displays planet information and navigates to detail page on click.
>
> **Create `src/components/PlanetCard.tsx`:**
>
> **Props interface:**
> ```typescript
> interface PlanetCardProps {
>   planet: Planet;
> }
> ```
>
> **Layout:**
> - Header section with planet name and resident count badge
> - Detail rows for climate, terrain, population
> - Use Card component with hoverable prop
>
> **Styled components:**
>
> **1. Header:**
> Flex wrapper with space between title and badge. Padding and background color using Mantine CSS variables.
> **2. Title:**
> H4 element with Mantine font size and weight
>
> **3. Badge (resident count):**
> rounded with blue theme colors. small.
>
> **4. DetailText (definition list):**
> Use dl/dt/dd elements. dt is bold, dd is normal weight. Spacing between rows. All but last children have bottom border.
>
> **Component logic:**
> 1. Use useNavigate() from react-router-dom
> 2. Calculate resident text with pluralization: if residents.length === 1, show "1 resident", else show "X residents"
> 3. Format population using formatBigNumber utility
> 4. Wrap in Card component with hoverable and onClick props
>
> **Key features:**
> - Uses semantic HTML (dl/dt/dd for key-value pairs)
> - Pluralizes "resident" vs "residents"
> - Formats large population numbers (e.g., "1.5M")
> - Navigates to detail page on click
> - Uses Mantine CSS variables for theming

## Expected Output
A single component file at `src/components/PlanetCard.tsx` that renders planet information in a clickable card.

## Key Constraints
- Use Card component with hoverable prop
- Use formatBigNumber for population display
- Use semantic HTML (dl/dt/dd elements)
- Pluralize resident count correctly
- Navigate to `/planets/${planet.id}` on click
- Use Mantine CSS variables only
- No hardcoded colors or spacing
