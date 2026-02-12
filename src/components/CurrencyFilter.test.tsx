// Use cases boostraped by hand, but implementation written by ClaudeCode.
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CurrencyFilter from './CurrencyFilter';
import type { CurrencyFilterValue } from './CurrencyFilter';

// Mock motion/react to avoid animation complexities in tests
jest.mock('motion/react', () => ({
  motion: {
    div: ({ children, layoutId, ...props }: React.HTMLAttributes<HTMLDivElement> & { layoutId?: string }) => (
      <div data-testid={layoutId} {...props}>{children}</div>
    ),
  },
}));

describe('CurrencyFilter', () => {
  const defaultProps = {
    value: '' as CurrencyFilterValue,
    onChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all three filter options', () => {
    render(<CurrencyFilter {...defaultProps} />);

    expect(screen.getByRole('radio', { name: /all/i })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: /ics/i })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: /gcs/i })).toBeInTheDocument();
  });

  it('renders as a radiogroup with accessible label', () => {
    render(<CurrencyFilter {...defaultProps} />);

    const group = screen.getByRole('radiogroup', { name: /filter by currency/i });
    expect(group).toBeInTheDocument();
  });

  it('marks "All" as checked when value is empty string', () => {
    render(<CurrencyFilter {...defaultProps} value="" />);

    expect(screen.getByRole('radio', { name: /all/i })).toHaveAttribute('aria-checked', 'true');
    expect(screen.getByRole('radio', { name: /ics/i })).toHaveAttribute('aria-checked', 'false');
    expect(screen.getByRole('radio', { name: /gcs/i })).toHaveAttribute('aria-checked', 'false');
  });

  it('marks "ICS" as checked when value is ICS', () => {
    render(<CurrencyFilter {...defaultProps} value="ICS" />);

    expect(screen.getByRole('radio', { name: /all/i })).toHaveAttribute('aria-checked', 'false');
    expect(screen.getByRole('radio', { name: /ics/i })).toHaveAttribute('aria-checked', 'true');
    expect(screen.getByRole('radio', { name: /gcs/i })).toHaveAttribute('aria-checked', 'false');
  });

  it('marks "GCS" as checked when value is GCS', () => {
    render(<CurrencyFilter {...defaultProps} value="GCS" />);

    expect(screen.getByRole('radio', { name: /all/i })).toHaveAttribute('aria-checked', 'false');
    expect(screen.getByRole('radio', { name: /ics/i })).toHaveAttribute('aria-checked', 'false');
    expect(screen.getByRole('radio', { name: /gcs/i })).toHaveAttribute('aria-checked', 'true');
  });

  it('calls onChange with empty string when "All" is clicked', () => {
    const onChange = jest.fn();
    render(<CurrencyFilter value="ICS" onChange={onChange} />);

    userEvent.click(screen.getByRole('radio', { name: /all/i }));

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith('');
  });

  it('calls onChange with "ICS" when ICS button is clicked', () => {
    const onChange = jest.fn();
    render(<CurrencyFilter value="" onChange={onChange} />);

    userEvent.click(screen.getByRole('radio', { name: /ics/i }));

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith('ICS');
  });

  it('calls onChange with "GCS" when GCS button is clicked', () => {
    const onChange = jest.fn();
    render(<CurrencyFilter value="" onChange={onChange} />);

    userEvent.click(screen.getByRole('radio', { name: /gcs/i }));

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith('GCS');
  });

  it('calls onChange when clicking the already-active option', () => {
    const onChange = jest.fn();
    render(<CurrencyFilter value="ICS" onChange={onChange} />);

    userEvent.click(screen.getByRole('radio', { name: /ics/i }));

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith('ICS');
  });

  it('renders title attributes for tooltip context', () => {
    render(<CurrencyFilter {...defaultProps} />);

    expect(screen.getByTitle('Show all transactions')).toBeInTheDocument();
    expect(screen.getByTitle('Imperial Crown Standard')).toBeInTheDocument();
    expect(screen.getByTitle('Galactic Credit Standard')).toBeInTheDocument();
  });

  it('renders all buttons with type="button"', () => {
    render(<CurrencyFilter {...defaultProps} />);

    const buttons = screen.getAllByRole('radio');
    buttons.forEach((button) => {
      expect(button).toHaveAttribute('type', 'button');
    });
  });

  it('renders a visually hidden legend for screen readers', () => {
    render(<CurrencyFilter {...defaultProps} />);

    const legend = screen.getByText('Filter by currency');
    expect(legend).toBeInTheDocument();
    expect(legend.tagName).toBe('LEGEND');
  });
});
