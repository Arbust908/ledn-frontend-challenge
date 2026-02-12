// Written by Kimi K2.5

import { render, screen, fireEvent } from '@testing-library/react';
import PlanetFilter from './PlanetFilter';
import type { Planet } from '../types';

describe('PlanetFilter', () => {
  const mockPlanets: Planet[] = [
    { id: '1', name: 'Tatooine', climate: 'arid', terrain: 'desert', residents: [], films: [], created: '', edited: '', rotation_period: '', orbital_period: '', diameter: '', gravity: '', surface_water: '', population: '' },
    { id: '2', name: 'Alderaan', climate: 'temperate', terrain: 'grasslands, mountains', residents: [], films: [], created: '', edited: '', rotation_period: '', orbital_period: '', diameter: '', gravity: '', surface_water: '', population: '' },
    { id: '3', name: 'Yavin IV', climate: 'temperate, tropical', terrain: 'jungle', residents: [], films: [], created: '', edited: '', rotation_period: '', orbital_period: '', diameter: '', gravity: '', surface_water: '', population: '' },
  ];

  const defaultProps = {
    searchValue: '',
    onSearchChange: jest.fn(),
    climateValue: '',
    onClimateChange: jest.fn(),
    terrainValue: '',
    onTerrainChange: jest.fn(),
    planets: mockPlanets,
    isLoading: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders search input', () => {
    render(<PlanetFilter {...defaultProps} />);

    expect(screen.getByPlaceholderText('Search planets...')).toBeInTheDocument();
  });

  it('renders climate and terrain selects with options', () => {
    render(<PlanetFilter {...defaultProps} />);

    const selects = screen.getAllByRole('combobox');
    expect(selects).toHaveLength(2);
    expect(screen.getByRole('option', { name: /all climates/i })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: /all terrains/i })).toBeInTheDocument();
  });

  it('extracts unique sorted climates from planets', () => {
    render(<PlanetFilter {...defaultProps} />);

    expect(screen.getByRole('option', { name: 'arid' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'temperate' })).toBeInTheDocument();
  });

  it('extracts unique sorted terrains from planets', () => {
    render(<PlanetFilter {...defaultProps} />);

    expect(screen.getByRole('option', { name: 'desert' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'grasslands' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'jungle' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'mountains' })).toBeInTheDocument();
  });

  it('calls onSearchChange when typing in search input', () => {
    render(<PlanetFilter {...defaultProps} />);

    fireEvent.change(screen.getByPlaceholderText('Search planets...'), { target: { value: 'Tatoo' } });

    expect(defaultProps.onSearchChange).toHaveBeenCalledWith('Tatoo');
  });

  it('calls onClimateChange when selecting climate', () => {
    render(<PlanetFilter {...defaultProps} />);

    const selects = screen.getAllByRole('combobox');
    fireEvent.change(selects[0], { target: { value: 'arid' } });

    expect(defaultProps.onClimateChange).toHaveBeenCalledWith('arid');
  });

  it('calls onTerrainChange when selecting terrain', () => {
    render(<PlanetFilter {...defaultProps} />);

    const selects = screen.getAllByRole('combobox');
    fireEvent.change(selects[1], { target: { value: 'desert' } });

    expect(defaultProps.onTerrainChange).toHaveBeenCalledWith('desert');
  });

  it('renders skeleton loaders when loading', () => {
    render(<PlanetFilter {...defaultProps} isLoading={true} />);

    const skeletons = document.querySelectorAll('.sc-beySPh');
    expect(skeletons).toHaveLength(2);
  });

  it('shows clear button when search has value', () => {
    render(<PlanetFilter {...defaultProps} searchValue="test" />);

    expect(screen.getByRole('button', { name: /clear search/i })).toBeInTheDocument();
  });

  it('clears search when clear button is clicked', () => {
    render(<PlanetFilter {...defaultProps} searchValue="test" />);

    fireEvent.click(screen.getByRole('button', { name: /clear search/i }));

    expect(defaultProps.onSearchChange).toHaveBeenCalledWith('');
  });

  it('normalizes climate values (lowercase, trimmed)', () => {
    const planetsWithMixedCase: Planet[] = [
      { id: '1', name: 'Planet1', climate: 'ArID', terrain: 'desert', residents: [], films: [], created: '', edited: '', rotation_period: '', orbital_period: '', diameter: '', gravity: '', surface_water: '', population: '' },
    ];

    render(<PlanetFilter {...defaultProps} planets={planetsWithMixedCase} />);

    expect(screen.getByRole('option', { name: 'arid' })).toBeInTheDocument();
  });

  it('handles unknown climate values', () => {
    const planetsWithUnknown: Planet[] = [
      { id: '1', name: 'Planet1', climate: 'unknown', terrain: 'desert', residents: [], films: [], created: '', edited: '', rotation_period: '', orbital_period: '', diameter: '', gravity: '', surface_water: '', population: '' },
    ];

    render(<PlanetFilter {...defaultProps} planets={planetsWithUnknown} />);

    expect(screen.queryByRole('option', { name: 'unknown' })).not.toBeInTheDocument();
  });

  it('handles empty planets array', () => {
    render(<PlanetFilter {...defaultProps} planets={[]} />);

    expect(screen.getByRole('option', { name: /all climates/i })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: /all terrains/i })).toBeInTheDocument();
  });
});
