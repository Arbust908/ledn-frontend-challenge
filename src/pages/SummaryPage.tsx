// Written by ClaudeCode. Edited by hand for better logic

import styled from 'styled-components';
import { useState } from 'react';
import { usePlanets } from '../hooks/usePlanets';
import PlanetCard from '../components/PlanetCard';
import PlanetFilter from '../components/PlanetFilter';
import { SkeletonLoader } from '../styles/shared';
import Card from '../components/Card';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--mantine-spacing-lg);
  max-width: 1440px;
  margin: 0 auto;
`;

const Title = styled.h2`
  font-size: var(--mantine-font-size-h2);
  font-weight: var(--mantine-font-weight-bold);
  margin: 0;
`;

const PlanetGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 320px));
  gap: var(--mantine-spacing-md);
  justify-content: center;
`;

const SkeletonLine = styled(SkeletonLoader)`
  border-radius: var(--mantine-radius-sm);
`;

const SKELETON_COUNT = 6;

function SkeletonCard() {
  return (
    <Card>
      <SkeletonLine height="24px" width="60%" />
      <SkeletonLine height="16px" width="100%" style={{ marginTop: '0.75rem' }} />
      <SkeletonLine height="16px" width="100%" style={{ marginTop: '0.5rem' }} />
      <SkeletonLine height="16px" width="80%" style={{ marginTop: '0.5rem' }} />
    </Card>
  );
}

function SummaryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [climateFilter, setClimateFilter] = useState('');
  const [terrainFilter, setTerrainFilter] = useState('');

  const { data: planets, isLoading } = usePlanets();

  const allPlanets = planets ?? [];

  const filteredPlanets = allPlanets.filter(planet => {
    const matchesSearch = planet.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesClimate = !climateFilter || planet.climate.toLowerCase().includes(climateFilter);
    const matchesTerrain = !terrainFilter || planet.terrain.toLowerCase().includes(terrainFilter);
    return matchesSearch && matchesClimate && matchesTerrain;
  });

  return (
    <Container>
      <Title>Planets</Title>
      <PlanetFilter
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        climateValue={climateFilter}
        onClimateChange={setClimateFilter}
        terrainValue={terrainFilter}
        onTerrainChange={setTerrainFilter}
        planets={allPlanets}
        isLoading={isLoading}
      />
      <PlanetGrid>
        {isLoading
          ? Array.from({ length: SKELETON_COUNT }, (_, i) => <SkeletonCard key={i} />)
          : filteredPlanets.map((planet) => (
              <PlanetCard key={planet.id} planet={planet} />
            ))
        }
      </PlanetGrid>
    </Container>
  );
}

export default SummaryPage;
