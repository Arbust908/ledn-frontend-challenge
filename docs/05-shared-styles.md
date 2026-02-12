# Shared Styled Components

## Context
Reusable styled-components used across the application. Currently contains a SkeletonLoader with shimmer animation for loading states.

## Dependencies
- styled-components 6.1.8

## Prompt

> Create shared styled-components for common UI patterns.
>
> **Create `src/styles/shared.ts`:**
>
> **1. Create shimmer keyframe animation:**
> ```typescript
> import styled, { keyframes } from 'styled-components';
>
> export const shimmer = keyframes`
>   from, to {
>     background-position: -100% 0;
>   }
>   50% {
>     background-position: 100% 0;
>   }
> `;
> ```
>
> **2. Create SkeletonLoader styled component:**
> ```typescript
> export const SkeletonLoader = styled.div<{ width?: string; height?: string }>`
>   background: linear-gradient(
>     90deg,
>     var(--mantine-color-default-hover) 0%,
>     var(--mantine-color-default) 50%,
>     var(--mantine-color-default-hover) 100%
>   );
>   background-size: 200% 100%;
>   animation: ${shimmer} 2s ease-in-out infinite;
>   width: ${props => props.width || '100%'};
>   min-height: ${props => props.height || '20px'};
> `;
> ```
>
> **Explanation:**
> - Uses Mantine CSS variables for colors that adapt to light/dark mode
> - `--mantine-color-default-hover` is lighter in light mode, darker in dark mode
> - `--mantine-color-default` is the base background color
> - Linear gradient creates a "wave" effect
> - background-size: 200% makes the gradient twice as wide as the element
> - Animation moves the gradient position from -100% to +100% and back
> - Props allow customizing width and height
> - Default width is 100%, default min-height is 20px
>
> **Usage example:**
> ```typescript
> import { SkeletonLoader } from '../styles/shared';
>
> // Basic usage
> <SkeletonLoader />
>
> // Custom size
> <SkeletonLoader width="200px" height="50px" />
> ```

## Expected Output
A single file at `src/styles/shared.ts` containing the shimmer animation and SkeletonLoader styled component. Both should be exported.

## Key Constraints
- Use styled-components (NOT Mantine UI components)
- Use Mantine CSS variables for theming (--mantine-color-*)
- Export both the keyframes and the styled component
- Support optional width and height props
- Use proper TypeScript types for props
- Animation should be smooth and infinite
- Must work in both light and dark color schemes
