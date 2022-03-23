import { ActionModalBuy } from '@/components/Game/ActionModal/Content';
import { PlayerState, TokenType } from '@/hooks/useGameContext';
import { formatPrice } from '@/util/formatPrice';
import { act } from '@testing-library/react';
import React from 'react';
import { fakeGameSettings, fakePlayer, renderWithGameContext } from '../fakers';

describe('Buy ActionModal', () => {
  it('matches snapshot', () => {
    const { container } = renderWithGameContext(
      <ActionModalBuy />,

      {
        currentPlayer: fakePlayer('cat'),
        gameSettings: fakeGameSettings(),
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
      }
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders correct property information', () => {
    const gameSettings = fakeGameSettings();
    const { container } = renderWithGameContext(<ActionModalBuy />, {
      currentPlayer: fakePlayer('cat'),
      gameSettings,
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

    const buy = jest
      .fn()
      .mockImplementation(async (player: TokenType, propertyId) => {
        state[player]?.propertiesOwned.push(propertyId);
      });

    const { container } = renderWithGameContext(<ActionModalBuy />, {
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
    expect(state.cat?.propertiesOwned).toContain(
      gameSettings?.Properties?.[0].id
    );
  });
});
