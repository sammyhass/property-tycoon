import { GameT } from '@/pages/admin/games/[game_id]';
import { CardAction, CardType } from '@prisma/client';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

const NUM_TILES = 40;
const STARTING_MONEY = 50000;

// Tokens a player can use in the game (gonna be emoji)
export type TokenType =
  | 'boot'
  | 'smartphone'
  | 'ship'
  | 'hatstand'
  | 'cat'
  | 'iron';

export const TOKENS_MAP: { [key in TokenType]: string } = {
  boot: '🥾',
  smartphone: '📱',
  ship: '🚢',
  hatstand: '🎩',
  cat: '🐱',
  iron: '🔨',
};

type PlayerState = Partial<{
  [token in TokenType]: {
    pos: number;

    // Ids of properties owned
    propertiesOwned: string[];

    // Current money belonging to player.
    money: number;
  };
}>;

export type Player = {
  name: string;
  token: TokenType;
};

export type GameContextT = {
  gameSettings: GameSettingsT | null;

  players: Player[];
  state: PlayerState;
  currentPlayer: Player | null;

  setPlayers: (players: Player[]) => void;

  move: (player: string, position: number) => void;

  getTimeDisplay: () => number;

  addPlayer: (player: Player) => void;

  removePlayer: (playerToken: TokenType) => void;

  setPlayerPosition: (player: TokenType, position: number) => void;

  resetGame: () => void;

  setCurrentPlayer: (player: TokenType) => void;

  isPaused: boolean;

  setIsPaused: (isPaused: boolean) => void;

  onLand: (player: TokenType, pos: number) => void;

  takeCard: (type: CardType) => CardAction | null;

  hasStarted: boolean;
  handleStartGame: () => void;
};

export const GameContext = createContext<GameContextT>({
  gameSettings: null,
  players: [],
  state: {},
  currentPlayer: null,
  setPlayers: () => {},
  move: () => {},
  getTimeDisplay: () => 0,
  addPlayer: () => {},
  removePlayer: () => {},
  setPlayerPosition: () => {},
  resetGame: () => {},
  setCurrentPlayer: () => {},
  isPaused: false,
  takeCard: (type: CardType) => null,
  setIsPaused: () => {},
  onLand: (player, pos: number) => {},
  hasStarted: false,
  handleStartGame: () => {},
});

export const useGameContext = () => useContext(GameContext);

type GameSettingsT = GameT;

export const GameContextProvider = ({
  children,
  initialGameSettings,
}: {
  children: React.ReactNode;
  initialGameSettings: GameSettingsT;
}) => {
  const [gameSettings, setGameSettings] = useState<GameSettingsT | null>(
    initialGameSettings
  );

  const [hasStarted, setHasStarted] = useState(false);

  const [isPaused, setIsPaused] = useState(false);

  const [players, setPlayers] = useState<Player[]>([]);
  const [state, setState] = useState<PlayerState>({});

  const [currentPlayerToken, _setCurrentPlayerToken] =
    useState<TokenType | null>(null);

  const [time, setTime] = useState<number>(0);

  const currentPlayer = useMemo((): Player | null => {
    const idx = players.findIndex(p => p.token === currentPlayerToken);
    if (idx < 0) return null;
    return players[idx];
  }, [currentPlayerToken]);

  const move = (player: string, position: number) => {
    setState({
      ...state,
      [player]: {
        pos: position,
      },
    });
  };

  const takeCard = useCallback(
    (type: CardType) => {
      const card = gameSettings?.CardActions?.find(c => c.type === type);
      if (!card) return null;
      setGameSettings(
        gameSettings
          ? {
              ...gameSettings,
              CardActions: [...gameSettings.CardActions.slice(1), card],
            }
          : null
      );
      return card;
    },
    [gameSettings]
  );

  const setCurrentPlayer = useCallback(
    (player: TokenType) => {
      const playerIndex = players.findIndex(p => p.token === player);
      if (playerIndex < 0) return;
      _setCurrentPlayerToken(player);
    },
    [players]
  );

  const getTimeDisplay = () => {
    return time;
  };

  useEffect(() => {
    setIsPaused(false);
    const timer = setInterval(() => {
      if (!isPaused) {
        setTime(time + 1);
      }
    }, 1000);
    return () => {
      clearInterval(timer);
    };
  }, []);

  const addPlayer = (player: Player) => {
    setPlayers([...players, player]);
  };

  const removePlayer = useCallback(
    (playerToken: TokenType) => {
      setPlayers(players.filter(player => player.token !== playerToken));
    },
    [players]
  );

  const setPlayerPosition = useCallback(
    (token: TokenType, position: number) => {
      if (
        !players.find(p => p.token === token) ||
        position < 0 ||
        position > NUM_TILES
      )
        return;

      setState({
        ...state,
        [token]: {
          pos: position,
        },
      });
    },
    [state, players]
  );

  const resetGame = useCallback(() => {
    setPlayers([]);
    setState({});
    _setCurrentPlayerToken(null);
    setTime(0);
  }, []);

  /// Handle start game should be run when the game is started (after initial setup where players are added)
  // it initializes the board state, gives starting money to players, and sets the current player
  const handleStartGame = useCallback(() => {
    setHasStarted(true);
    setState(
      players.reduce(
        (acc, player) => ({
          ...acc,
          [player.token]: {
            pos: 0,
            propertiesOwned: [],
            money: STARTING_MONEY,
          },
        }),
        {}
      )
    );
  }, [players, setHasStarted]);

  return (
    <GameContext.Provider
      value={{
        gameSettings,
        players,
        state,
        currentPlayer,
        hasStarted,
        handleStartGame,
        setPlayers,
        move,
        getTimeDisplay,
        addPlayer,
        removePlayer,
        setPlayerPosition,
        resetGame,
        setCurrentPlayer,
        isPaused,
        setIsPaused,
        onLand: () => {},
        takeCard,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
