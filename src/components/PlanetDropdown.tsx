import { useMemo } from 'react';
import styled from 'styled-components';
import type { Planet } from '../types';

interface PlanetDropdownProps {
  value: string;
  onChange: (value: string) => void;
  planets: Planet[];
  isLoading?: boolean;
}

const Select = styled.select`
  padding: 6px 32px 6px 12px;
  border-radius: var(--mantine-radius-md);
  border: 1px solid var(--mantine-color-default-border);
  background: var(--mantine-color-default);
  color: var(--mantine-color-text);
  font-size: var(--mantine-font-size-sm);
  font-family: var(--mantine-font-family);
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23868e96' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 10px center;
  min-width: 0;

  &:focus-visible {
    outline: 2px solid var(--mantine-color-violet-outline);
    outline-offset: -2px;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

function PlanetDropdown({ value, onChange, planets, isLoading }: PlanetDropdownProps) {
  const sortedPlanets = useMemo(
    () => [...planets].sort((a, b) => a.name.localeCompare(b.name)),
    [planets],
  );

  return (
    <Select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={isLoading}
      aria-label="Filter by planet"
    >
      <option value="">All Planets</option>
      {sortedPlanets.map((planet) => (
        <option key={planet.id} value={planet.id}>
          {planet.name}
        </option>
      ))}
    </Select>
  );
}

export default PlanetDropdown;
