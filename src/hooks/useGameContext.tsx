import ActionModal, { ActionType } from '@/components/Game/ActionModal';
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

// Constants
const NUM_TILES = 40;
const STARTING_MONEY = 50000;
// ---

// Tokens a player can use in the game (gonna be emoji)
export type TokenType =
  | 'boot'
  | 'smartphone'
  | 'ship'
  | 'hatstand'
  | 'cat'
  | 'iron';
// ---

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

    // Whether player is in jail
    inJail: boolean;
  };
}>;

export type Player = {
  name: string;
  token: TokenType;
};

// The GameContextT is the type of the context object that is passed to the children of the GameContextProvider.
// It contains the state of the game, and the functions to update it.
export type GameContextT = {
  gameSettings: GameSettingsT | null;

  players: Player[];
  state: PlayerState;
  currentPlayer: Player | null;

  // Move function moves a player by a given number of tiles.
  move: (player: TokenType, position: number) => void;

  // goto function moves a player to a given tile.
  goto: (player: TokenType, position: number) => void;

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

  // Buy a property
  buy: (player: TokenType, property_id: string) => void;

  // Pay money to the bank
  payBank: (player: TokenType, amount: number) => void;
  payPlayer: (sender: TokenType, payee: TokenType, amount: number) => void;

  // Adding and removing from Free Parking
  addToFreeParking: (amount: number) => void;
  landedOnFreeParking: (player: TokenType) => number;

  endTurn: () => void;

  // Get the owner of a property
  isOwned: (propertyId: string) => {
    token: TokenType;
    playerState: {
      pos: number;
      propertiesOwned: string[];
      money: number;
    };
  } | null;

  // Send a player to jail
  sendToJail: (player: TokenType) => void;
};

