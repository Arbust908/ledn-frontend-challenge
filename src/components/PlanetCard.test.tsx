import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import PlanetCard from './PlanetCard';
import type { Planet } from '../types';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

function makePlanet(overrides: Partial<Planet> = {}): Planet {
  return {
    id: '1',
    name: 'Tatooine',
    climate: 'arid',
    terrain: 'desert',
    population: '200000',
    residents: ['1', '2', '3'],
    rotation_period: '23',
    orbital_period: '304',
    diameter: '10465',
    gravity: '1 standard',
    surface_water: '1',
    films: [],
    created: '',
    edited: '',
    ...overrides,
  };
}

function renderCard(planet: Planet = makePlanet()) {
  return render(
    <MemoryRouter>
      <PlanetCard planet={planet} />
    </MemoryRouter>
  );
}

describe('PlanetCard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders planet name as heading', () => {
    renderCard();
    expect(screen.getByText('Tatooine')).toBeInTheDocument();
  });

  it('renders climate, terrain, and population details', () => {
    renderCard();
    expect(screen.getByText('arid')).toBeInTheDocument();
    expect(screen.getByText('desert')).toBeInTheDocument();
  });

  it('renders resident count badge with plural form', () => {
    renderCard(makePlanet({ residents: ['1', '2', '3'] }));
    expect(screen.getByText('3 residents')).toBeInTheDocument();
  });

  it('renders singular "resident" when only one resident', () => {
    renderCard(makePlanet({ residents: ['1'] }));
    expect(screen.getByText('1 resident')).toBeInTheDocument();
  });

  it('renders "0 residents" when no residents', () => {
    renderCard(makePlanet({ residents: [] }));
    expect(screen.getByText('0 residents')).toBeInTheDocument();
  });

  it('formats large population numbers', () => {
    renderCard(makePlanet({ population: '200000' }));
    expect(screen.getByText('200K')).toBeInTheDocument();
  });

  it('displays non-numeric population as-is', () => {
    renderCard(makePlanet({ population: 'unknown' }));
    expect(screen.getByText('unknown')).toBeInTheDocument();
  });

  it('navigates to planet detail page on click', () => {
    renderCard(makePlanet({ id: '42' }));
    userEvent.click(screen.getByText('Tatooine'));
    expect(mockNavigate).toHaveBeenCalledWith('/planets/42');
  });

  it('renders description list labels', () => {
    renderCard();
    expect(screen.getByText('Climate:')).toBeInTheDocument();
    expect(screen.getByText('Terrain:')).toBeInTheDocument();
    expect(screen.getByText('Population:')).toBeInTheDocument();
  });
});
