import Buy from '@/components/Game/ActionModal/Buy';
import { PlayerState } from '@/hooks/useGameContext';
import { formatPrice } from '@/util/formatPrice';
import { act } from '@testing-library/react';
import React from 'react';
import {
  fakeGameSettings,
  fakePlayer,
  fakePlayerState,
  renderWithGameContext,
} from '../fakers';

describe('Buy ActionModal', () => {
  it('matches snapshot', () => {
    const { container } = renderWithGameContext(
      <Buy />,

      {
        currentPlayer: fakePlayer('cat'),
        gameSettings: fakeGameSettings(),
        state: {
          boot: {
            inJail: false,
            money: 400,
            pos: 1,
            propertiesOwned: {},
            hasGetOutOfJailFreeCard: false,
            isBankrupt: false,
            lastRoll: 4,
            turnsInJail: 0,
          },
          cat: {
            inJail: false,
            money: 1200,
            lastRoll: 6,
            isBankrupt: false,
            hasGetOutOfJailFreeCard: false,
            turnsInJail: 0,
            pos: 1,
            propertiesOwned: {},
          },
        },
      }
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders correct property information', () => {
    const gameSettings = fakeGameSettings();
    const { container } = renderWithGameContext(<Buy />, {
      currentPlayer: fakePlayer('cat'),
      gameSettings,
      state: {
        boot: {
          inJail: false,
          money: 400,
          lastRoll: 5,
          turnsInJail: 0,
          pos: 1,
          hasGetOutOfJailFreeCard: false,
          isBankrupt: false,
          propertiesOwned: {},
        },
        cat: {
          inJail: false,
          hasGetOutOfJailFreeCard: false,
          isBankrupt: false,
          lastRoll: 11,
          turnsInJail: 0,
          money: 1200,
          pos: 1,
          propertiesOwned: {},
        },
      },
    });
    expect(container.textContent?.toUpperCase()).toContain('BUY');

    expect(container.textContent?.toUpperCase()).toContain(
      gameSettings?.Properties?.[0]?.name?.toUpperCase()
    );
    expect(container.textContent?.toUpperCase()).toContain(
      formatPrice(gameSettings?.Properties?.[0]?.price ?? 0)
    );
  });

  it('current player can buy property and property gets added to their owned properties', async () => {
    const gameSettings = fakeGameSettings();

    // reactive state
    const state: PlayerState = {
      boot: fakePlayerState({
        pos: 1,
      }),
      cat: fakePlayerState({
        pos: 1,
      }),
    };

    const buy = jest.fn();
    const { container } = renderWithGameContext(<Buy />, {
      currentPlayer: fakePlayer('cat'),
      gameSettings,
      buy,
      state,
    });

    const buyButton = container.querySelectorAll('button')[0];
    await act(async () => {
      buyButton.click();
      await new Promise(resolve => setTimeout(resolve, 1200));
    });

    expect(buy).toHaveBeenCalledWith('cat', gameSettings?.Properties?.[0].id);
  });
});
