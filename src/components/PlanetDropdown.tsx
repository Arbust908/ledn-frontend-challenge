import { useMemo } from 'react';
import styled from 'styled-components';
import { ChevronDown } from 'lucide-react';
import type { Planet } from '../types';

interface PlanetDropdownProps {
  value: string;
  onChange: (value: string) => void;
  planets: Planet[];
  isLoading?: boolean;
}

const Wrapper = styled.div`
  position: relative;
  display: inline-grid;
`;

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

const IconWrapper = styled.div`
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  color: var(--mantine-color-dimmed);
  display: grid;
  place-items: center;
`;

function PlanetDropdown({ value, onChange, planets, isLoading }: PlanetDropdownProps) {
  const sortedPlanets = useMemo(
    () => [...planets].sort((a, b) => a.name.localeCompare(b.name)),
    [planets],
  );

  return (
    <Wrapper>
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
      <IconWrapper>
        <ChevronDown size={14} />
      </IconWrapper>
    </Wrapper>
  );
}

export default PlanetDropdown;
