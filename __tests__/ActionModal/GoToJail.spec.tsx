import ActionModalGoToJail from '@/components/Game/ActionModal/GoToJail';
import { PlayersState } from '@/hooks/useGameContext';
import { act } from '@testing-library/react';
import React from 'react';
import { fakePlayer, fakePlayerState, renderWithGameContext } from '../fakers';

describe('Go to Jail ActionModal', () => {
  it('matches snapshot', () => {
    const { container } = renderWithGameContext(<ActionModalGoToJail />, {
      currentPlayer: fakePlayer('cat'),
    });

    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders the correct text', () => {
    const { container } = renderWithGameContext(<ActionModalGoToJail />, {
      currentPlayer: fakePlayer('boot'),
    });

    expect(container.textContent?.toUpperCase()).toContain('GO TO JAIL');
    expect(container.textContent?.toUpperCase()).toContain(
      'YOU HAVE BEEN SENT TO JAIL'
    );
  });

  it('after clicking button, player is sent to jail', async () => {
    let state: PlayersState = {
      cat: fakePlayerState(),
      boot: fakePlayerState(),
    };

    const sendToJail = jest.fn();

    const { container } = renderWithGameContext(<ActionModalGoToJail />, {
      currentPlayer: fakePlayer('cat'),
      state,
      sendToJail,
    });

    const btn = container.querySelector('button');

    if (!btn) throw new Error('No button found');

    await act(async () => {
      btn.click();

      await new Promise(resolve => setTimeout(resolve, 1200));
    });

    expect(sendToJail).toHaveBeenCalledWith('cat');
  });
});
