import { formatBigNumber } from './formatBigNumber';

describe('formatBigNumber', () => {
  // basic ranges
  it('returns small numbers as-is', () => {
    expect(formatBigNumber(42)).toBe('42');
    expect(formatBigNumber(999)).toBe('999');
  });

  it('formats thousands with K suffix', () => {
    expect(formatBigNumber(1000)).toBe('1K');
    expect(formatBigNumber(5200)).toBe('5.2K');
    expect(formatBigNumber(10000)).toBe('10K');
    expect(formatBigNumber(999999)).toBe('1,000K'); // This could be an edge case.
  });

  it('formats millions with M suffix', () => {
    expect(formatBigNumber(1000000)).toBe('1M');
    expect(formatBigNumber(2500000)).toBe('2.5M');
    expect(formatBigNumber(45600000)).toBe('45.6M');
  });

  it('caps at M suffix for billions and above', () => {
    expect(formatBigNumber(1000000000)).toBe('1,000M');
    expect(formatBigNumber(2000000000)).toBe('2,000M');
  });

  // string input
  it('parses numeric strings', () => {
    expect(formatBigNumber('200000')).toBe('200K');
    expect(formatBigNumber('1000000')).toBe('1M');
  });

  it('returns non-numeric strings as-is', () => {
    expect(formatBigNumber('unknown')).toBe('unknown');
    expect(formatBigNumber('n/a')).toBe('n/a');
  });

  // edge cases
  it('returns "0" for zero', () => {
    expect(formatBigNumber(0)).toBe('0');
    expect(formatBigNumber('0')).toBe('0');
  });

  it('handles single digit numbers', () => {
    expect(formatBigNumber(1)).toBe('1');
    expect(formatBigNumber(9)).toBe('9');
  });

  it('drops trailing .0 after suffix', () => {
    expect(formatBigNumber(5000)).toBe('5K');
    expect(formatBigNumber(3000000)).toBe('3M');
  });

  it('keeps one decimal when meaningful', () => {
    expect(formatBigNumber(1500)).toBe('1.5K');
    expect(formatBigNumber(2700000)).toBe('2.7M');
  });

  it('rounds fractional suffixed values', () => { // This are the akward cases
    // 1,550 / 1000 = 1.55 → rounds to 1.6K
    expect(formatBigNumber(1550)).toBe('1.6K');
    // 1,450 / 1000 = 1.45 → rounds to 1.4K or 1.5K depending on Intl rounding
    expect(formatBigNumber(1450)).toBe('1.5K');
  });

  it('handles empty string', () => {
    expect(formatBigNumber('')).toBe('');
  });
});
