
import { useMemo } from 'react';
import styled from 'styled-components';
import type { Planet } from '../types';
import { SkeletonLoader } from '../styles/shared';

interface PlanetFilterProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  climateValue: string;
  onClimateChange: (value: string) => void;
  terrainValue: string;
  onTerrainChange: (value: string) => void;
  planets: Planet[];
  isLoading?: boolean;
}

const SkeletonSelect = styled(SkeletonLoader)`
  border-radius: var(--mantine-radius-md);
  height: 42px;
`;

const FilterContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--mantine-spacing-sm);
  margin-bottom: var(--mantine-spacing-md);
  grid-template-areas:
    "search search"
    "climate climate"
    "terrain terrain";

  @media (min-width: 768px) {
    grid-template-areas:
      "search search"
      "climate terrain";
    grid-template-rows: 1fr 1fr;
  }
`;

const baseInputStyles = `
  padding: var(--mantine-spacing-sm) var(--mantine-spacing-md);
  font-size: var(--mantine-font-size-md);
  font-family: var(--mantine-font-family);
  line-height: var(--mantine-line-height);
  border: 2px solid var(--mantine-color-default-border);
  border-radius: var(--mantine-radius-md);
  background-color: var(--mantine-color-default);
  color: var(--mantine-color-default-color);
  outline: none;
  transition: all 0.2s ease;

  &:hover {
    border-color: var(--mantine-color-default-hover);
  }

  &:focus {
    border-color: var(--mantine-color-blue-6);
    box-shadow: 0 0 0 3px var(--mantine-color-blue-light);
  }
`;

const SearchInput = styled.input`
  ${baseInputStyles}
  &::placeholder {
    color: var(--mantine-color-placeholder);
  }
`;

const SelectInput = styled.select`
  ${baseInputStyles}
  cursor: pointer;
  appearance: none;
  background-repeat: no-repeat;
  background-position: right var(--mantine-spacing-sm) center;
  padding-right: calc(var(--mantine-spacing-md) + 16px);
`;

function normalizeText(text: string) { return text.trim().toLowerCase() }

function extractUniqueValues(planets: Planet[], field: 'climate' | 'terrain'): string[] {
  const values = new Set<string>();
  for (const planet of planets) {
    const fieldValue = planet[field];
    if (!fieldValue || fieldValue === 'unknown') continue;
    if (!fieldValue.includes(',')) { values.add(normalizeText(fieldValue)); }
    for (const part of fieldValue.split(',')) {
      const trimmed = normalizeText(part);
      if (trimmed) {
        values.add(trimmed);
      }
    }
  }
  return [...values].sort();
}

function PlanetFilter({
  searchValue,
  onSearchChange,
  climateValue,
  onClimateChange,
  terrainValue,
  onTerrainChange,
  planets,
  isLoading = false,
}: PlanetFilterProps) {
  const climates = useMemo(() => extractUniqueValues(planets, 'climate'), [planets]);
  const terrains = useMemo(() => extractUniqueValues(planets, 'terrain'), [planets]);

  return (
    <FilterContainer>
      <SearchInput
        type="text"
        placeholder="Search planets..."
        value={searchValue}
        onChange={(e) => onSearchChange(e.target.value)}
        style={{ gridArea: 'search' }}
      />
      {isLoading ? (
        <>
          <SkeletonSelect style={{ gridArea: 'climate' }} />
          <SkeletonSelect style={{ gridArea: 'terrain' }} />
        </>
      ) : (
        <>
          <SelectInput
            value={climateValue}
            onChange={(e) => onClimateChange(e.target.value)}
            style={{ gridArea: 'climate' }}
          >
            <option value="">All climates</option>
            {climates.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </SelectInput>
          <SelectInput
            value={terrainValue}
            onChange={(e) => onTerrainChange(e.target.value)}
            style={{ gridArea: 'terrain' }}
          >
            <option value="">All terrains</option>
            {terrains.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </SelectInput>
        </>
      )}
    </FilterContainer>
  );
}

export default PlanetFilter;
