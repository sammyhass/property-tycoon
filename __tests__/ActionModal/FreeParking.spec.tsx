import ActionModalFreeParking from '@/components/Game/ActionModal/FreeParking';
import { PlayersState, TokenType } from '@/hooks/useGameContext';
import { act } from 'react-dom/test-utils';
import { fakePlayer, fakePlayerState, renderWithGameContext } from '../fakers';

describe('Free Parking Action Modal', () => {
  it('should match snapshot', () => {
    const { container } = renderWithGameContext(<ActionModalFreeParking />, {
      currentPlayer: fakePlayer('boot'),
      state: {
        boot: fakePlayerState({ pos: 1 }),
        cat: fakePlayerState({ pos: 1 }),
      },
      totalOnFreeParking: 100,
    });

    expect(container.firstChild).toMatchSnapshot();
  });

  it('should render correct text', () => {
    const { container } = renderWithGameContext(<ActionModalFreeParking />, {
      currentPlayer: fakePlayer('boot'),
      state: {
        boot: fakePlayerState({ pos: 1 }),
        cat: fakePlayerState({ pos: 1 }),
      },
      totalOnFreeParking: 100,
    });

    expect(container.textContent).toContain('Free Parking');
  });

  it('should render correct amount of money', () => {
    const { container } = renderWithGameContext(<ActionModalFreeParking />, {
      currentPlayer: fakePlayer('boot'),
      state: {
        boot: fakePlayerState({ pos: 1 }),
        cat: fakePlayerState({ pos: 1 }),
      },
      totalOnFreeParking: 100,
    });

    expect(container.textContent).toContain('£100');
  });

  it('on clicking collect button, the total in free parking is collected by the current player', async () => {
    let totalOnFreeParking = 200;
    let state: PlayersState = {
      boot: fakePlayerState({ pos: 1, money: 0 }),
      cat: fakePlayerState({ pos: 1, money: 0 }),
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
    expect(state.boot?.money).toBe(200);
    // And not to the other player
    expect(state.cat?.money).toBe(0);
  });
});
