# Utility Functions

## Context
Helper functions used throughout the application. Currently contains formatBigNumber for condensing large numbers with suffixes.

## Dependencies
None (pure JavaScript/TypeScript utilities).

## Prompt

> Create utility functions for common data formatting tasks.
>
> **Create `src/utils/formatBigNumber.ts`:**
>
> **Function: formatBigNumber(value: string | number): string**
>
> Converts huge numbers into condensed numbers with suffixes (K, M, B, T).
>
> **Requirements:**
> - Accept either string or number input
> - Convert to number and handle edge cases:
>   - If NaN or 0, return the original value as string
> - Use suffixes: "" (none), "K" (thousands), "M" (millions), "B" (billions), "T" (trillions)
> - Calculate suffix index using `Math.floor(Math.log10(num) / 3)`
> - Divide number by `Math.pow(1000, suffixIndex)` to get short value
> - If result is integer (shortValue % 1 === 0), use toFixed(0)
> - Otherwise use toFixed(1) to show one decimal place
> - Examples:
>   - 5200 → "5.2K"
>   - 5000 → "5K"
>   - 1000000 → "1M"
>   - 1500000 → "1.5M"
>   - 1000000000 → "1B"
>
> **Add JSDoc comment:**
> ```typescript
> /**
>  * Converts huge numbers into condensed numbers with suffixes (K, M, B, T).
>  * If a string is passed, it will be returned as is. This is to handle the case where the value is already formatted or unknown.
>  *
>  * We want to make sure that 5200 is shown as 5.2K and not 5K, so we will use toFixed(1) and then remove the .0 if it exists.
>  * But we don't want to show 5.0K, we want to show 5K, so we will use toFixed(0) if the number is an integer after dividing by the suffix value.
>  *
>  * @param value Number or String to format
>  * @returns Formatted string with suffixes
>  */
> ```
>
> **Implementation structure:**
> ```typescript
> export function formatBigNumber(value: string | number): string {
>   const num = Number(value);
>   if (isNaN(num) || num === 0) {
>     return String(value);
>   }
>
>   const suffixes = ["", "K", "M", "B", "T"];
>   const suffixIndex = Math.floor(Math.log10(num) / 3);
>   const shortValue = num / Math.pow(1000, suffixIndex);
>
>   if (shortValue % 1 === 0) {
>     return `${shortValue.toFixed(0)}${suffixes[suffixIndex]}`;
>   }
>   return `${shortValue.toFixed(1)}${suffixes[suffixIndex]}`;
> }
> ```

## Expected Output
A single file at `src/utils/formatBigNumber.ts` containing the formatBigNumber function with JSDoc comments.

## Key Constraints
- Accept both string and number inputs
- Handle edge cases (NaN, 0)
- Use logarithm for efficient suffix calculation
- Show one decimal place only when needed
- Return string (not number)
- Export as named export
- Include comprehensive JSDoc
