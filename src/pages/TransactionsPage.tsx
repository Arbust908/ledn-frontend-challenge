import { useState, useMemo } from 'react';
import styled, { keyframes } from 'styled-components';
import { useTransactions, useUpdateTransactionsBatch } from '../hooks/useTransactions';
import { usePlanets } from '../hooks/usePlanets';
import TransactionsTable from '../components/TransactionsTable';
import StatusFilter from '../components/StatusFilter';
import CurrencyFilter from '../components/CurrencyFilter';
import PlanetDropdown from '../components/PlanetDropdown';
import Card from '../components/Card';
import { SkeletonLoader } from '../styles/shared';
import { BREAKPOINTS } from '../utils/constants';
import type { StatusFilterValue } from '../components/StatusFilter';
import type { CurrencyFilterValue } from '../components/CurrencyFilter';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--mantine-spacing-lg);
  max-width: 1328px;
  margin: 0 auto;
`;

const Title = styled.h2`
  font-size: var(--mantine-font-size-h2);
  font-weight: var(--mantine-font-weight-bold);
  margin: 0;
`;

const HelperText = styled.p`
  font-size: var(--mantine-font-size-sm);
  color: var(--mantine-color-dimmed);
  margin: 0;
`;

const FiltersBar = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--mantine-spacing-sm);
  align-items: center;

  @media (max-width: ${BREAKPOINTS.TABLET}) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const SkeletonLine = styled(SkeletonLoader)`
  border-radius: var(--mantine-radius-sm);
`;

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
`;

const BlockadeButton = styled.button<{ $isPending?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: var(--mantine-spacing-xs);
  padding: var(--mantine-spacing-xs) var(--mantine-spacing-md);
  background: var(--mantine-color-red-9);
  color: var(--mantine-color-white);
  border: none;
  border-radius: var(--mantine-radius-sm);
  font-size: var(--mantine-font-size-sm);
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s, opacity 0.15s;
  white-space: nowrap;

  &:hover:not(:disabled) {
    background: var(--mantine-color-red-8);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
    animation: ${({ $isPending }) => ($isPending ? pulse : 'none')} 1.2s ease-in-out infinite;
  }
`;

const SKELETON_COUNT = 8;

function SkeletonRows() {
  return (
    <Card>
      {Array.from({ length: SKELETON_COUNT }, (_, i) => (
        <SkeletonLine key={i} height="40px" width="100%" style={{ marginTop: i > 0 ? '0.5rem' : 0 }} />
      ))}
    </Card>
  );
}

function TransactionsPage() {
  const [statusFilter, setStatusFilter] = useState<StatusFilterValue>('');
  const [currencyFilter, setCurrencyFilter] = useState<CurrencyFilterValue>('');
  const [planetFilter, setPlanetFilter] = useState('');

  const { data: transactions, isLoading: txLoading } = useTransactions();
  const { data: planets, isLoading: planetsLoading } = usePlanets();
  const batchUpdate = useUpdateTransactionsBatch();

  const isLoading = txLoading || planetsLoading;

  const filteredTransactions = useMemo(() => {
    const txs = transactions ?? [];
    const plnts = planets ?? [];
    let result = txs;

    if (statusFilter) {
      result = result.filter((t) => t.status === statusFilter);
    }

    if (currencyFilter) {
      result = result.filter((t) => t.currency === currencyFilter);
    }

    if (planetFilter) {
      const planet = plnts.find((p) => p.id === planetFilter);
      if (planet) {
        const residentSet = new Set(planet.residents);
        result = result.filter((t) => residentSet.has(t.user));
      }
    }

    return result;
  }, [transactions, planets, statusFilter, currencyFilter, planetFilter]);

  const allPlanets = planets ?? [];

  // Find in-progress transactions for the selected planet
  const inProgressForPlanet = useMemo(() => {
    if (!planetFilter || !transactions || !planets) return [];
    const planet = planets.find((p) => p.id === planetFilter);
    if (!planet) return [];
    const residentSet = new Set(planet.residents);
    return transactions.filter(
      (t) => residentSet.has(t.user) && t.status === 'inProgress'
    );
  }, [planetFilter, transactions, planets]);

  function handleBlockade() {
    if (inProgressForPlanet.length === 0) return;
    const updates = inProgressForPlanet.map((t) => ({ id: t.id, status: 'blocked' as const }));
    batchUpdate.mutate(updates);
  }

  return (
    <Container>
      <Title>Transactions</Title>
      <HelperText>Select a planet to execute the Blockade</HelperText>

      <FiltersBar>
        <PlanetDropdown
          value={planetFilter}
          onChange={setPlanetFilter}
          planets={allPlanets}
          isLoading={planetsLoading}
        />
        <StatusFilter value={statusFilter} onChange={setStatusFilter} />
        <CurrencyFilter value={currencyFilter} onChange={setCurrencyFilter} />
        {planetFilter && (
          <BlockadeButton
            onClick={handleBlockade}
            disabled={inProgressForPlanet.length === 0 || batchUpdate.isPending}
            $isPending={batchUpdate.isPending}
          >
            {batchUpdate.isPending
              ? 'Executing...'
              : `Execute Blockade (${inProgressForPlanet.length})`}
          </BlockadeButton>
        )}
      </FiltersBar>

      {isLoading ? (
        <SkeletonRows />
      ) : (
        <TransactionsTable transactions={filteredTransactions} />
      )}
    </Container>
  );
}

export default TransactionsPage;
