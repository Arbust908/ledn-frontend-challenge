import { useState, useCallback } from 'react';
import { Outlet, NavLink as RouterNavLink } from 'react-router-dom';
import styled from 'styled-components';
import ExchangeRateDisplay from './ExchangeRateDisplay';

const MOBILE_BREAKPOINT = '48em'; // matches Mantine sm --mantine-breakpoint-sm

const Wrapper = styled.div`
  --header-height: 100px;
  --navbar-width: 220px;

  min-height: 100dvh;
  display: grid;
  grid-template-rows: var(--header-height) 1fr;
  grid-template-columns: 1fr;

  @media (min-width: ${MOBILE_BREAKPOINT}) {
    --header-height: 60px;
    grid-template-columns: var(--navbar-width) 1fr;
  }

`;

const Header = styled.header`
  grid-column: 1 / -1;
  display: grid;
  align-items: center;
  padding-inline: var(--mantine-spacing-md);
  border-bottom: 2px solid var(--mantine-color-default-hover);
  background: var(--mantine-color-body, #fff);
  position: sticky;
  top: 0;
  z-index: 100;

  grid-template-columns: auto 1fr;
  grid-template-areas:
    'brand brand'
    'burger conversion';

  @media (min-width: ${MOBILE_BREAKPOINT}) {
    grid-template-columns: 1fr auto;
    grid-template-areas: 'brand conversion';
  }

`;

const BrandTitle = styled.h3`
  margin: 0;
  font-size: var(--mantine-font-size-xl);
  font-weight: var(--mantine-heading-font-weight);
  grid-area: brand;

  @media (max-width: ${MOBILE_BREAKPOINT}) {
    text-align: center;
  }
`;

const BurgerButton = styled.button`
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: var(--mantine-spacing-xs);
  width: 44px;
  height: 44px;
  align-items: center;
  justify-content: center;
  grid-area: burger;
  justify-self: start;

  @media (max-width: ${MOBILE_BREAKPOINT}) {
    display: flex;
  }
`;

const ConversionSlot = styled.div`
  grid-area: conversion;
  justify-self: end;
`;

const BurgerLine = styled.span`
  display: block;
  width: 20px;
  height: 2px;
  background: var(--mantine-color-text);
  border-radius: 1px;
  position: relative;
  transition: transform 0.2s, opacity 0.2s;

  &::before,
  &::after {
    content: '';
    position: absolute;
    left: 0;
    width: 100%;
    height: 2px;
    background: var(--mantine-color-text);
    border-radius: 1px;
    transition: transform 0.2s;
  }

  --shared-offset: 6px;
  --shared-rotation: 45deg;

  &::before {
    top: calc(var(--shared-offset) * -1);
  }

  &::after {
    top: var(--shared-offset);
  }

  .opened & {
    background: transparent;
  }

  .opened &::before {
    top: 0;
    transform: rotate(var(--shared-rotation));
  }

  .opened &::after {
    top: 0;
    transform: rotate(calc(var(--shared-rotation) * -1));
  }
`;

const Backdrop = styled.div<{ $visible: boolean }>`
  display: ${({ $visible }) => ($visible ? 'block' : 'none')};
  position: fixed;
  inset: 0;
  top: var(--header-height);
  background: rgba(0, 0, 0, 0.5);
  z-index: var(--mantine-z-index-app);

  @media (min-width: ${MOBILE_BREAKPOINT}) {
    display: none;
  }

`;

const Navbar = styled.nav<{ $opened: boolean }>`
  display: flex;
  flex-direction: column;
  gap: var(--mantine-spacing-xs);
  padding: var(--mantine-spacing-md);
  border-right: 2px solid var(--mantine-color-default-hover);
  background: var(--mantine-color-body, #fff);
  position: fixed;
  top: var(--header-height);
  left: 0;
  bottom: 0;
  width: var(--navbar-width);
  z-index: var(--mantine-z-index-app);

  @media (max-width: ${MOBILE_BREAKPOINT}) {
    transform: ${({ $opened }) => ($opened ? 'translateX(0)' : 'translateX(-100%)')};
    transition: transform 0.25s ${({ $opened }) => ($opened ? 'ease-out' : 'ease-in')};
  }
`;

const StyledNavLink = styled(RouterNavLink)`
  display: block;
  padding: var(--mantine-spacing-sm) var(--mantine-spacing-md);
  border-radius: var(--mantine-radius-sm);
  text-decoration: none;
  color: inherit;
  font-size: var(--mantine-font-size-sm);
  transition: background 0.15s;

  &:hover {
    background: var(--mantine-color-default-hover);
  }

  &.active {
    background: var(--mantine-primary-color-light, #e7f5ff);
    color: var(--mantine-primary-color-filled, #1c7ed6);
    font-weight: 500;
  }
`;

const Main = styled.main`
  padding: 1rem;
  overflow-y: auto;

  @media (min-width: ${MOBILE_BREAKPOINT}) {
    grid-column: 2;
  }
`;

function Layout() {
  const [opened, setOpened] = useState(false);
  const toggle = useCallback(() => setOpened((o) => !o), []);
  const close = useCallback(() => setOpened(false), []);

  return (
    <Wrapper>
      <Header>
        <BrandTitle>Coruscant Bank</BrandTitle>
        <BurgerButton className={opened ? 'opened' : ''} onClick={toggle} aria-label="Toggle navigation">
          <BurgerLine />
        </BurgerButton>
        <ConversionSlot>
          <ExchangeRateDisplay />
        </ConversionSlot>
      </Header>

      <Backdrop $visible={opened} onClick={close} />

      <Navbar $opened={opened}>
        <StyledNavLink to="/" end onClick={close}>
          Summary
        </StyledNavLink>
      </Navbar>

      <Main>
        <Outlet />
      </Main>
    </Wrapper>
  );
}

export default Layout;
