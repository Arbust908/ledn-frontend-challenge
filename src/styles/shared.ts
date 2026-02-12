// Written by ClaudeCode
import styled, { keyframes } from 'styled-components';

export const shimmer = keyframes`
  from, to {
    background-position: -100% 0;
  }
  50% {
    background-position: 100% 0;
  }
`;

export const SkeletonLoader = styled.div<{ width?: string; height?: string }>`
    background: linear-gradient(
    90deg,
    var(--mantine-color-default-hover) 0%,
    var(--mantine-color-default) 50%,
    var(--mantine-color-default-hover) 100%
  );
  background-size: 200% 100%;
  animation: ${shimmer} 2s ease-in-out infinite;
  width: ${props => props.width || '100%'};
  min-height: ${props => props.height || '20px'};
`;