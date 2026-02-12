/**
 * Converts huge numbers into condenced numbers with suffixes (K, M, B, T).
 * If a string is passed, it will be returned as is. This is to handle the case where the value is already formatted on unknown.
 * 
  // we want to make suere that 5200 is shown as 5.2K and not 5K, so we will use toFixed(1) and then remove the .0 if it exists. bu we dont want to show 5.0K, we want to show 5K, so we will use toFixed(0) if the number is an integer after dividing by the suffix value.
 * 
 * @param value Number or String to format
 * @returns Formatted string with suffixes
 */
export function formatBigNumber(value: string | number): string {
  const num = Number(value);
  if (isNaN(num) || num === 0) {
    return String(value);
  }

  const suffixes = ["", "K", "M", "B", "T"];
  const suffixIndex = Math.floor(Math.log10(num) / 3);
  const shortValue = num / Math.pow(1000, suffixIndex);

  if (shortValue % 1 === 0) {
    return `${shortValue.toFixed(0)}${suffixes[suffixIndex]}`;
  } 
  return `${shortValue.toFixed(1)}${suffixes[suffixIndex]}`;
}