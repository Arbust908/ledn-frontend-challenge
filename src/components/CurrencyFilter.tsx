import styled from 'styled-components';
import { motion } from 'motion/react';
import type { Currency } from '../types';

type CurrencyFilterValue = Currency | '';

interface CurrencyFilterProps {
  value: CurrencyFilterValue;
  onChange: (value: CurrencyFilterValue) => void;
}

const FilterGroup = styled.fieldset`
  display: inline-flex;
  padding: 2px;
  margin: 0;
  background: var(--mantine-color-default);
  border-radius: var(--mantine-radius-md);
  border: 1px solid var(--mantine-color-default-border);
  position: relative;
  flex-shrink: 0;
`;

const Legend = styled.legend`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
`;

const FilterButton = styled.button<{ $active: boolean }>`
  position: relative;
  z-index: 1;
  padding: 6px 16px;
  border-radius: calc(var(--mantine-radius-md) - 2px);
  border: none;
  background: transparent;
  color: ${({ $active }) =>
    $active ? 'var(--mantine-color-violet-light-color)' : 'var(--mantine-color-dimmed)'};
  cursor: pointer;
  font-size: var(--mantine-font-size-sm);
  font-family: var(--mantine-font-family);
  font-weight: ${({ $active }) => ($active ? '600' : '400')};
  transition: color 0.2s ease;
  white-space: nowrap;

  &:hover {
    color: ${({ $active }) =>
      $active ? 'var(--mantine-color-violet-light-color)' : 'var(--mantine-color-default-color)'};
  }

  &:focus-visible {
    outline: 2px solid var(--mantine-color-violet-outline);
    outline-offset: -2px;
  }
`;

const Pill = styled(motion.div)`
  position: absolute;
  inset: 0;
  border-radius: calc(var(--mantine-radius-md) - 2px);
  background: var(--mantine-color-violet-light);
  z-index: 0;
`;

const options: { label: string; value: CurrencyFilterValue; title?: string }[] = [
  { label: 'All', value: '', title: 'Show all transactions' },
  { label: 'ICS', value: 'ICS', title: 'Imperial Crown Standard' },
  { label: 'GCS', value: 'GCS', title: 'Galactic Credit Standard' },
];

function CurrencyFilter({ value, onChange }: CurrencyFilterProps) {
  return (
    <FilterGroup role="radiogroup" aria-label="Filter by currency">
      <Legend>Filter by currency</Legend>
      {options.map((option) => (
        <FilterButton
          key={option.value}
          $active={value === option.value}
          onClick={() => onChange(option.value)}
          type="button"
          role="radio"
          aria-checked={value === option.value}
          title={option.title}
        >
          {value === option.value && (
            <Pill
              layoutId="currency-pill"
              transition={{ type: 'spring', stiffness: 500, damping: 35 }}
            />
          )}
          <span style={{ position: 'relative', zIndex: 1 }}>{option.label}</span>
        </FilterButton>
      ))}
    </FilterGroup>
  );
}

export default CurrencyFilter;
export type { CurrencyFilterValue };
