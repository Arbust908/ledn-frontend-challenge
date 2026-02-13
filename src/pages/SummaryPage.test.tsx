// Written by Kimi K2.5
import { render, screen, fireEvent, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import type { Planet } from '../types';
import SummaryPage from './SummaryPage';

// Mock motion/react to avoid animation issues
jest.mock('motion/react', () => ({
  motion: {
    div: ({ children, layoutId, layout, ...props }: React.HTMLAttributes<HTMLDivElement> & { layoutId?: string; layout?: boolean }) => (
      <div data-testid={layoutId} {...props}>{children}</div>
    ),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// Mock usePlanets hook
const mockUsePlanets = jest.fn();
jest.mock('../hooks/usePlanets', () => ({
  usePlanets: () => mockUsePlanets(),
}));

// Mock PlanetCard to simplify assertions
jest.mock('../components/PlanetCard', () => {
  return function MockPlanetCard(props: Record<string, Record<string, string>>) {
    const planet = props.planet;
    return <div data-testid={`planet-card-${planet.id}`}>{planet.name}</div>;
  };
});

// Mock PlanetFilter to capture filter callbacks
jest.mock('../components/PlanetFilter', () => {
  return function MockPlanetFilter(props: Record<string, unknown>) {
    const mockOnSearchChange = props.onSearchChange as Function;
    const mockOnClimateChange = props.onClimateChange as Function;
    const mockOnTerrainChange = props.onTerrainChange as Function;
    return (
      <div data-testid="planet-filter">
        <input
          data-testid="search-input"
          value={props.searchValue as string}
          onChange={(e) => mockOnSearchChange(e.target.value)}
        />
        <select
          data-testid="climate-select"
          value={props.climateValue as string}
          onChange={(e) => mockOnClimateChange(e.target.value)}
        >
          <option value="">All climates</option>
          <option value="arid">arid</option>
          <option value="temperate">temperate</option>
          <option value="frozen">frozen</option>
        </select>
        <select
          data-testid="terrain-select"
          value={props.terrainValue as string}
          onChange={(e) => mockOnTerrainChange(e.target.value)}
        >
          <option value="">All terrains</option>
          <option value="desert">desert</option>
          <option value="grasslands">grasslands</option>
          <option value="tundra">tundra</option>
        </select>
      </div>
    );
  };
});

function makePlanet(overrides: Partial<Planet> = {}): Planet {
  return {
    id: '1',
    name: 'Tatooine',
    climate: 'arid',
    terrain: 'desert',
    population: '200000',
    residents: ['1', '2'],
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

const testPlanets: Planet[] = [
  makePlanet({ id: '1', name: 'Tatooine', climate: 'arid', terrain: 'desert' }),
  makePlanet({ id: '2', name: 'Hoth', climate: 'frozen', terrain: 'tundra' }),
  makePlanet({ id: '3', name: 'Naboo', climate: 'temperate', terrain: 'grasslands' }),
];

function renderPage() {
  return render(
    <MemoryRouter>
      <SummaryPage />
    </MemoryRouter>
  );
}

describe('SummaryPage', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
    mockUsePlanets.mockReturnValue({ data: testPlanets, isLoading: false });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders "Planets" heading', () => {
    renderPage();
    expect(screen.getByText('Planets')).toBeInTheDocument();
  });

  it('shows skeleton cards while loading', () => {
    mockUsePlanets.mockReturnValue({ data: undefined, isLoading: true });
    renderPage();

    expect(screen.queryByTestId('planet-card-1')).not.toBeInTheDocument();
    expect(screen.queryByTestId('planet-card-2')).not.toBeInTheDocument();
  });

  it('renders planet cards when data loads', () => {
    renderPage();

    expect(screen.getByTestId('planet-card-1')).toBeInTheDocument();
    expect(screen.getByTestId('planet-card-2')).toBeInTheDocument();
    expect(screen.getByTestId('planet-card-3')).toBeInTheDocument();
    expect(screen.getByText('Tatooine')).toBeInTheDocument();
    expect(screen.getByText('Hoth')).toBeInTheDocument();
    expect(screen.getByText('Naboo')).toBeInTheDocument();
  });

  it('filters planets by search query', () => {
    renderPage();

    fireEvent.change(screen.getByTestId('search-input'), {
      target: { value: 'Hoth' },
    });
    act(() => { jest.advanceTimersByTime(300); });

    expect(screen.getByTestId('planet-card-2')).toBeInTheDocument();
    expect(screen.queryByTestId('planet-card-1')).not.toBeInTheDocument();
    expect(screen.queryByTestId('planet-card-3')).not.toBeInTheDocument();
  });

  it('filters planets by climate', () => {
    renderPage();

    fireEvent.change(screen.getByTestId('climate-select'), {
      target: { value: 'frozen' },
    });

    expect(screen.getByTestId('planet-card-2')).toBeInTheDocument();
    expect(screen.queryByTestId('planet-card-1')).not.toBeInTheDocument();
    expect(screen.queryByTestId('planet-card-3')).not.toBeInTheDocument();
  });

  it('filters planets by terrain', () => {
    renderPage();

    fireEvent.change(screen.getByTestId('terrain-select'), {
      target: { value: 'grasslands' },
    });

    expect(screen.getByTestId('planet-card-3')).toBeInTheDocument();
    expect(screen.queryByTestId('planet-card-1')).not.toBeInTheDocument();
    expect(screen.queryByTestId('planet-card-2')).not.toBeInTheDocument();
  });

  it('renders no cards when filter matches nothing', () => {
    renderPage();

    fireEvent.change(screen.getByTestId('search-input'), {
      target: { value: 'Coruscant' },
    });
    act(() => { jest.advanceTimersByTime(300); });

    expect(screen.queryByTestId('planet-card-1')).not.toBeInTheDocument();
    expect(screen.queryByTestId('planet-card-2')).not.toBeInTheDocument();
    expect(screen.queryByTestId('planet-card-3')).not.toBeInTheDocument();
  });

  it('combines multiple filters', () => {
    const planets: Planet[] = [
      makePlanet({ id: '1', name: 'Tatooine', climate: 'arid', terrain: 'desert' }),
      makePlanet({ id: '2', name: 'Tatoo Prime', climate: 'arid', terrain: 'grasslands' }),
      makePlanet({ id: '3', name: 'Hoth', climate: 'frozen', terrain: 'tundra' }),
    ];
    mockUsePlanets.mockReturnValue({ data: planets, isLoading: false });
    renderPage();

    fireEvent.change(screen.getByTestId('search-input'), {
      target: { value: 'Tatoo' },
    });
    act(() => { jest.advanceTimersByTime(300); });

    expect(screen.getByTestId('planet-card-1')).toBeInTheDocument();
    expect(screen.getByTestId('planet-card-2')).toBeInTheDocument();
    expect(screen.queryByTestId('planet-card-3')).not.toBeInTheDocument();

    fireEvent.change(screen.getByTestId('terrain-select'), {
      target: { value: 'desert' },
    });

    expect(screen.getByTestId('planet-card-1')).toBeInTheDocument();
    expect(screen.queryByTestId('planet-card-2')).not.toBeInTheDocument();
    expect(screen.queryByTestId('planet-card-3')).not.toBeInTheDocument();
  });
});
