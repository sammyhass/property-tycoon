import ActionModal, { ActionType } from '@/components/ActionModal';
import { GameT } from '@/pages/admin/games/[game_id]';
import { CardAction, CardType, SpaceType } from '@prisma/client';
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

  move: (player: TokenType, position: number) => void;

  time: number;

  addPlayer: (player: Player) => void;

  removePlayer: (playerToken: TokenType) => void;

  setPlayerPosition: (player: TokenType, position: number) => void;

  resetGame: () => void;

  setCurrentPlayer: (player: TokenType) => void;

  isPaused: boolean;

  setIsPaused: (isPaused: boolean) => void;

  takeCard: (type: CardType) => CardAction | null;

  hasStarted: boolean;
  handleStartGame: () => void;

  showActionModal: (action: ActionType) => void;
  hideActionModal: () => void;

  buy: (player: TokenType, property_id: string) => void;
};

export const GameContext = createContext<GameContextT>({
  gameSettings: null,
  players: [],
  state: {},
  currentPlayer: null,
  setPlayers: () => {},
  move: () => {},
  addPlayer: () => {},
  removePlayer: () => {},
  setPlayerPosition: () => {},
  resetGame: () => {},
  setCurrentPlayer: () => {},
  isPaused: false,
  takeCard: (type: CardType) => null,
  setIsPaused: () => {},
  hasStarted: false,
  handleStartGame: () => {},
  showActionModal: () => {},
  hideActionModal: () => {},
  buy: () => {},
  time: 0,
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

  const [showModal, setShowActionModal] = useState(false);

  // Current action the current player is taking
  const [currentAction, setCurrentAction] = useState<ActionType | null>(null);

  const [hasStarted, setHasStarted] = useState(false);

  const [isPaused, setIsPaused] = useState(false);

  const [players, setPlayers] = useState<Player[]>([]);

  // The current state of the game is stored in this object
  const [state, setState] = useState<PlayerState>({});

  const [currentPlayerToken, _setCurrentPlayerToken] =
    useState<TokenType | null>(null);

  const [time, setTime] = useState<number>(0);

  const currentPlayer = useMemo((): Player | null => {
    const idx = players.findIndex(p => p.token === currentPlayerToken);
    if (idx < 0) return null;
    return players[idx];
  }, [currentPlayerToken]);

  const move = (player: TokenType, position: number) => {
    console.log('move', player, position);
    // Based on what the player lands on, we want to open an action modal
    const nextBoardSpace = gameSettings?.BoardSpaces.find(
      bs => bs.board_position === (state[player]?.pos ?? 0) + position
    );

    setState({
      ...state,
      [player]: {
        ...state[player],
        pos: (state[player]?.pos ?? 0) + position,
      },
    });

    // Now we must choose which action modal to show based on the space
    switch (nextBoardSpace?.space_type) {
      case SpaceType.GO:
        setCurrentAction('GO');
      case SpaceType.TAKE_CARD:
        showActionModal(
          nextBoardSpace.take_card === 'POT_LUCK'
            ? 'TAKE_POT_LUCK'
            : 'TAKE_OPPORTUNITY_KNOCKS'
        );
        break;
      case SpaceType.GO_TO_JAIL:
        showActionModal('GO_TO_JAIL');
        break;
      case SpaceType.FREE_PARKING:
        showActionModal('FREE_PARKING');
        break;
      case SpaceType.PROPERTY:
        if (!nextBoardSpace.property_id) break; // We know that if the board space is property, it must have a property id
        if (isOwned(nextBoardSpace.property_id)) {
          // If the property is owned, show the rent modal, otherwise show the buy modal
          showActionModal('PAY_RENT');
        } else {
          showActionModal('BUY');
        }
        break;
      default:
        setCurrentAction(null);
    }
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

  const buy = useCallback(
    (player: TokenType, property_id: string) => {
      const playerState = state[player];
      if (!playerState) return;
      const property = gameSettings?.Properties.find(p => p.id === property_id);

      if (!property) return;

      const newMoney = playerState.money - (property.price ?? 0);
      if (newMoney < 0) return;

      setState({
        ...state,
        [player]: {
          ...playerState,
          money: newMoney,
          propertiesOwned: [
            ...(playerState.propertiesOwned ?? []),
            property_id,
          ],
        },
      });
    },
    [state, gameSettings]
  );

  const setCurrentPlayer = useCallback(
    (player: TokenType) => {
      const playerIndex = players.findIndex(p => p.token === player);
      if (playerIndex < 0) return;
      _setCurrentPlayerToken(player);
    },
    [players]
  );

  useEffect(() => {
    setIsPaused(false);
    const timer = setInterval(() => {
      if (!isPaused && hasStarted) {
        setTime(time + 1);
      }
    }, 1000);
    return () => {
      clearInterval(timer);
    };
  }, [hasStarted, isPaused, time]);

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

  const beginTurn = useCallback(() => {
    setCurrentAction('ROLL');
  }, []);

  /// Handle start game should be run when the game is started (after initial setup where players are added)
  // it initializes the board state, gives starting money to players, and sets the current player
  const handleStartGame = useCallback(() => {
    setHasStarted(true);

    // Initialize board state
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

    // Begin the first turn
    setCurrentPlayer(players[0].token);
    showActionModal('ROLL');
  }, [players, setHasStarted]);

  // Deals with showing the action modal
  const showActionModal = useCallback(
    (action: ActionType) => {
      setTimeout(() => {
        setCurrentAction(action);
        setShowActionModal(true);
      }, 200);
    },
    [setCurrentAction]
  );

  // Deals with hiding the action modal
  const hideActionModal = useCallback(() => {
    setShowActionModal(false);
    setCurrentAction(null);
  }, [setShowActionModal]);

  // Work out if a property is owned and by which player
  const isOwned = useCallback(
    (propertyId: string) => {
      const property = gameSettings?.Properties.find(p => p.id === propertyId);

      if (!property) return null;

      const [token, playerState] = (Object.entries(state).find(([, v]) =>
        v?.propertiesOwned.includes(propertyId)
      ) as [TokenType, PlayerState[TokenType]]) ?? [null, null];

      if (!token || !playerState) return null;

      return {
        token,
        playerState,
      };
    },
    [gameSettings, state]
  );

  return (
    <GameContext.Provider
      value={{
        gameSettings,
        showActionModal,
        buy,
        players,
        state,
        currentPlayer,
        hasStarted,
        handleStartGame,
        setPlayers,
        move,
        time,
        hideActionModal,
        addPlayer,
        removePlayer,
        setPlayerPosition,
        resetGame,
        setCurrentPlayer,
        isPaused,
        setIsPaused,
        takeCard,
      }}
    >
      {children}
      <ActionModal
        action={currentAction}
        onClose={hideActionModal}
        isOpen={!!currentAction && showModal}
      />
    </GameContext.Provider>
  );
};
