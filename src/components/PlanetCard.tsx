// Written by ClaudeCode

import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Planet } from "../types";
import { formatBigNumber } from '../utils/formatBigNumber';
import Card from './Card';

interface PlanetCardProps {
  planet: Planet;
}

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--mantine-spacing-xs);
  position: relative;
`;

const Title = styled.h4`
  font-size: var(--mantine-h4-font-size);
  line-height: var(--mantine-h4-line-height);
  font-weight: var(--mantine-h4-font-weight);
  margin: 0;
  color: var(--mantine-color-text);
`;

const Badge = styled.span`
  background: var(--mantine-color-blue-filled);
  color: var(--mantine-color-dark-filled);
  padding: 0.25rem 0.5rem;
  border-radius: var(--mantine-radius-sm);
  font-size: var(--mantine-font-size-xs);
  font-weight: 500;
  position: absolute;
  top: -2em;
  right: -2em;
`;

const DetailText = styled.dl`
  font-size: var(--mantine-font-size-sm);
  line-height: var(--mantine-line-height-sm);
  color: var(--mantine-color-dimmed);
  margin: 0.25rem 0;

   &:not(:last-child) {
    border-bottom: 1px solid var(--mantine-color-default-border);
    padding-bottom: 0.25rem;
    margin-bottom: 0.25rem;
  }

  & > dd {
    font-weight: 700;
    text-transform: capitalize;
    text-align: right;
    margin-inline-start: 0;
    color: var(--mantine-color-text);
  }
  
`;

function PlanetCard({ planet }: PlanetCardProps) {
    const navigate = useNavigate();
    const residentText = `${planet.residents.length} ${planet.residents.length === 1 ? 'resident' : 'residents'}`;

  return (
    <Card
      hoverable
      onClick={() => navigate(`/planets/${planet.id}`)}
    >
      <Header>
        <Title>{planet.name}</Title>
        <Badge>{residentText}</Badge>
      </Header>
      <DetailText>
        <dt>Climate:</dt>
        <dd>{planet.climate}</dd>
      </DetailText>
      <DetailText>
        <dt>Terrain:</dt>
        <dd>{planet.terrain}</dd>
      </DetailText>
      <DetailText>
        <dt>Population:</dt>
        <dd>{formatBigNumber(planet.population)}</dd>
      </DetailText>
    </Card>
  )
}

export default PlanetCard;