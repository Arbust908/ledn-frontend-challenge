
import { useMemo } from 'react';
import styled from 'styled-components';
import { X, ChevronDown } from 'lucide-react';
import type { Planet } from '../types';
import { SkeletonLoader } from '../styles/shared';
import { BREAKPOINTS } from '../utils/constants';

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

  @media (min-width: ${BREAKPOINTS.TABLET}) {
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
  width: 100%;

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
  padding-right: 36px;
  &::placeholder {
    color: var(--mantine-color-placeholder);
  }
`;

const SelectInput = styled.select`
  ${baseInputStyles}
  cursor: pointer;
  appearance: none;
  padding-right: 88px;
`;

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const ResetButton = styled.button`
  position: absolute;
  right: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border: none;
  background: var(--mantine-color-default-hover);
  border-radius: var(--mantine-radius-sm);
  cursor: pointer;
  color: var(--mantine-color-dimmed);
  transition: all 0.15s ease;

  &:hover {
    background: var(--mantine-color-default-border);
    color: var(--mantine-color-default-color);
  }
`;

const SelectIcons = styled.div`
  position: absolute;
  right: 0;
  display: flex;
  align-items: center;
  gap: 0;
  pointer-events: none;
`;

const SelectResetButton = styled(ResetButton)`
  position: static;
  pointer-events: auto;
`;

const ChevronIcon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  color: var(--mantine-color-dimmed);
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
      <InputWrapper style={{ gridArea: 'search' }}>
        <SearchInput
          type="text"
          placeholder="Search planets..."
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        {searchValue && (
          <ResetButton onClick={() => onSearchChange('')} aria-label="Clear search">
            <X size={14} />
          </ResetButton>
        )}
      </InputWrapper>
      {isLoading ? (
        <>
          <SkeletonSelect style={{ gridArea: 'climate' }} />
          <SkeletonSelect style={{ gridArea: 'terrain' }} />
        </>
      ) : (
        <>
          <InputWrapper style={{ gridArea: 'climate' }}>
            <SelectInput
              value={climateValue}
              onChange={(e) => onClimateChange(e.target.value)}
            >
              <option value="">All climates</option>
              {climates.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </SelectInput>
            <SelectIcons>
              {climateValue && (
                <SelectResetButton onClick={() => onClimateChange('')} aria-label="Reset climate filter">
                  <X size={14} />
                </SelectResetButton>
              )}
              <ChevronIcon>
                <ChevronDown size={16} />
              </ChevronIcon>
            </SelectIcons>
          </InputWrapper>
          <InputWrapper style={{ gridArea: 'terrain' }}>
            <SelectInput
              value={terrainValue}
              onChange={(e) => onTerrainChange(e.target.value)}
            >
              <option value="">All terrains</option>
              {terrains.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </SelectInput>
            <SelectIcons>
              {terrainValue && (
                <SelectResetButton onClick={() => onTerrainChange('')} aria-label="Reset terrain filter">
                  <X size={14} />
                </SelectResetButton>
              )}
              <ChevronIcon>
                <ChevronDown size={16} />
              </ChevronIcon>
            </SelectIcons>
          </InputWrapper>
        </>
      )}
    </FilterContainer>
  );
}

export default PlanetFilter;
