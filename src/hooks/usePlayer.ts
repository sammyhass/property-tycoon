import { BoardSpace, GameProperty } from '@prisma/client';
import { useCallback, useMemo } from 'react';
import {
  Player,
  PlayersState,
  PropertyState,
  TokenType,
  useGameContext,
} from './useGameContext';

type UsePlayerT = (token: TokenType | undefined) => {
  isTurn?: boolean;
  sendToJail: () => void;
  getOwnedProperties: () => GameProperty[];
  getCurrentBoardSpace: () =>
    | (BoardSpace & {
        property: GameProperty | null;
      })
    | null;
} & Partial<Player> &
  Partial<PlayersState[TokenType]>;

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

  const getCurrentBoardSpace = useCallback<
    ReturnType<UsePlayerT>['getCurrentBoardSpace']
  >(() => {
    if (!playerState) return null;
    const space = gameSettings?.BoardSpaces.find(
      bs => bs.board_position === playerState.pos
    );

    if (!space) return null;

    if (space?.space_type === 'PROPERTY') {
      return {
        ...space,
        property:
          gameSettings?.Properties.find(p => p.id === space.property_id) ??
          null,
      };
    }

    return { ...space, property: null } ?? null;
  }, [playerState, gameSettings]);

  const getOwnedProperties = useCallback(() => {
    if (!playerState) return [];

    const { propertiesOwned } = playerState;

    const properties: (GameProperty & PropertyState)[] = Object.values(
      propertiesOwned
    )
      .reduce(
        (acc, curr) => [...acc, ...Object.entries(curr).map(([k, v]) => k)],
        [] as string[]
      )
      .map(
        id => gameSettings?.Properties.find(p => p.id === id) as GameProperty
      )
      .filter(p => !!p)
      .map(p => ({
        ...p,
        ...(propertiesOwned?.[p.property_group_color]?.[p.id] as PropertyState),
      }));

    return properties;
  }, [playerState, gameSettings]);

  return {
    ...player,
    getOwnedProperties,
    isTurn,
    sendToJail,
    getCurrentBoardSpace,
    ...((token ? state[token] : {}) as PlayersState[TokenType]),
  };
};