export const GameContext = createContext<GameContextT>({
  gameSettings: null,
  players: [],
  state: {},
  currentPlayer: null,
  move: () => {},
  addPlayer: () => {},
  removePlayer: () => {},
  setPlayerPosition: () => {},
  payPlayer: () => {},
  resetGame: () => {},
  addToFreeParking: () => {},
  landedOnFreeParking: () => 0,
  setCurrentPlayer: () => {},
  isPaused: false,
  takeCard: (type: CardType) => null,
  payBank: () => {},
  setIsPaused: () => {},
  isOwned: () => null,
  hasStarted: false,
  handleStartGame: () => {},
  endTurn: () => {},
  showActionModal: () => {},
  sendToJail: () => {},
  hideActionModal: () => {},
  goto: () => {},
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

  const [totalOnFreeParking, setTotalOnFreeParking] = useState(0);

  const [currentPlayerToken, _setCurrentPlayerToken] =
    useState<TokenType | null>(null);

  const [time, setTime] = useState<number>(0);

  const currentPlayer = useMemo((): Player | null => {
    const idx = players.findIndex(p => p.token === currentPlayerToken);
    if (idx < 0) return null;
    return players[idx];
  }, [currentPlayerToken]);

  const goto = useCallback(
    (player: TokenType, position: number, passGo: boolean = true) => {
      const current = state[player]?.pos ?? 0;
      const diff = position - current;
      move(player, diff, passGo);
    },
    [state]
  );

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

  const move = useCallback(
    (player: TokenType, moveBy: number, passGo: boolean = true) => {
      if (!gameSettings) return;

      console.log('move', player, moveBy);
      // Based on what the player lands on, we want to open an action modal

      const newPostion = state[player]?.pos ?? 0;

      const sortedSpaces = gameSettings.BoardSpaces.sort(
        (a, b) => b.board_position - a.board_position
      );

      const lastSpace = sortedSpaces[0];

      const firstSpace = sortedSpaces[sortedSpaces.length - 1];

      let newPos = newPostion + moveBy;
      if (newPos > lastSpace.board_position) {
        newPos =
          newPostion +
          moveBy -
          lastSpace.board_position +
          firstSpace.board_position;
        // Player has passed go
        setState({
          ...state,
          [player]: {
            ...state[player],
            pos: newPos,
            money: (state[player]?.money ?? 0) + (passGo ? 200 : 0),
          },
        });
      }

      const nextBoardSpace = gameSettings?.BoardSpaces.find(
        bs => bs.board_position === newPos
      );

      setState({
        ...state,
        [player]: {
          ...state[player],
          pos: newPos,
        },
      });

      // Now we must choose which action modal to show based on the space
      switch (nextBoardSpace?.space_type) {
        case SpaceType.GO:
          showActionModal('GO');
          break;
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
        case SpaceType.TAX:
          showActionModal('TAX');
          break;
        case SpaceType.PROPERTY:
          if (!nextBoardSpace.property_id) break; // We know that if the board space is property, it must have a property id
          const owner = isOwned(nextBoardSpace.property_id);
          if (owner && owner.token !== player) {
            // If the property is owned, show the rent modal, otherwise show the buy modal
            showActionModal('PAY_RENT');
          } else if (!owner) {
            showActionModal('BUY');
          } else {
            hideActionModal();
          }
          break;
        default:
          hideActionModal();
          break;
      }
    },
    [state, isOwned, gameSettings]
  );

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

  const payBank = useCallback(
    (playerToken: TokenType, amount: number) => {
      setState({
        ...state,
        [playerToken]: {
          ...state[playerToken],
          money: (state[playerToken]?.money ?? 0) - amount,
        },
      });
    },
    [state]
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

  const addToFreeParking = useCallback(
    (amount: number) => {
      setTotalOnFreeParking(totalOnFreeParking + amount);
    },
    [totalOnFreeParking]
  );

  const landedOnFreeParking = useCallback(
    (player: TokenType) => {
      const playerState = state[player];
      const amount = totalOnFreeParking;
      if (!playerState) return 0;
      const newMoney = playerState.money + amount;
      setState({
        ...state,
        [player]: {
          ...playerState,
          money: newMoney,
        },
      });
      setTotalOnFreeParking(0);
      return amount ?? 0;
    },
    [state, totalOnFreeParking]
  );

  const sendToJail = useCallback(
    (player: TokenType) => {
      const playerState = state[player];
      if (!playerState) return;
      setState({
        ...state,
        [player]: {
          ...playerState,
          pos:
            gameSettings?.BoardSpaces.find(
              bs => bs.space_type === SpaceType.JUST_VISIT
            )?.board_position ?? 0,
          inJail: true,
        },
      });
    },
    [state]
  );
  // Send money between players, used for paying rent
  const payPlayer = useCallback(
    (sender: TokenType, payee: TokenType, amount: number) => {
      const senderState = state[sender];
      if (!senderState) return;

      const payeeState = state[payee];

      if (!payeeState) return;

      const newMoney = senderState.money - amount;

      if (newMoney < 0) return;

      setState({
        ...state,
        [sender]: {
          ...senderState,
          money: newMoney,
        },
        [payee]: {
          ...payeeState,
          money: payeeState.money + amount,
        },
      });
    },
    [state]
  );

  // End the current player's turn and begin the next player's turn
  const endTurn = useCallback(() => {
    hideActionModal();

    // Find the next player
    const nextPlayerIndex =
      players.findIndex(p => p.token === currentPlayerToken) + 1;

    if (nextPlayerIndex >= players.length) {
      _setCurrentPlayerToken(players[0].token);
    } else {
      _setCurrentPlayerToken(players[nextPlayerIndex].token);
    }

    setTimeout(() => {
      showActionModal('ROLL');
    }, 500);
  }, [players, currentPlayerToken]);

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

  return (
    <GameContext.Provider
      value={{
        gameSettings,
        showActionModal,
        landedOnFreeParking,
        addToFreeParking,
        buy,
        players,
        state,
        goto,
        currentPlayer,
        hasStarted,
        handleStartGame,
        move,
        time,
        hideActionModal,
        endTurn,
        addPlayer,
        removePlayer,
        payBank,
        sendToJail,
        isOwned,
        payPlayer,
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
