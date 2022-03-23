import { ActionModalFreeParking } from '@/components/Game/ActionModal/Content';
import { PlayerState, TokenType } from '@/hooks/useGameContext';
import React from 'react';
import { act } from 'react-dom/test-utils';
import { fakePlayer, renderWithGameContext } from '../fakers';

describe('Free Parking Action Modal', () => {
  it('should match snapshot', () => {
    const { container } = renderWithGameContext(<ActionModalFreeParking />, {
      currentPlayer: fakePlayer('boot'),
      state: {
        boot: {
          inJail: false,
          money: 400,
          pos: 1,
          propertiesOwned: [],
        },
        cat: {
          inJail: false,
          money: 1200,
          pos: 1,
          propertiesOwned: [],
        },
      },
      totalOnFreeParking: 100,
    });

    expect(container.firstChild).toMatchSnapshot();
  });

  it('should render correct text', () => {
    const { container } = renderWithGameContext(<ActionModalFreeParking />, {
      currentPlayer: fakePlayer('boot'),
      state: {
        boot: {
          inJail: false,
          money: 400,
          pos: 1,
          propertiesOwned: [],
        },
        cat: {
          inJail: false,
          money: 1200,
          pos: 1,
          propertiesOwned: [],
        },
      },
      totalOnFreeParking: 100,
    });

    expect(container.textContent).toContain('Free Parking');
  });

  it('should render correct amount of money', () => {
    const { container } = renderWithGameContext(<ActionModalFreeParking />, {
      currentPlayer: fakePlayer('boot'),
      state: {
        boot: {
          inJail: false,
          money: 400,
          pos: 1,
          propertiesOwned: [],
        },
        cat: {
          inJail: false,
          money: 1200,
          pos: 1,
          propertiesOwned: [],
        },
      },
      totalOnFreeParking: 100,
    });

    expect(container.textContent).toContain('£100');
  });

  it('on clicking collect button, the total in free parking is collected by the current player', async () => {
    let totalOnFreeParking = 200;
    let state: PlayerState = {
      boot: {
        inJail: false,
        money: 400,
        pos: 1,
        propertiesOwned: [],
      },
      cat: {
        inJail: false,
        money: 1200,
        pos: 1,
        propertiesOwned: [],
      },
    };
    const landedOnFreeParking = jest.fn().mockImplementation((p: TokenType) => {
      if (!state[p]) return;
      state = {
        ...state,
        [p]: {
          ...state[p],
          money: (state[p]?.money ?? 0) + totalOnFreeParking,
        },
      };

      totalOnFreeParking = 0;
    });

    const { container } = renderWithGameContext(<ActionModalFreeParking />, {
      currentPlayer: fakePlayer('boot'),
      state,
      totalOnFreeParking,
      landedOnFreeParking,
    });

    const button = container.querySelector('button');

    await act(async () => {
      button?.click();
      await new Promise(resolve => setTimeout(resolve, 1000));
    });

    expect(totalOnFreeParking).toBe(0);
    // Check that the money is added to the current player
    expect(state.boot?.money).toBe(600);
    // And not to the other player
    expect(state.cat?.money).toBe(1200);
  });
});
