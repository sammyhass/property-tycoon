import BoardSpace from '@/components/Game/Board/spaces';
import { TOKENS_MAP } from '@/hooks/useGameContext';
import { render } from '@testing-library/react';
import React from 'react';
import { fakeBoardSpace, fakePlayer } from '../fakers';

// The hasPlayers prop is shared between all spaces and is used to determine if the space should render a player icon.
// it works the same in each space so no need to individually test it for each space.
describe('BoardSpace with players', () => {
  it('matches snapshot', () => {
    const players = [fakePlayer('boot'), fakePlayer('cat')];
    const { container } = render(
      <BoardSpace
        property={null}
        {...fakeBoardSpace()}
        hasPlayers={players.map(p => p.token)}
      />
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('shows correct players', () => {
    const players = [
      fakePlayer('cat'),
      fakePlayer('ship'),
      fakePlayer('hatstand'),
    ];
    const { container } = render(
      <BoardSpace
        property={null}
        {...fakeBoardSpace()}
        hasPlayers={players.map(p => p.token)}
      />
    );

    players.forEach(p => {
      expect(container.textContent).toContain(TOKENS_MAP[p.token]);
    });
  });

  it('does not show players when there are none', () => {
    const { container } = render(
      <BoardSpace property={null} {...fakeBoardSpace()} hasPlayers={[]} />
    );

    expect(container.textContent).not.toContain('🐱');
  });
});
