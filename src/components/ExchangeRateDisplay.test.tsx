// Written by Kimi K2.5
import { render, screen } from '@testing-library/react';
import ExchangeRateDisplay from './ExchangeRateDisplay';
import { useExchangeRate } from '../hooks/useExchangeRate';

jest.mock('axios');
jest.mock('../api/client', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    put: jest.fn(),
  },
}));


jest.mock('../hooks/useExchangeRate');

describe('ExchangeRateDisplay', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading skeleton when loading', () => {
    (useExchangeRate as jest.Mock).mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
    });

    const { container } = render(<ExchangeRateDisplay />);

    expect(container.querySelector('[class*="sc-"]')).toBeInTheDocument();
  });

  it('renders exchange rate when loaded', () => {
    (useExchangeRate as jest.Mock).mockReturnValue({
      data: { rate: '1.5' },
      isLoading: false,
      isError: false,
    });

    render(<ExchangeRateDisplay />);

    expect(screen.getByText(/1 GCS =/)).toBeInTheDocument();
    expect(screen.getByText('1.50000000')).toBeInTheDocument();
  });

  it('handles rate with many decimal places', () => {
    (useExchangeRate as jest.Mock).mockReturnValue({
      data: { rate: '1.54321' },
      isLoading: false,
      isError: false,
    });

    render(<ExchangeRateDisplay />);

    expect(screen.getByText('1.54321000')).toBeInTheDocument();
  });

  it('handles rate of 1', () => {
    (useExchangeRate as jest.Mock).mockReturnValue({
      data: { rate: '1' },
      isLoading: false,
      isError: false,
    });

    render(<ExchangeRateDisplay />);

    expect(screen.getByText('1.00000000')).toBeInTheDocument();
  });

  it('shows placeholder when no data', () => {
    (useExchangeRate as jest.Mock).mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: false,
    });

    render(<ExchangeRateDisplay />);

    expect(screen.getByText('—')).toBeInTheDocument();
  });
});
