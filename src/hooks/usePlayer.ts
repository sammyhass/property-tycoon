import { useCallback, useMemo } from 'react';
import {
  Player,
  PlayerState,
  TokenType,
  useGameContext,
} from './useGameContext';

type UsePlayerT = (token: TokenType) => {
  isTurn?: boolean;
  sendToJail: () => void;
} & Partial<Player> &
  Partial<PlayerState[TokenType]>;

export const usePlayer: UsePlayerT = token => {
  const {
    currentPlayer,
    players,
    state,
    sendToJail: sendToJailCtx,
  } = useGameContext();

  const player = useMemo(
    () => players.find(p => p.token === token),
    [token, players]
  );

  const isTurn = useMemo(
    () => currentPlayer?.token === token,
    [currentPlayer, token]
  );

  const sendToJail = useCallback(
    () => sendToJailCtx(token),
    [sendToJailCtx, token]
  );

  return {
    ...player,
    isTurn,
    sendToJail,
    ...state[token],
  };
};
