// Written by ClaudeCode. Edited by hand for better logic
import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Decimal from 'decimal.js';
import { ArrowLeft } from 'lucide-react';
import { usePlanet } from '../hooks/usePlanets';
import { useTransactionsByUsers } from '../hooks/useTransactions';
import { useExchangeRate } from '../hooks/useExchangeRate';
import { SkeletonLoader } from '../styles/shared';
import Card from '../components/Card';
import { formatBigNumber } from '../utils/formatBigNumber';
import TransactionsTable from '../components/TransactionsTable';
import CurrencyFilter from '../components/CurrencyFilter';
import type { CurrencyFilterValue } from '../components/CurrencyFilter';
import { BREAKPOINTS, FINANCIAL_PRECISION } from '../utils/constants';

const Stack = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--mantine-spacing-lg);
  max-width: 1328px;
  margin: 0 auto;
`;

const Group = styled.div`
  display: flex;
  align-items: center;
  gap: var(--mantine-spacing-md);
`;

const TransactionsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--mantine-spacing-md);
`;

const BackButton = styled.button`
  display: inline-flex;
  align-items: center;
  background: none;
  border: none;
  color: var(--mantine-color-violet-text);
  cursor: pointer;
  font-size: var(--mantine-font-size-md);
  padding: var(--mantine-spacing-xs) var(--mantine-spacing-sm);
  border-radius: var(--mantine-radius-sm);
  transition: background 0.15s;

  & > p {
    margin: 0;
  }
  @media (max-width: ${BREAKPOINTS.TABLET}) {
    & > p {
      display: none;
    } 
  }

  &:hover {
    background: var(--mantine-color-violet-light);
  }
`;

const Title2 = styled.h2`
  font-size: var(--mantine-h2-font-size);
  font-weight: var(--mantine-h2-font-weight);
  text-decoration: underline;
  margin: 0;
`;

const Title3 = styled.h3`
  font-size: var(--mantine-h3-font-size);
  font-weight: var(--mantine-h3-font-weight);
  margin: 0;
`;

const SimpleGrid = styled.div`
  display: grid;
  gap: var(--mantine-spacing-md);
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
`;

const TotalsDesktop = styled.div`
  display: grid;
  gap: var(--mantine-spacing-md);
  grid-template-columns: 1fr 1fr;

  @media (max-width: ${BREAKPOINTS.TABLET}) {
    display: none;
  }
`;

const TotalsMobile = styled.div`
  @media (min-width: ${BREAKPOINTS.TABLET}) {
    display: none;
  }
`;

const TotalsDivider = styled.hr`
  border: none;
  border-top: 1px solid var(--mantine-color-default-border);
  margin: var(--mantine-spacing-xs) 0;
`;

const TagText = styled.p`
  margin: 0;
  font-size: var(--mantine-font-size-sm);
  color: var(--mantine-color-dimmed);
`;

const ValueText = styled.p`
  margin: 0;
  font-size: var(--mantine-font-size-md);
  font-weight: var(--mantine-h2-font-weight);
  text-transform: capitalize;
  font-variant-numeric: tabular-nums;
`;

const TableCardWrapper = styled.div`
  @media (max-width: ${BREAKPOINTS.TABLET}) {
    & > * {
      background: none;
      border: none;
      box-shadow: none;
      padding: 0;
    }
  }
`;

function PlanetDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [currencyFilter, setCurrencyFilter] = useState<CurrencyFilterValue>('');

  const { data: planet, isLoading: planetLoading } = usePlanet(id ?? '');
  const planetResidents = planet?.residents ?? [];
  const { data: transactions, isLoading: transactionsLoading } = useTransactionsByUsers(planetResidents);
  const { data: exchangeRateData, isLoading: exchangeRateLoading } = useExchangeRate();

  const totalsLoading = transactionsLoading || exchangeRateLoading;

  // Filter transactions by selected currency
  const filteredTransactions = useMemo(() => {
    if (!transactions) return [];
    if (!currencyFilter) return transactions;
    return transactions.filter((t) => t.currency === currencyFilter);
  }, [transactions, currencyFilter]);

  // Calculate totals using decimal.js for financial precision
  const { totalICS, totalGCS } = useMemo(() => {
    if (!transactions || !exchangeRateData?.rate) {
      return { totalICS: new Decimal(0), totalGCS: new Decimal(0) };
    }

    const rate = new Decimal(exchangeRateData.rate);

    return transactions.reduce(
      (acc, transaction) => {
        const amount = new Decimal(transaction.amount);

        if (transaction.currency === 'ICS') {
          // rate = how many GCS = 1 ICS → ICS→GCS: multiply by rate
          acc.totalICS = acc.totalICS.plus(amount);
          acc.totalGCS = acc.totalGCS.plus(amount.mul(rate));
        } else {
          // GCS→ICS: divide by rate
          acc.totalGCS = acc.totalGCS.plus(amount);
          acc.totalICS = acc.totalICS.plus(amount.div(rate));
        }

        return acc;
      },
      { totalICS: new Decimal(0), totalGCS: new Decimal(0) }
    );
  }, [transactions, exchangeRateData?.rate]);

  if (!planetLoading && !planet) {
    return <TagText>Planet not found</TagText>;
  }

  const formattedICSTotal = totalICS.toFixed(FINANCIAL_PRECISION.CRYPTO_AMOUNT);
  const formattedGCSTotal = totalGCS.toFixed(FINANCIAL_PRECISION.CRYPTO_AMOUNT);

  function TotalText({ label, value }: { label: string; value: string }) {
    return (
      <>
        <TagText>{label}</TagText>
        <ValueText>{value}</ValueText>
      </>
    );
  }

  return (
    <Stack>
      {/* Planet header — depends on planet */}
      <Group>
        <BackButton onClick={() => navigate('/')}>
          <ArrowLeft />
          <p>Back</p>
        </BackButton>
        {planetLoading
          ? <SkeletonLoader width="200px" height="32px" />
          : <Title2>{planet!.name}</Title2>
        }
      </Group>

      {/* Planet info cards — depends on planet */}
      <SimpleGrid>
        {planetLoading ? (
          <>
            <Card><SkeletonLoader height="40px" /></Card>
            <Card><SkeletonLoader height="40px" /></Card>
            <Card><SkeletonLoader height="40px" /></Card>
            <Card><SkeletonLoader height="40px" /></Card>
          </>
        ) : (
          <>
            <Card>
              <TagText>Climate</TagText>
              <ValueText>{planet!.climate}</ValueText>
            </Card>
            <Card>
              <TagText>Terrain</TagText>
              <ValueText>{planet!.terrain}</ValueText>
            </Card>
            <Card>
              <TagText>Population</TagText>
              <ValueText>{formatBigNumber(planet!.population)}</ValueText>
            </Card>
            <Card>
              <TagText>Gravity</TagText>
              <ValueText>{planet!.gravity}</ValueText>
            </Card>
          </>
        )}
      </SimpleGrid>

      {/* Totals — depends on transactions + exchangeRate */}
      {totalsLoading ? (
        <>
          <TotalsDesktop>
            <Card><SkeletonLoader height="40px" /></Card>
            <Card><SkeletonLoader height="40px" /></Card>
          </TotalsDesktop>
          <TotalsMobile>
            <Card><SkeletonLoader height="60px" /></Card>
          </TotalsMobile>
        </>
      ) : (
        <>
          <TotalsDesktop>
            <Card>
              <TotalText label="Total ICS" value={formattedICSTotal} />
            </Card>
            <Card>
              <TotalText label="Total GCS" value={formattedGCSTotal} />
            </Card>
          </TotalsDesktop>
          <TotalsMobile>
            <Card>
              <TotalText label="Total ICS" value={formattedICSTotal} />
              <TotalsDivider />
              <TotalText label="Total GCS" value={formattedGCSTotal} />
            </Card>
          </TotalsMobile>
        </>
      )}

      {/* Transactions — depends on transactions */}
      <TransactionsHeader>
        <Title3>Transactions</Title3>
        <CurrencyFilter value={currencyFilter} onChange={setCurrencyFilter} />
      </TransactionsHeader>

      <TableCardWrapper>
        <Card padding="0">
          {transactionsLoading ? (
            <SkeletonLoader height="200px" />
          ) : transactions?.length === 0 ? (
            <TagText>No transactions found for residents of this planet.</TagText>
          ) : (
            <TransactionsTable transactions={filteredTransactions} />
          )}
        </Card>
      </TableCardWrapper>
    </Stack>
  );
}

export default PlanetDetailPage;
