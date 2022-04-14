import { useMemo } from 'react';
import {
  Player,
  PlayerState,
  TokenType,
  useGameContext,
} from './useGameContext';

type UsePlayerT = (token: TokenType) => {
  isTurn?: boolean;
} & Partial<Player> &
  Partial<PlayerState[TokenType]>;

export const usePlayer: UsePlayerT = token => {
  const { currentPlayer, players, state } = useGameContext();

  const player = useMemo(
    () => players.find(p => p.token === token),
    [token, players]
  );

  const isTurn = useMemo(
    () => currentPlayer?.token === token,
    [currentPlayer, token]
  );

  return {
    ...player,
    isTurn,
    ...state[token],
  };
};
