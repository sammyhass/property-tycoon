import { GameProperty } from '@prisma/client';
import { useCallback, useMemo } from 'react';
import {
  Player,
  PlayerState,
  TokenType,
  useGameContext,
} from './useGameContext';

type UsePlayerT = (token: TokenType | undefined) => {
  isTurn?: boolean;
  sendToJail: () => void;
  getOwnedProperties: () => GameProperty[];
} & Partial<Player> &
  Partial<PlayerState[TokenType]>;

export const usePlayer: UsePlayerT = token => {
  const {
    currentPlayer,
    players,
    gameSettings,
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

  const sendToJail = useCallback(() => {
    if (!token) return;
    sendToJailCtx(token);
  }, [sendToJailCtx, token]);

  const playerState = useMemo(() => {
    if (!token || !state[token]) return undefined;
    return state[token];
  }, [token, state]);

  const getOwnedProperties = useCallback(() => {
    if (!playerState) return [];

    const { propertiesOwned } = playerState;

    const properties: GameProperty[] = Object.values(propertiesOwned)
      .reduce(
        (acc, curr) => [...acc, ...Object.entries(curr).map(([k, v]) => k)],
        [] as string[]
      )
      .map(
        id => gameSettings?.Properties.find(p => p.id === id) as GameProperty
      )
      .filter(p => !!p);

    return properties;
  }, [playerState, gameSettings]);

  return {
    ...player,
    getOwnedProperties,
    isTurn,
    sendToJail,

    ...((token ? state[token] : {}) as PlayerState[TokenType]),
  };
};
