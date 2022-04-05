import { ActionModalTax } from '@/components/Game/ActionModal/Content';
import { act } from '@testing-library/react';
import React from 'react';
import { fakeGameSettings, fakePlayer, renderWithGameContext } from '../fakers';

describe('Tax ActionModal', () => {
  test('matches snapshot', () => {
    const { container } = renderWithGameContext(<ActionModalTax />, {
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
          pos: 2,
          propertiesOwned: [],
        },
      },
    });

    expect(container.firstChild).toMatchSnapshot();
  });

  test.skip('renders the correct text', () => {
    const { container } = renderWithGameContext(<ActionModalTax />, {
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
          pos: 2,
          propertiesOwned: [],
        },
      },
    });
    expect(container.textContent).toContain('£200 Tax');

    expect(container.textContent).toContain('Pay');
  });

  test('clicking button pays correct amount of tax to the bank', async () => {
    const payBank = jest.fn();
    const { container } = renderWithGameContext(<ActionModalTax />, {
      currentPlayer: fakePlayer('cat'),
      gameSettings: fakeGameSettings(),
      payBank,
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
          pos: 2,
          propertiesOwned: [],
        },
      },
    });

    const button = container.querySelector('button');
    expect(button).toBeTruthy();
    await act(async () => {
      await button?.click();
      await new Promise(resolve => setTimeout(resolve, 1000));
    });
    expect(payBank).toHaveBeenCalledWith('cat', 200);
  });
});
