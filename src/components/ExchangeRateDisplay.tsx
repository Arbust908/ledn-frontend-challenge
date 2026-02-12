import Decimal from 'decimal.js';
import styled from 'styled-components';
import { useExchangeRate } from '../hooks/useExchangeRate';
import { SkeletonLoader } from '../styles/shared';

const sharedStyles = `
  display: inline-block;
  border-radius: var(--mantine-radius-md);
  min-width: 120px;
  overflow: clip;
  font-size: var(--mantine-font-size-sm);
  font-weight: var(--mantine-font-weight-bold);
  padding: 2px var(--mantine-spacing-md);
  background-color: var(--mantine-color-default-hover);
  color: var(--mantine-color-text);
  font-variant-numeric: tabular-nums;
  margin: 0;
`

const Badge = styled.p`${sharedStyles}`;

const Loader = styled(SkeletonLoader)`
  ${sharedStyles}
`

function ExchangeRateDisplay() {
  const { data, isLoading } = useExchangeRate();

  // rate: Value of ICS in the GCS currency
  const formattedRate = data?.rate
    ? new Decimal(data.rate).toFixed()
    : '—';

  if (isLoading) {
    return <Loader />;
  }

  return (
    <Badge>
      1 GCS = <span>{formattedRate}</span> ICS
    </Badge>
  );
}

export default ExchangeRateDisplay;