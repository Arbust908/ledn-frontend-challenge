// Written by Kimi K2.5
import { render, screen } from '@testing-library/react';
import TransactionRow from './TransactionRow';
import { useResident } from '../hooks/useResident';
import { useExchangeRate } from '../hooks/useExchangeRate';

jest.mock('axios');
jest.mock('../api/client', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    put: jest.fn(),
  },
}));

jest.mock('../hooks/useResident');
jest.mock('../hooks/useExchangeRate');

describe('TransactionRow', () => {
  const mockTransaction = {
    id: '1',
    user: '1',
    amount: 100,
    currency: 'ICS' as const,
    date: '2024-01-01',
    status: 'completed' as const,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state when resident is loading', () => {
    (useResident as jest.Mock).mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
    });
    (useExchangeRate as jest.Mock).mockReturnValue({
      data: { rate: '1.5' },
      isLoading: false,
      isError: false,
    });

    const { container } = render(<TransactionRow transaction={mockTransaction} />);

    expect(container.querySelector('tr')).toBeInTheDocument();
  });

  it('renders loading state when exchange rate is loading', () => {
    (useResident as jest.Mock).mockReturnValue({
      data: { id: '1', name: 'Luke Skywalker' },
      isLoading: false,
      isError: false,
    });
    (useExchangeRate as jest.Mock).mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
    });

    const { container } = render(<TransactionRow transaction={mockTransaction} />);

    expect(container.querySelector('tr')).toBeInTheDocument();
  });

  it('renders transaction with ICS currency', () => {
    (useResident as jest.Mock).mockReturnValue({
      data: { id: '1', name: 'Luke Skywalker' },
      isLoading: false,
      isError: false,
    });
    (useExchangeRate as jest.Mock).mockReturnValue({
      data: { rate: '1.5' },
      isLoading: false,
      isError: false,
    });

    render(<TransactionRow transaction={mockTransaction} />);

    expect(screen.getByText('Luke Skywalker')).toBeInTheDocument();
    expect(screen.getByText('100.00000000')).toBeInTheDocument();
    expect(screen.getByText('150.00000000')).toBeInTheDocument();
  });

  it('renders transaction with GCS currency', () => {
    const gcsTransaction = {
      ...mockTransaction,
      currency: 'GCS' as const,
      amount: 150,
    };

    (useResident as jest.Mock).mockReturnValue({
      data: { id: '1', name: 'Luke Skywalker' },
      isLoading: false,
      isError: false,
    });
    (useExchangeRate as jest.Mock).mockReturnValue({
      data: { rate: '1.5' },
      isLoading: false,
      isError: false,
    });

    render(<TransactionRow transaction={gcsTransaction} />);

    expect(screen.getByText('100.00000000')).toBeInTheDocument();
    expect(screen.getByText('150.00000000')).toBeInTheDocument();
  });

  it('renders completed status badge', () => {
    (useResident as jest.Mock).mockReturnValue({
      data: { id: '1', name: 'Luke Skywalker' },
      isLoading: false,
      isError: false,
    });
    (useExchangeRate as jest.Mock).mockReturnValue({
      data: { rate: '1.5' },
      isLoading: false,
      isError: false,
    });

    render(<TransactionRow transaction={mockTransaction} />);

    expect(screen.getByText('Completed')).toBeInTheDocument();
  });

  it('renders inProgress status badge', () => {
    const inProgressTransaction = {
      ...mockTransaction,
      status: 'inProgress' as const,
    };

    (useResident as jest.Mock).mockReturnValue({
      data: { id: '1', name: 'Luke Skywalker' },
      isLoading: false,
      isError: false,
    });
    (useExchangeRate as jest.Mock).mockReturnValue({
      data: { rate: '1.5' },
      isLoading: false,
      isError: false,
    });

    render(<TransactionRow transaction={inProgressTransaction} />);

    expect(screen.getByText('In Progress')).toBeInTheDocument();
  });

  it('renders blocked status badge', () => {
    const blockedTransaction = {
      ...mockTransaction,
      status: 'blocked' as const,
    };

    (useResident as jest.Mock).mockReturnValue({
      data: { id: '1', name: 'Luke Skywalker' },
      isLoading: false,
      isError: false,
    });
    (useExchangeRate as jest.Mock).mockReturnValue({
      data: { rate: '1.5' },
      isLoading: false,
      isError: false,
    });

    render(<TransactionRow transaction={blockedTransaction} />);

    expect(screen.getByText('Blocked')).toBeInTheDocument();
  });
});
