import { board_space, game, game_card, game_property } from '@prisma/client';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

// Token the player can use in the game
// TODO:
type TokenType = 'blue' | 'green' | 'red' | 'yellow';

type PositionsT = Partial<{
  [token in TokenType]: {
    pos: number;
  };
}>;

export type Player = {
  name: string;
  token: TokenType;
};

export type GameContextT = {
  gameSettings: GameSettingsT | null;

  players: Player[];
  positions: PositionsT;
  currentPlayer: Player | null;

  setPlayers: (players: Player[]) => void;

  move: (player: string, position: number) => void;

  getTimeDisplay: () => number;

  addPlayer: (player: Player) => void;

  removePlayer: (playerToken: TokenType) => void;

  setPlayerPosition: (player: TokenType, position: number) => void;

  resetGame: () => void;

  setCurrentPlayer: (player: TokenType) => void;

  boardSize: number;
  setBoardSize: (boardSize: number) => void;

  cellSize: number;
  setCellSize: (cellSize: number) => void;

  isPaused: boolean;

  setIsPaused: (isPaused: boolean) => void;
};

export const GameContext = createContext<GameContextT>({
  gameSettings: null,
  players: [],
  positions: {},
  currentPlayer: null,
  setPlayers: () => {},
  move: () => {},
  getTimeDisplay: () => 0,
  addPlayer: () => {},
  removePlayer: () => {},
  setPlayerPosition: () => {},
  resetGame: () => {},
  setCurrentPlayer: () => {},

  boardSize: 10,
  setBoardSize: () => {},

  cellSize: 80,
  setCellSize: () => {},
  isPaused: false,
  setIsPaused: () => {},
});

export const useGameContext = () => useContext(GameContext);

type GameSettingsT = game & {
  game_properties: game_property[];
  cards: game_card[];
  board_spaces: board_space[];
};

export const GameContextProvider: React.FC = ({ children }) => {
  const [loadingActiveBoard, setLoadingActiveBoard] = useState(true);

  const [gameSettings, setGameSettings] = useState<GameSettingsT | null>(null);

  useEffect(() => {
    const fetchBoard = async () => {
      const response = await fetch('/api/game/active');
      const board = (await response.json()) as GameSettingsT;
      setLoadingActiveBoard(false);
      setGameSettings(board);
    };

    fetchBoard();
  }, []);

  const [isPaused, setIsPaused] = useState(false);

  const [players, setPlayers] = useState<Player[]>([]);
  const [positions, setPositions] = useState<PositionsT>({});
  const [currentPlayerToken, _setCurrentPlayerToken] =
    useState<TokenType | null>(null);

  const [boardSize, setBoardSize] = useState<number>(10);
  const [cellSize, setCellSize] = useState<number>(80);
  const [time, setTime] = useState<number>(0);

  const numTiles = useMemo(() => {
    return boardSize * boardSize - (boardSize - 2) * (boardSize - 2);
  }, [boardSize]);

  const currentPlayer = useMemo((): Player | null => {
    const idx = players.findIndex(p => p.token === currentPlayerToken);
    if (idx < 0) return null;
    return players[idx];
  }, [currentPlayerToken]);

  const move = (player: string, position: number) => {
    setPositions({
      ...positions,
      [player]: {
        pos: position,
      },
    });
  };

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
        position > numTiles - 1
      )
        return;

      setPositions({
        ...positions,
        [token]: {
          pos: position,
        },
      });
    },
    [positions, players]
  );

  const resetGame = useCallback(() => {
    setPlayers([]);
    setPositions({});
    _setCurrentPlayerToken(null);
    setTime(0);
  }, []);

  return (
    <GameContext.Provider
      value={{
        gameSettings,
        players,
        positions,
        currentPlayer,
        setPlayers,
        move,
        getTimeDisplay,
        addPlayer,
        removePlayer,
        boardSize,
        cellSize,
        setPlayerPosition,
        resetGame,
        setCurrentPlayer,
        setBoardSize,
        setCellSize,
        isPaused,
        setIsPaused,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
