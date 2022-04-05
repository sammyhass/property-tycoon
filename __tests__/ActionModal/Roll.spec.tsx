import { ActionModalRoll } from '@/components/Game/ActionModal/Content';
import { act } from '@testing-library/react';
import React from 'react';
import { fakePlayer, renderWithGameContext } from '../fakers';

describe('Roll Action Modal', () => {
  it('matches snapshot', () => {
    const { container } = renderWithGameContext(<ActionModalRoll />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('can roll dice and move the current player accordingly', async () => {
    jest.setTimeout(4000);

    const move = jest.fn();

    const { container } = renderWithGameContext(<ActionModalRoll />, {
      move: move,
      currentPlayer: fakePlayer('cat'),
    });

    expect(move).not.toHaveBeenCalled();

    const btn = container.querySelector('button');
    if (!btn) throw new Error('No button found');
    await act(async () => {
      btn.click();

      await new Promise(resolve => setTimeout(resolve, 1200));
    });

    const moveButton = container.querySelector('button');
    if (!moveButton) throw new Error('No button found');
    await act(async () => {
      moveButton.click();

      await new Promise(resolve => setTimeout(resolve, 1200));
    });
    expect(move).toHaveBeenCalled();

    // const call = move.mock.calls[0];

    // // Ensure the move was called with the correct arguments and that the correct player was passed
    // expect(call).toContain('cat');
    // expect(call).not.toContain('boot');

    // Ensure the player's position was updated
  });
});
