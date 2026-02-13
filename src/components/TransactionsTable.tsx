// Written by ClaudeCode. Edited by hand for better logic
import styled from 'styled-components';
import { AnimatePresence } from 'motion/react';
import type { Transaction } from '../types';
import TransactionRow from './TransactionRow';
import { BREAKPOINTS } from '../utils/constants';

const ScrollContainer = styled.div`
  max-height: 70vh;
  overflow-y: auto;

  @media (max-width: ${BREAKPOINTS.TABLET}) {
    max-height: calc(100vh - 378px);
  }
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;

  th, td {
    padding: var(--mantine-spacing-sm);
    text-align: left;
    border-bottom: 1px solid var(--mantine-color-default-border);
  }

  th {
    font-weight: 600;
    background: var(--mantine-color-default);
    position: sticky;
    top: 0;
    z-index: 1;
  }

  tbody tr:hover {
    background: var(--mantine-color-default-hover);
  }

  @media (max-width: ${BREAKPOINTS.TABLET}) {
    background: none;

    thead {
      display: none;
    }

    tbody {
      display: grid;
      gap: var(--mantine-spacing-sm);
    }

    tbody tr {
      background: var(--mantine-color-default);
    }

    tbody tr:hover {
      background: var(--mantine-color-default-hover);
    }
  }
`;

interface TransactionsTableProps {
  transactions: Transaction[];
}

function TransactionsTable({ transactions }: TransactionsTableProps) {
  return (
    <ScrollContainer>
      <StyledTable>
        <thead>
          <tr>
            <th>Name</th>
            <th>ICS</th>
            <th>GCS</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <AnimatePresence mode="popLayout">
            {transactions.map((transaction) => (
              <TransactionRow key={transaction.id} transaction={transaction} />
            ))}
          </AnimatePresence>
        </tbody>
      </StyledTable>
    </ScrollContainer>
  );
}

export default TransactionsTable;
