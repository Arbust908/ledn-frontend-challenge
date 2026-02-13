import styled from 'styled-components';
import { motion } from 'motion/react';
import type { Status } from '../types';

type StatusFilterValue = Status | '';

interface StatusFilterProps {
  value: StatusFilterValue;
  onChange: (value: StatusFilterValue) => void;
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

const options: { label: string; value: StatusFilterValue; title: string }[] = [
  { label: 'All', value: '', title: 'Show all statuses' },
  { label: 'In Progress', value: 'inProgress', title: 'Show in-progress transactions' },
  { label: 'Completed', value: 'completed', title: 'Show completed transactions' },
  { label: 'Blocked', value: 'blocked', title: 'Show blocked transactions' },
];

function StatusFilter({ value, onChange }: StatusFilterProps) {
  return (
    <FilterGroup role="radiogroup" aria-label="Filter by status">
      <Legend>Filter by status</Legend>
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
              layoutId="status-pill"
              transition={{ type: 'spring', stiffness: 500, damping: 35 }}
            />
          )}
          <span style={{ position: 'relative', zIndex: 1 }}>{option.label}</span>
        </FilterButton>
      ))}
    </FilterGroup>
  );
}

export default StatusFilter;
export type { StatusFilterValue };
