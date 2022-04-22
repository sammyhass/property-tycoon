import ActionModalTax from '@/components/Game/ActionModal/Tax';
import { act } from '@testing-library/react';
import React from 'react';
import {
  fakeBoardSpace,
  fakeGameSettings,
  fakePlayer,
  fakePlayerState,
  renderWithGameContext,
} from '../fakers';

describe('Tax ActionModal', () => {
  test('matches snapshot', () => {
    const { container } = renderWithGameContext(<ActionModalTax />, {
      currentPlayer: fakePlayer('cat'),
      gameSettings: fakeGameSettings(),
      state: {
        boot: fakePlayerState(),
        cat: fakePlayerState(),
      },
    });

    expect(container.firstChild).toMatchSnapshot();
  });

  test.skip('renders the correct text', () => {
    const { container } = renderWithGameContext(<ActionModalTax />, {
      currentPlayer: fakePlayer('cat'),
      gameSettings: fakeGameSettings({
        BoardSpaces: [
          fakeBoardSpace({
            board_position: 1,
            tax_cost: 200,
            space_type: 'TAX',
          }),
        ],
      }),
      state: {
        boot: fakePlayerState(),
        cat: fakePlayerState(),
      },
    });
    expect(container.textContent).toContain('£200 Tax');

    expect(container.textContent).toContain('Pay');
  });

  test('clicking button pays correct amount of tax to the bank', async () => {
    const payToFreeParking = jest.fn();
    const { container } = renderWithGameContext(<ActionModalTax />, {
      currentPlayer: fakePlayer('cat'),
      gameSettings: fakeGameSettings({
        BoardSpaces: [
          fakeBoardSpace({
            board_position: 1,
            tax_cost: 200,
            space_type: 'TAX',
          }),
        ],
      }),
      payToFreeParking,
      state: {
        boot: fakePlayerState(),
        cat: fakePlayerState({
          pos: 1,
        }),
      },
    });

    const button = container.querySelector('button');
    expect(button).toBeTruthy();
    await act(async () => {
      await button?.click();
      await new Promise(resolve => setTimeout(resolve, 1000));
    });
    expect(payToFreeParking).toHaveBeenCalledWith('cat', 200);
  });
});
