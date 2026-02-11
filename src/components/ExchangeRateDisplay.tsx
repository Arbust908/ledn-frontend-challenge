import styled, { keyframes } from 'styled-components';
import { useExchangeRate } from '../hooks/useExchangeRate';

const shimmer = keyframes`
  from, to {
    background-position: -100% 0;
  }
  50% {
    background-position: 100% 0;
  }
`;

const sharedStyles = `
  display: inline-block;
  border-radius: var(--mantine-radius-md);
  padding: 2px var(--mantine-spacing-md);
  font-size: var(--mantine-font-size-sm);
  font-weight: var(--mantine-font-weight-bold);
`;

const SkeletonLoader = styled.div`
  ${sharedStyles}
  width: calc(var(--mantine-spacing-xl) * 4);
  background: linear-gradient(
    90deg,
    var(--mantine-color-default-hover) 0%,
    var(--mantine-color-default) 50%,
    var(--mantine-color-default-hover) 100%
  );
  background-size: 200% 100%;
  animation: ${shimmer} 2s ease-in-out infinite;
`;

const Badge = styled.div`
  ${sharedStyles}
  background-color: var(--mantine-color-default-hover);
  color: var(--mantine-color-text);
  font-variant-numeric: tabular-nums;
`;

function ExchangeRateDisplay() {
  const { data, isLoading } = useExchangeRate();

  if (isLoading) {
    return <SkeletonLoader />;
  }

  return (
    <Badge>
      1 GCS = <span>{data?.rate ?? '—'}</span> ICS
    </Badge>
  );
}

export default ExchangeRateDisplay;
