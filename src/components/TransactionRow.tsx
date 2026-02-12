// Written by ClaudeCode. Edited by hand for better logic
import styled from 'styled-components';
import { motion } from 'motion/react';
import type { Transaction, Status } from '../types';
import { useResident } from '../hooks/useResident';
import { useExchangeRate } from '../hooks/useExchangeRate';
import Decimal from 'decimal.js';
import { SkeletonLoader } from '../styles/shared';
import { CircleCheck, LoaderCircle, Ban } from 'lucide-react';
import { BREAKPOINTS, FINANCIAL_PRECISION } from '../utils/constants';

const StyledCell = styled.td<{ $highlight?: boolean }>`
  color: ${props => props.$highlight ? 'var(--mantine-color-violet-text)' : ''};
  font-variant-numeric: tabular-nums;
`;

const statusConfig: Record<Status, { color: string; icon: typeof CircleCheck; label: string }> = {
  completed: {
    color: 'var(--mantine-color-teal-text)',
    icon: CircleCheck,
    label: 'Completed',
  },
  inProgress: {
    color: 'var(--mantine-color-yellow-text)',
    icon: LoaderCircle,
    label: 'In Progress',
  },
  blocked: {
    color: 'var(--mantine-color-red-text)',
    icon: Ban,
    label: 'Blocked',
  },
};

const StatusBadge = styled.span<{ $status: Status }>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  border-radius: var(--mantine-radius-sm);
  font-size: var(--mantine-font-size-xs);
  font-weight: 600;
  color: ${props => statusConfig[props.$status].color};
`;

const Row = styled(motion.tr)`
  @media (max-width: ${BREAKPOINTS.TABLET}) {
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 2px 0;
    padding: var(--mantine-spacing-sm);
    border-radius: var(--mantine-radius-md);
    border: 1px solid var(--mantine-color-default-border);

    td {
      padding: 0;
      border: none;
    }
  }
`;

const NameCell = styled.td`
  @media (max-width: ${BREAKPOINTS.TABLET}) {
    order: 1;
    font-weight: 600;
    font-size: var(--mantine-font-size-md);
  }
`;

const StatusCell = styled.td`
  @media (max-width: ${BREAKPOINTS.TABLET}) {
    order: 2;
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
`;

const AmountCell = styled(StyledCell)`
  @media (min-width: ${BREAKPOINTS.TABLET}) {
    width: 24ch;
  }
  @media (max-width: ${BREAKPOINTS.TABLET}) {
    font-size: var(--mantine-font-size-sm);
    grid-column: 1 / -1;
    word-break: break-all;

    &::before {
      font-weight: 500;
      color: var(--mantine-color-dimmed);
    }
  }
`;

const IcsCell = styled(AmountCell)`
  @media (max-width: ${BREAKPOINTS.TABLET}) {
    order: 3;

    &::before {
      content: 'ICS: ';
    }
  }
`;

const GcsCell = styled(AmountCell)`
  @media (max-width: ${BREAKPOINTS.TABLET}) {
    order: 4;

    &::before {
      content: 'GCS: ';
    }
  }
`;

interface TransactionRowProps {
  transaction: Transaction;
}

const { CRYPTO_AMOUNT } = FINANCIAL_PRECISION;

function TransactionRow({ transaction }: TransactionRowProps) {
  const { data: resident, isLoading: residentLoading } = useResident(transaction.user);
  const { data: exchangeRateData, isLoading: exchangeRateLoading } = useExchangeRate();

  if (residentLoading || exchangeRateLoading) {
    return (
      <Row
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        layout
      >
        <td colSpan={4}><SkeletonLoader /></td>
      </Row>
    );
  }

  const rate = new Decimal(exchangeRateData?.rate ?? '1');
  const amount = new Decimal(transaction.amount);
  const isGCS = transaction.currency === 'GCS';

  const icsAmount = isGCS ? amount.div(rate) : amount;
  const gcsAmount = isGCS ? amount : amount.mul(rate);
  const StatusIcon = statusConfig[transaction.status].icon;

  return (
    <Row
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2 }}
      layout
    >
      <NameCell>{resident?.name}</NameCell>
      <IcsCell $highlight={!isGCS}>{icsAmount.toFixed(CRYPTO_AMOUNT)}</IcsCell>
      <GcsCell $highlight={isGCS}>{gcsAmount.toFixed(CRYPTO_AMOUNT)}</GcsCell>
      <StatusCell>
        <StatusBadge $status={transaction.status}>
          <StatusIcon size={14} />
          {statusConfig[transaction.status].label}
        </StatusBadge>
      </StatusCell>
    </Row>
  );
}

export default TransactionRow;
