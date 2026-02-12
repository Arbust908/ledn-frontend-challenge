import styled from 'styled-components';

interface CardProps {
  children: React.ReactNode;
  onClick?: () => void;
  hoverable?: boolean;
  padding?: string;
}

const CardContainer = styled.div<{ $hoverable?: boolean; $padding?: string }>`
  background: var(--mantine-color-default);
  border: 1px solid var(--mantine-color-default-border);
  border-radius: var(--mantine-radius-md);
  padding: ${props => props.$padding || 'var(--mantine-spacing-lg)'};
  box-shadow: var(--mantine-shadow-sm);
  transition: all 0.3s ease-in-out;
  cursor: ${props => props.$hoverable ? 'pointer' : 'default'};

  ${props => props.$hoverable && `
    &:hover {
      background: var(--mantine-color-default-hover);
      box-shadow: var(--mantine-shadow-md);
      scale: 1.02;
    }
  `}
`;

function Card({ children, onClick, hoverable = false, padding }: CardProps) {
  return (
    <CardContainer $hoverable={hoverable} $padding={padding} onClick={onClick}>
      {children}
    </CardContainer>
  );
}

export default Card;