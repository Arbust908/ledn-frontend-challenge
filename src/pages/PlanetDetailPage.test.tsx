// Written by Kimi K2.5
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import type { Planet, Transaction } from '../types';

// --- Mocks ---

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ id: '1' }),
  useNavigate: () => mockNavigate,
}));

const mockUsePlanet = jest.fn();
jest.mock('../hooks/usePlanets', () => ({
  usePlanet: (...args: unknown[]) => mockUsePlanet(...args),
}));

const mockUseTransactionsByUsers = jest.fn();
jest.mock('../hooks/useTransactions', () => ({
  useTransactionsByUsers: (...args: unknown[]) => mockUseTransactionsByUsers(...args),
}));

const mockUseExchangeRate = jest.fn();
jest.mock('../hooks/useExchangeRate', () => ({
  useExchangeRate: () => mockUseExchangeRate(),
}));

jest.mock('motion/react', () => ({
  motion: {
    div: ({ children, layoutId, ...props }: React.HTMLAttributes<HTMLDivElement> & { layoutId?: string }) => (
      <div data-testid={layoutId} {...props}>{children}</div>
    ),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// Stub TransactionsTable to expose transaction count for assertions
jest.mock('../components/TransactionsTable', () => ({
  __esModule: true,
  default: ({ transactions }: { transactions: Transaction[] }) => (
    <div data-testid="transactions-table">
      {transactions.map((t) => (
        <div key={t.id} data-testid={`tx-${t.id}`}>
          {t.currency} {t.amount}
        </div>
      ))}
      <span data-testid="tx-count">{transactions.length}</span>
    </div>
  ),
}));

// Stub CurrencyFilter to allow testing filter interaction via direct onChange calls
jest.mock('../components/CurrencyFilter', () => {
  const actual = jest.requireActual('../components/CurrencyFilter');
  return {
    __esModule: true,
    ...actual,
    default: ({ value, onChange }: { value: string; onChange: (v: string) => void }) => (
      <div data-testid="currency-filter">
        <button data-testid="filter-all" onClick={() => onChange('')}>All</button>
        <button data-testid="filter-ics" onClick={() => onChange('ICS')}>ICS</button>
        <button data-testid="filter-gcs" onClick={() => onChange('GCS')}>GCS</button>
        <span data-testid="filter-value">{value}</span>
      </div>
    ),
  };
});

import PlanetDetailPage from './PlanetDetailPage';

// --- Factories ---

function makePlanet(overrides: Partial<Planet> = {}): Planet {
  return {
    id: '1',
    name: 'Tatooine',
    rotation_period: '23',
    orbital_period: '304',
    diameter: '10465',
    climate: 'arid',
    gravity: '1 standard',
    terrain: 'desert',
    surface_water: '1',
    population: '200000',
    residents: ['user-1', 'user-2'],
    films: [],
    created: '2014-12-09T00:00:00.000Z',
    edited: '2014-12-20T00:00:00.000Z',
    ...overrides,
  };
}

function makeTransaction(overrides: Partial<Transaction> = {}): Transaction {
  return {
    id: 'tx-1',
    user: 'user-1',
    amount: 100,
    currency: 'ICS',
    date: '2024-01-15T10:30:00.000Z',
    status: 'completed',
    ...overrides,
  };
}

// --- Helpers ---

function renderPage() {
  return render(
    <MemoryRouter>
      <PlanetDetailPage />
    </MemoryRouter>
  );
}

function setupDefaults(
  planetOverrides: Partial<Planet> = {},
  transactions: Transaction[] = [makeTransaction()],
  exchangeRate = '1.5',
) {
  mockUsePlanet.mockReturnValue({
    data: makePlanet(planetOverrides),
    isLoading: false,
  });
  mockUseTransactionsByUsers.mockReturnValue({
    data: transactions,
    isLoading: false,
  });
  mockUseExchangeRate.mockReturnValue({
    data: { rate: exchangeRate },
    isLoading: false,
  });
}

// --- Tests ---

describe('PlanetDetailPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders planet name as heading when loaded', () => {
    setupDefaults({ name: 'Coruscant' });
    renderPage();

    expect(screen.getByRole('heading', { level: 2, name: 'Coruscant' })).toBeInTheDocument();
  });

  it('renders "Planet not found" when planet does not exist', () => {
    mockUsePlanet.mockReturnValue({ data: undefined, isLoading: false });
    mockUseTransactionsByUsers.mockReturnValue({ data: [], isLoading: false });
    mockUseExchangeRate.mockReturnValue({ data: { rate: '1.5' }, isLoading: false });

    renderPage();

    expect(screen.getByText('Planet not found')).toBeInTheDocument();
  });

  it('shows loading skeletons while planet is loading', () => {
    mockUsePlanet.mockReturnValue({ data: undefined, isLoading: true });
    mockUseTransactionsByUsers.mockReturnValue({ data: undefined, isLoading: true });
    mockUseExchangeRate.mockReturnValue({ data: undefined, isLoading: true });

    renderPage();

    // Should not render a planet heading
    expect(screen.queryByRole('heading', { level: 2 })).not.toBeInTheDocument();
    // Should not render info card text
    expect(screen.queryByText('Climate')).not.toBeInTheDocument();
  });

  it('renders climate, terrain, population, and gravity info cards', () => {
    setupDefaults({
      climate: 'temperate',
      terrain: 'grasslands, mountains',
      population: '5000',
      gravity: '1 standard',
    });
    renderPage();

    expect(screen.getByText('Climate')).toBeInTheDocument();
    expect(screen.getByText('temperate')).toBeInTheDocument();

    expect(screen.getByText('Terrain')).toBeInTheDocument();
    expect(screen.getByText('grasslands, mountains')).toBeInTheDocument();

    expect(screen.getByText('Population')).toBeInTheDocument();

    expect(screen.getByText('Gravity')).toBeInTheDocument();
    expect(screen.getByText('1 standard')).toBeInTheDocument();
  });

  it('formats large population with formatBigNumber', () => {
    setupDefaults({ population: '200000' });
    renderPage();

    // formatBigNumber('200000') => '200K'
    expect(screen.getByText('200K')).toBeInTheDocument();
  });

  it('renders total ICS and total GCS values', () => {
    const transactions = [
      makeTransaction({ id: 'tx-1', amount: 50, currency: 'ICS' }),
    ];
    setupDefaults({}, transactions, '1.5');
    renderPage();

    // Total ICS: 50 ICS = 50 ICS
    // Total GCS: 50 * 1.5 = 75 GCS
    expect(screen.getAllByText('Total ICS').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Total GCS').length).toBeGreaterThan(0);
  });

  it('calculates totals correctly with mixed currencies', () => {
    // rate = 1.5 (1 ICS = 1.5 GCS)
    // tx1: 100 ICS -> totalICS += 100, totalGCS += 150
    // tx2: 60 GCS  -> totalGCS += 60,  totalICS += 60/1.5 = 40
    // totals: ICS = 140, GCS = 210
    const transactions = [
      makeTransaction({ id: 'tx-1', amount: 100, currency: 'ICS' }),
      makeTransaction({ id: 'tx-2', amount: 60, currency: 'GCS' }),
    ];
    setupDefaults({}, transactions, '1.5');
    renderPage();

    // FINANCIAL_PRECISION.CRYPTO_AMOUNT = 8
    const expectedICS = '140.00000000';
    const expectedGCS = '210.00000000';

    expect(screen.getAllByText(expectedICS).length).toBeGreaterThan(0);
    expect(screen.getAllByText(expectedGCS).length).toBeGreaterThan(0);
  });

  it('shows "No transactions found" when no transactions for residents', () => {
    setupDefaults({}, []);
    renderPage();

    expect(
      screen.getByText('No transactions found for residents of this planet.')
    ).toBeInTheDocument();
  });

  it('renders transactions table with transaction data', () => {
    const transactions = [
      makeTransaction({ id: 'tx-1' }),
      makeTransaction({ id: 'tx-2', amount: 200, currency: 'GCS' }),
    ];
    setupDefaults({}, transactions);
    renderPage();

    expect(screen.getByTestId('transactions-table')).toBeInTheDocument();
    expect(screen.getByTestId('tx-count')).toHaveTextContent('2');
  });

  it('filters transactions by currency via CurrencyFilter', () => {
    const transactions = [
      makeTransaction({ id: 'tx-1', amount: 100, currency: 'ICS' }),
      makeTransaction({ id: 'tx-2', amount: 200, currency: 'GCS' }),
      makeTransaction({ id: 'tx-3', amount: 300, currency: 'ICS' }),
    ];
    setupDefaults({}, transactions);
    renderPage();

    // Initially shows all 3
    expect(screen.getByTestId('tx-count')).toHaveTextContent('3');

    // Click ICS filter
    fireEvent.click(screen.getByTestId('filter-ics'));
    expect(screen.getByTestId('tx-count')).toHaveTextContent('2');
    expect(screen.getByTestId('filter-value')).toHaveTextContent('ICS');

    // Click GCS filter
    fireEvent.click(screen.getByTestId('filter-gcs'));
    expect(screen.getByTestId('tx-count')).toHaveTextContent('1');

    // Click All to reset
    fireEvent.click(screen.getByTestId('filter-all'));
    expect(screen.getByTestId('tx-count')).toHaveTextContent('3');
  });

  it('navigates back when back button is clicked', () => {
    setupDefaults();
    renderPage();

    const backButton = screen.getByRole('button', { name: /back/i });
    fireEvent.click(backButton);

    expect(mockNavigate).toHaveBeenCalledWith('/');
  });
});
