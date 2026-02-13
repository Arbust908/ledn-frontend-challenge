// Written by Kimi K2.5
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import TransactionsPage from './TransactionsPage';
import type { Planet, Transaction } from '../types';

// --- Imports for mocked modules ---
import { useTransactions, useUpdateTransactionsBatch } from '../hooks/useTransactions';
import { usePlanets } from '../hooks/usePlanets';

// --- Mocks ---

const mockMutate = jest.fn();

jest.mock('../hooks/useTransactions', () => ({
  useTransactions: jest.fn(),
  useUpdateTransactionsBatch: jest.fn(() => ({
    mutate: mockMutate,
    isPending: false,
  })),
}));

jest.mock('../hooks/usePlanets', () => ({
  usePlanets: jest.fn(),
}));

jest.mock('motion/react', () => ({
  motion: {
    div: ({
      children,
      layoutId,
      ...props
    }: React.HTMLAttributes<HTMLDivElement> & { layoutId?: string }) => (
      <div data-testid={layoutId} {...props}>
        {children}
      </div>
    ),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

jest.mock('../components/PlanetDropdown', () => {
  return function MockPlanetDropdown({
    value,
    onChange,
  }: {
    value: string;
    onChange: (v: string) => void;
  }) {
    return (
      <select
        data-testid="planet-filter"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">All</option>
        <option value="1">Tatooine</option>
        <option value="2">Alderaan</option>
      </select>
    );
  };
});

jest.mock('../components/StatusFilter', () => {
  return Object.assign(
    function MockStatusFilter({
      value,
      onChange,
    }: {
      value: string;
      onChange: (v: string) => void;
    }) {
      return (
        <select
          data-testid="status-filter"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          <option value="">All</option>
          <option value="inProgress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="blocked">Blocked</option>
        </select>
      );
    },
    { __esModule: false }
  );
});

jest.mock('../components/CurrencyFilter', () => {
  return Object.assign(
    function MockCurrencyFilter({
      value,
      onChange,
    }: {
      value: string;
      onChange: (v: string) => void;
    }) {
      return (
        <select
          data-testid="currency-filter"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          <option value="">All</option>
          <option value="ICS">ICS</option>
          <option value="GCS">GCS</option>
        </select>
      );
    },
    { __esModule: false }
  );
});

jest.mock('../components/TransactionsTable', () => {
  return function MockTable({ transactions }: { transactions: Transaction[] }) {
    return (
      <div data-testid="transactions-table">
        {transactions.length} transactions
      </div>
    );
  };
});

jest.mock('../components/Card', () => {
  return function MockCard({ children }: { children: React.ReactNode }) {
    return <div data-testid="card">{children}</div>;
  };
});

jest.mock('../styles/shared', () => ({
  SkeletonLoader: ({
    children,
    ...props
  }: React.HTMLAttributes<HTMLDivElement> & {
    height?: string;
    width?: string;
  }) => (
    <div data-testid="skeleton-line" {...props}>
      {children}
    </div>
  ),
}));

const mockUseTransactions = useTransactions as jest.MockedFunction<typeof useTransactions>;
const mockUsePlanets = usePlanets as jest.MockedFunction<typeof usePlanets>;
const mockUseUpdateBatch = useUpdateTransactionsBatch as jest.MockedFunction<typeof useUpdateTransactionsBatch>;

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
    residents: ['u1', 'u2'],
    films: [],
    created: '2014-12-09T13:50:49.641000Z',
    edited: '2014-12-20T20:58:18.411000Z',
    ...overrides,
  };
}

function makeTransaction(overrides: Partial<Transaction> = {}): Transaction {
  return {
    id: 'tx1',
    user: 'u1',
    amount: 100,
    currency: 'ICS',
    date: '2024-01-15T10:00:00Z',
    status: 'inProgress',
    ...overrides,
  };
}

// --- Helpers ---

function renderPage() {
  return render(
    <MemoryRouter>
      <TransactionsPage />
    </MemoryRouter>
  );
}

function setupLoadedState(
  transactions: Transaction[] = [],
  planets: Planet[] = []
) {
  mockUseTransactions.mockReturnValue({
    data: transactions,
    isLoading: false,
  } as any);
  mockUsePlanets.mockReturnValue({
    data: planets,
    isLoading: false,
  } as any);
  mockUseUpdateBatch.mockReturnValue({
    mutate: mockMutate,
    isPending: false,
  } as any);
}

// --- Tests ---

describe('TransactionsPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setupLoadedState();
  });

  it('renders the transactions heading', () => {
    renderPage();
    expect(screen.getByText('Transactions')).toBeInTheDocument();
  });

  it('shows skeleton rows while loading', () => {
    mockUseTransactions.mockReturnValue({
      data: undefined,
      isLoading: true,
    } as any);
    mockUsePlanets.mockReturnValue({
      data: undefined,
      isLoading: true,
    } as any);

    renderPage();

    const skeletons = screen.getAllByTestId('skeleton-line');
    expect(skeletons.length).toBe(8);
    expect(screen.queryByTestId('transactions-table')).not.toBeInTheDocument();
  });

  it('renders transactions table when data loads', () => {
    const txs = [makeTransaction(), makeTransaction({ id: 'tx2' })];
    setupLoadedState(txs);

    renderPage();

    expect(screen.getByTestId('transactions-table')).toHaveTextContent(
      '2 transactions'
    );
  });

  it('filters transactions by status', () => {
    const txs = [
      makeTransaction({ id: 'tx1', status: 'inProgress' }),
      makeTransaction({ id: 'tx2', status: 'completed' }),
      makeTransaction({ id: 'tx3', status: 'blocked' }),
    ];
    setupLoadedState(txs);

    renderPage();

    fireEvent.change(screen.getByTestId('status-filter'), {
      target: { value: 'completed' },
    });

    expect(screen.getByTestId('transactions-table')).toHaveTextContent(
      '1 transactions'
    );
  });

  it('filters transactions by currency', () => {
    const txs = [
      makeTransaction({ id: 'tx1', currency: 'ICS' }),
      makeTransaction({ id: 'tx2', currency: 'GCS' }),
      makeTransaction({ id: 'tx3', currency: 'ICS' }),
    ];
    setupLoadedState(txs);

    renderPage();

    fireEvent.change(screen.getByTestId('currency-filter'), {
      target: { value: 'GCS' },
    });

    expect(screen.getByTestId('transactions-table')).toHaveTextContent(
      '1 transactions'
    );
  });

  it('filters transactions by planet using resident set', () => {
    const planet = makePlanet({ id: '1', residents: ['u1', 'u3'] });
    const txs = [
      makeTransaction({ id: 'tx1', user: 'u1' }),
      makeTransaction({ id: 'tx2', user: 'u2' }),
      makeTransaction({ id: 'tx3', user: 'u3' }),
    ];
    setupLoadedState(txs, [planet]);

    renderPage();

    fireEvent.change(screen.getByTestId('planet-filter'), {
      target: { value: '1' },
    });

    expect(screen.getByTestId('transactions-table')).toHaveTextContent(
      '2 transactions'
    );
  });

  it('shows blockade button when planet is selected', () => {
    const planet = makePlanet({ id: '1', residents: ['u1'] });
    const txs = [makeTransaction({ id: 'tx1', user: 'u1', status: 'inProgress' })];
    setupLoadedState(txs, [planet]);

    renderPage();

    // no blockade button before selecting planet
    expect(screen.queryByText(/Execute Blockade/)).not.toBeInTheDocument();

    fireEvent.change(screen.getByTestId('planet-filter'), {
      target: { value: '1' },
    });

    expect(screen.getByText(/Execute Blockade/)).toBeInTheDocument();
  });

  it('hides blockade button when no planet selected', () => {
    const planet = makePlanet({ id: '1', residents: ['u1'] });
    const txs = [makeTransaction({ id: 'tx1', user: 'u1' })];
    setupLoadedState(txs, [planet]);

    renderPage();

    // select a planet, then deselect
    fireEvent.change(screen.getByTestId('planet-filter'), {
      target: { value: '1' },
    });
    expect(screen.getByText(/Execute Blockade/)).toBeInTheDocument();

    fireEvent.change(screen.getByTestId('planet-filter'), {
      target: { value: '' },
    });
    expect(screen.queryByText(/Execute Blockade/)).not.toBeInTheDocument();
  });

  it('blockade button shows correct in-progress count', () => {
    const planet = makePlanet({ id: '1', residents: ['u1', 'u2'] });
    const txs = [
      makeTransaction({ id: 'tx1', user: 'u1', status: 'inProgress' }),
      makeTransaction({ id: 'tx2', user: 'u2', status: 'inProgress' }),
      makeTransaction({ id: 'tx3', user: 'u1', status: 'completed' }),
      makeTransaction({ id: 'tx4', user: 'u3', status: 'inProgress' }), // not a resident
    ];
    setupLoadedState(txs, [planet]);

    renderPage();

    fireEvent.change(screen.getByTestId('planet-filter'), {
      target: { value: '1' },
    });

    expect(screen.getByText('Execute Blockade (2)')).toBeInTheDocument();
  });

  it('blockade button calls mutate with correct updates on click', () => {
    const planet = makePlanet({ id: '1', residents: ['u1'] });
    const txs = [
      makeTransaction({ id: 'tx1', user: 'u1', status: 'inProgress' }),
      makeTransaction({ id: 'tx2', user: 'u1', status: 'inProgress' }),
      makeTransaction({ id: 'tx3', user: 'u1', status: 'completed' }),
    ];
    setupLoadedState(txs, [planet]);

    renderPage();

    fireEvent.change(screen.getByTestId('planet-filter'), {
      target: { value: '1' },
    });

    fireEvent.click(screen.getByText(/Execute Blockade/));

    expect(mockMutate).toHaveBeenCalledTimes(1);
    expect(mockMutate).toHaveBeenCalledWith([
      { id: 'tx1', status: 'blocked' },
      { id: 'tx2', status: 'blocked' },
    ]);
  });

  it('blockade button is disabled when no in-progress transactions for planet', () => {
    const planet = makePlanet({ id: '1', residents: ['u1'] });
    const txs = [
      makeTransaction({ id: 'tx1', user: 'u1', status: 'completed' }),
      makeTransaction({ id: 'tx2', user: 'u1', status: 'blocked' }),
    ];
    setupLoadedState(txs, [planet]);

    renderPage();

    fireEvent.change(screen.getByTestId('planet-filter'), {
      target: { value: '1' },
    });

    const button = screen.getByText('Execute Blockade (0)');
    expect(button).toBeDisabled();

    fireEvent.click(button);
    expect(mockMutate).not.toHaveBeenCalled();
  });
});
