import ActionSidebar, { ActionType } from '@/components/Game/ActionModal';
import GamePausedGuard from '@/components/Game/GamePausedGuard';
import { GameT } from '@/pages/admin/games/[game_id]';
import { calculateMortgageValue } from '@/util/calculate-mortgage-value';
import {
  calculatePropertyRent,
  calculateStationRent,
  calculateUtilityRent,
} from '@/util/calculate-rent';
import { formatPrice } from '@/util/formatPrice';
import { Flex, useToast } from '@chakra-ui/react';
import {
  CardAction,
  CardType,
  GameProperty,
  PropertyGroupColor,
  SpaceType,
} from '@prisma/client';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

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

export type PlayerState = Partial<{
  [token in TokenType]: {
    pos: number;

    // Ids of properties owned
    propertiesOwned: Partial<{
      [key in PropertyGroupColor]: {
        [propertyId: string]: {
          houses: number;
          mortgaged: boolean;
        };
      };
    }>;

    isBankrupt: boolean;

    // Current money belonging to player.
    money: number;

    // Whether player is in jail
    inJail: boolean;

    // How many turns player has been in jail
    turnsInJail: number;

    // last dice roll
    lastRoll: number;
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

  // Roll the dice and return the result, (don't move the player)
  rollDice: () => [number, number];

  // Move function moves a player by a given number of tiles.
  move: (player: TokenType, position: number, passGo?: boolean) => void;

  // goto function moves a player to a given tile.
  goto: (player: TokenType, position: number, passGo?: boolean) => void;

  time: number;

  addPlayer: (player: Player) => void;

  removePlayer: (playerToken: TokenType) => void;

  resetGame: () => void;

  isPaused: boolean;
  pause: () => void;
  resume: () => void;

  takeCard: (type: CardType) => CardAction | null;

  hasStarted: boolean;
  handleStartGame: () => void;

  showActionModal: (action: ActionType) => void;
  hideActionModal: () => void;

  showBuyHouseAction: (propertyId: string) => void;
  hideBuyHouseAction: () => void;
  propertyToBuyHouseOn: GameProperty | null;

  // Buy a property
  buy: (player: TokenType, property_id: string) => void;

  // Buy a house
  buyHouse: (player: TokenType, property_id: string, nHouse: number) => void;

  // Mortgage a property
  mortgage: (player: TokenType, property_id: string) => void;

  // Unmortgage a property
  unmortgage: (player: TokenType, property_id: string) => void;

  isMortgaged: (property_id: string) => boolean;

  // Pay money to the bank
  payBank: (player: TokenType, amount: number) => void;
  payPlayer: (sender: TokenType, payee: TokenType, amount: number) => void;

  // Adding and removing from Free Parking
  addToFreeParking: (amount: number) => void;
  landedOnFreeParking: (player: TokenType) => number;
  totalOnFreeParking: number;

  endTurn: () => void;
  canEndTurn: boolean;

  // Get the owner of a property
  isOwned: (propertyId: string) => {
    token: TokenType;
    ownerState: PlayerState[TokenType];
  } | null;

  calculateRent: (propertyId: string) => number;

  // Send a player to jail
  sendToJail: (player: TokenType) => void;
  freeFromJail: (player: TokenType) => void;
  failedToGetOutOfJail: (player: TokenType) => void;

  // Bankrupt a player
  bankrupt: (player: TokenType) => void;

  // Whether or not a player could pay an amount of money after mortgaging all their properties
  couldPay: (player: TokenType, amount: number) => boolean;
};

export const GameContext = createContext<GameContextT>({
  gameSettings: null,
  players: [],
  state: {},
  currentPlayer: null,
  move: () => {},
  mortgage: () => {},
  buyHouse: () => {},
  unmortgage: () => {},
  rollDice: () => [0, 0],
  addPlayer: () => {},
  pause: () => {},
  hideBuyHouseAction: () => {},
  showBuyHouseAction: () => {},
  propertyToBuyHouseOn: null,
  resume: () => {},
  removePlayer: () => {},
  calculateRent: () => 0,
  bankrupt: () => {},
  couldPay: () => false,
  payPlayer: () => {},
  resetGame: () => {},
  isMortgaged: () => false,
  addToFreeParking: () => {},
  freeFromJail: () => {},
  landedOnFreeParking: () => 0,
  isPaused: false,
  takeCard: (type: CardType) => null,
  payBank: () => {},
  totalOnFreeParking: 0,
  isOwned: () => null,
  hasStarted: false,
  handleStartGame: () => {},
  endTurn: () => {},
  canEndTurn: false,
  showActionModal: () => {},
  failedToGetOutOfJail: () => {},
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
  const toast = useToast({ position: 'top' });

  const [gameSettings, setGameSettings] = useState<GameSettingsT | null>(
    initialGameSettings
  );

  const [time, setTime] = useState(0);

  // Current action the current player is taking
  const [currentAction, setCurrentAction] = useState<ActionType | null>(null);

  // The property the player wishes to buy a house on
  const [propertyToBuyHouseOn, setPropertyToBuyHouseOn] =
    useState<GameProperty | null>(null);

  const [hasStarted, setHasStarted] = useState(false);

  const [isPaused, setIsPaused] = useState(false);

  const [players, setPlayers] = useState<Player[]>([]);

  // The current state of the game is stored in this object
  const [state, setState] = useState<PlayerState>({});

  const [totalOnFreeParking, setTotalOnFreeParking] = useState(0);

  const [currentPlayerToken, _setCurrentPlayerToken] =
    useState<TokenType | null>(null);

  const currentPlayer = useMemo((): Player | null => {
    const idx = players.findIndex(p => p.token === currentPlayerToken);
    if (idx < 0) return null;
    return players[idx];
  }, [currentPlayerToken]);

  // Roll dice will roll the dice and set the player's last roll to the result.
  // It does NOT move the player. That is the task of the move function or the goto function (which uses the move function).
  const rollDice = useCallback<() => [number, number]>(() => {
    if (!currentPlayerToken) return [0, 0];

    const dice1 = Math.floor(Math.random() * 6) + 1;
    const dice2 = Math.floor(Math.random() * 6) + 1;

    toast({
      title: `
      🎲 ${TOKENS_MAP[currentPlayerToken]} rolled ${dice1} and ${dice2}`,
    });

    setState({
      ...state,
      [currentPlayerToken as TokenType]: {
        ...state[currentPlayerToken as TokenType],
        lastRoll: dice1 + dice2,
      },
    });

    return [dice1, dice2];
  }, [currentPlayerToken, setState, state]);

  const goto = useCallback(
    (player: TokenType, position: number, passGo: boolean = true) => {
      const current = state[player]?.pos ?? 0;
      const diff = position - current;
      move(player, diff, passGo);
    },
    [state]
  );

  const failedToGetOutOfJail = useCallback(
    (player: TokenType) => {
      toast({
        title: `
        🎲 ${TOKENS_MAP[player]} failed to get out of jail`,
      });
      setState(state => ({
        ...state,
        [player]: {
          ...state[player],
          turnsInJail: (state[player]?.turnsInJail ?? 0) + 1,
        },
      }));
    },
    [setState]
  );

  const freeFromJail = useCallback(
    (player: TokenType) => {
      toast({
        title: `
        🎲 ${TOKENS_MAP[player]} is free from jail`,
      });
      setState(state => ({
        ...state,
        [player]: {
          ...state[player],
          inJail: false,
          turnsInJail: 0,
        },
      }));
    },
    [setState]
  );

  const bankrupt = useCallback(
    (player: TokenType) => {
      toast({
        title: `
        🎲 ${TOKENS_MAP[player]} is bankrupt`,
      });
      setState(state => ({
        ...state,
        [player]: {
          ...state[player],
          isBankrupt: true,
        } as PlayerState[TokenType],
      }));

      endTurn();

      // find the player who is not bankrupt
      const winner = Object.entries(state)
        .filter(([k, v]) => v.isBankrupt === false)
        .map(([k, v]) => k as TokenType);

      if (winner.length === 1) {
        toast({
          title: `
          🎉
          ${TOKENS_MAP[winner[0]]} is the winner!`,
        });

        setTimeout(() => {
          resetGame();
        }, 1000);
      }
    },
    [setState]
  );

  // Works out if a player could pay an amount of money after mortgaging all their properties
  const couldPay = useCallback(
    (player: TokenType, amount: number) => {
      const playerState = state[player];

      if (!playerState) return false;

      const { propertiesOwned } = playerState;

      let total = 0;

      total += playerState.money;

      // This is super inefficient, but the player generally wont own enough properties to make this super slow.
      for (const propertyGroup of Object.values(propertiesOwned)) {
        for (const [id, property] of Object.entries(propertyGroup)) {
          if (property.mortgaged) continue;

          const p = gameSettings?.Properties.find(p => p.id === id);

          if (!p) continue;

          total += (p.price ?? 0) / 2;
        }
      }

      return total >= amount;
    },
    [state, gameSettings]
  );

  // Work out if a property is owned and by which player
  const isOwned = useCallback(
    (propertyId: string) => {
      const property = gameSettings?.Properties.find(p => p.id === propertyId);

      if (!property || !property) return null;

      const ownerState = Object.entries(state).find(
        ([k, v]) =>
          v.propertiesOwned[property.property_group_color]?.[property.id]
      );

      if (!ownerState) return null;

      return {
        token: ownerState[0] as TokenType,
        ownerState: ownerState[1] as PlayerState[TokenType],
      };
    },
    [gameSettings, state]
  );

  const isMortgaged = useCallback(
    (propertyId: string) => {
      const property = gameSettings?.Properties?.find(p => p.id === propertyId);

      if (!property) return false;

      const playerState = isOwned(propertyId);

      if (!playerState) return false;

      return (
        playerState?.ownerState?.propertiesOwned?.[
          property?.property_group_color
        ]?.[propertyId]?.mortgaged ?? false
      );
    },
    [gameSettings, isOwned]
  );

  const buyHouse = useCallback(
    (player: TokenType, property_id: string, nHouse: number) => {
      const property = gameSettings?.Properties.find(p => p.id === property_id);

      if (
        !property ||
        !state[player] ||
        !state[player]?.propertiesOwned[property?.property_group_color]?.[
          property_id
        ]
      ) {
        return;
      }

      const propertyCurrentHouses =
        state[player]?.propertiesOwned[property.property_group_color]?.[
          property_id
        ]?.houses ?? 0;

      if (propertyCurrentHouses + nHouse > 5) {
        return;
      }

      const propertyGroup = gameSettings?.PropertyGroups.find(
        p => p.color === property.property_group_color
      );

      if (!propertyGroup) {
        return;
      }

      const isBuyingHotel = nHouse + propertyCurrentHouses === 5;

      const price = isBuyingHotel
        ? propertyGroup.hotel_cost ?? 0
        : propertyGroup.house_cost ?? 0;

      if ((state[player]?.money ?? 0) < price) {
        toast({
          status: 'error',
          title: `
          💸 ${TOKENS_MAP[player]} does not have enough money to buy a ${
            isBuyingHotel ? 'hotel' : `${nHouse} house${nHouse > 1 ? 's' : ''}`
          }`,
        });
        return;
      }

      const newState: PlayerState = {
        ...state,
        [player]: {
          ...state[player],
          money: (state[player]?.money ?? 0) - price,
          propertiesOwned: {
            ...state[player]?.propertiesOwned,
            [property.property_group_color]: {
              ...state[player]?.propertiesOwned[property.property_group_color],
              [property_id]: {
                ...state[player]?.propertiesOwned[
                  property.property_group_color
                ]?.[property_id],
                houses:
                  (state[player]?.propertiesOwned[
                    property?.property_group_color
                  ]?.[property_id]?.houses ?? 0) + nHouse,
              },
            },
          },
        },
      };

      setState(newState);

      toast({
        title: `
        💸 ${TOKENS_MAP[player]} bought ${
          isBuyingHotel ? 'a hotel' : `${nHouse} house${nHouse > 1 ? 's' : ''}`
        } for ${formatPrice(price)}`,
      });
    },
    [gameSettings, state]
  );

  const calculateRent = useCallback(
    (propertyId: string) => {
      const owner = isOwned(propertyId);

      if (!owner) return 0;

      const { token, ownerState } = owner;

      const propertiesOwned = ownerState?.propertiesOwned;

      const property = gameSettings?.Properties.find(p => p.id === propertyId);

      if (!property) return 0;

      const mortgaged = isMortgaged(propertyId);

      if (mortgaged) return 0;

      const propertiesInGroup = gameSettings?.Properties.filter(
        p => p.property_group_color === property?.property_group_color
      );

      const numPropertiesInGroup = propertiesInGroup?.length ?? 0;

      const numOwnedInGroup = Object.keys(
        propertiesOwned?.[property?.property_group_color] ?? {}
      ).length;

      const propertyState =
        propertiesOwned?.[property?.property_group_color]?.[propertyId];

      if (!property) return 0;

      if (property.property_group_color === 'STATION') {
        return calculateStationRent(numOwnedInGroup);
      } else if (property.property_group_color === 'UTILITIES') {
        const diceRoll = state[token]?.lastRoll ?? 0;

        return calculateUtilityRent(numOwnedInGroup, diceRoll);
      }

      const numHouses = propertyState?.houses ?? 0;
      return calculatePropertyRent(
        property,
        numHouses,
        numOwnedInGroup === numPropertiesInGroup
      );
    },
    [gameSettings?.Properties, state, isOwned, isMortgaged]
  );

  const move = useCallback(
    (player: TokenType, moveBy: number, passGo: boolean = true) => {
      if (!gameSettings) return;

      if (state[player]?.inJail) return;
      // Based on what the player lands on, we want to open an action modal
      const newPostion = state[player]?.pos ?? 0;

      const sortedSpaces = gameSettings.BoardSpaces.sort(
        (a, b) => b.board_position - a.board_position
      );

      const lastSpace = sortedSpaces[0];

      const firstSpace = sortedSpaces[sortedSpaces.length - 1];

      let newPos = newPostion + moveBy;
      if (newPos >= lastSpace.board_position + 1) {
        newPos =
          newPostion +
          moveBy -
          lastSpace.board_position +
          firstSpace.board_position -
          1;
        // Player has passed go
        setState({
          ...state,
          [player]: {
            ...state[player],
            money: (state[player]?.money ?? 0) + (passGo ? 200 : 0),
          },
        });

        if (passGo) {
          toast({
            title: `${TOKENS_MAP[player]} passed Go and collected £200`,
          });
        }
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

      if (nextBoardSpace?.space_type === 'PROPERTY') {
        const property = gameSettings?.Properties.find(
          p => p.id === nextBoardSpace?.property_id
        );
        toast({
          title: `
          💸 ${TOKENS_MAP[player]} landed on ${property?.name}`,
        });
      } else {
        toast({
          title: `
           ${TOKENS_MAP[player]} landed on ${nextBoardSpace?.space_type}`,
        });
      }

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
          if (
            owner &&
            owner.token !== player &&
            state[owner.token] &&
            !state[owner.token]?.inJail &&
            !state[owner.token]?.isBankrupt
          ) {
            // If the property is owned, show the rent modal, otherwise show the buy modal
            showActionModal('PAY_RENT');
          } else if (!owner) {
            // If the property is not owned, show the buy modal
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
      toast({
        description: card?.description,
        title: `
        🎉 - ${
          TOKENS_MAP[currentPlayerToken ?? 'smartphone']
        } took a ${type} card`,
      });
      if (!card) return null;
      setGameSettings(
        gameSettings
          ? {
              ...gameSettings,
              CardActions: [
                ...gameSettings.CardActions.filter(c => c.id !== card.id),
                card,
              ],
            }
          : null
      );
      return card;
    },
    [gameSettings, currentPlayerToken]
  );

  // Nothing stopping you from calling this function with a negative number in order
  // to earn money instead of paying money to the bank.
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

      toast({
        title: `
        💸 ${TOKENS_MAP[player]} bought ${property.name} for ${formatPrice(
          property.price ?? 0
        )}`,
        status: 'success',
      });

      setState({
        ...state,
        [player]: {
          ...playerState,
          money: newMoney,
          propertiesOwned: {
            ...playerState.propertiesOwned,
            [property.property_group_color]: {
              ...playerState.propertiesOwned[property.property_group_color],
              [property.id]: {
                houses: 0,
                mortgaged: false,
              },
            },
          },
        },
      });
    },
    [state, gameSettings]
  );

  const showBuyHouseAction = useCallback(
    (property_id: string) => {
      const property = gameSettings?.Properties.find(p => p.id === property_id);
      if (!property) return;
      setPropertyToBuyHouseOn(property);
      showActionModal('BUY_HOUSE');
    },
    [gameSettings]
  );

  const hideBuyHouseAction = useCallback(() => {
    setPropertyToBuyHouseOn(null);
    hideActionModal();
  }, []);

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
      toast({
        title: `
        🚫 ${TOKENS_MAP[player]} was sent to jail`,
        status: 'warning',
      });
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

    let nextIsBankrupt = true;

    let _currentPlayer: Player | undefined;
    let checker = 0;

    while (nextIsBankrupt && checker < players.length) {
      const nextPlayerIndex =
        players.findIndex(p => p.token === currentPlayerToken) + 1;

      if (nextPlayerIndex >= players.length) {
        _currentPlayer = players[0];
      } else {
        _currentPlayer = players[nextPlayerIndex];
      }

      checker++;
      nextIsBankrupt = state[_currentPlayer.token]?.isBankrupt ?? false;
    }

    if (_currentPlayer) {
      setCurrentPlayer(_currentPlayer.token);

      // Begin next players turn
      // Check first if they are in jail.
      if (state[_currentPlayer.token]?.inJail) {
        showActionModal('GET_OUT_OF_JAIL');
        return;
      }

      toast({
        title: `
      🎉 ${TOKENS_MAP[_currentPlayer.token]} ${_currentPlayer.name}'s turn`,
      });

      showActionModal('ROLL');
    }
  }, [players, currentPlayerToken]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (!isPaused && hasStarted) {
        setTime(time => time + 1);
      }
    }, 1000);
    return () => {
      clearInterval(timer);
    };
  }, [hasStarted, isPaused]);

  const pause = () => setIsPaused(true);
  const resume = () => setIsPaused(false);

  const addPlayer = (player: Player) => {
    setPlayers([...players, player]);
  };

  const removePlayer = useCallback(
    (playerToken: TokenType) => {
      setPlayers(players.filter(player => player.token !== playerToken));
    },
    [players]
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
    setIsPaused(false);

    toast({
      title: `
      🎉 Game has started!`,
      status: 'success',
    });

    // Initialize board state
    setState(
      players.reduce(
        (acc, player) => ({
          ...acc,
          [player.token]: {
            pos: 0,
            propertiesOwned: {},
            money: gameSettings?.starting_money ?? 0,
            isBankrupt: false,
          },
        }),
        {}
      )
    );

    // Begin the first turn
    setCurrentPlayer(players[0].token);
    showActionModal('ROLL');
  }, [players, setHasStarted, gameSettings?.starting_money]);

  // Mortgage a property
  // Morgage value is the property's price divided by 2
  const mortgage = useCallback(
    (player: TokenType, property_id: string) => {
      const property = gameSettings?.Properties.find(p => p.id === property_id);
      if (!property) return;

      const playerState = state[player];
      if (!playerState) return;

      const propertyState =
        playerState.propertiesOwned[property.property_group_color]?.[
          property.id
        ];

      const nHouses = propertyState?.houses ?? 0;
      const group = gameSettings?.PropertyGroups.find(
        pg => pg.color === property.property_group_color
      );

      const { value, type } = calculateMortgageValue(
        property.price ?? 0,
        nHouses,
        group?.hotel_cost ?? undefined,
        group?.house_cost ?? undefined
      );

      if (!property) return;

      const newMoney = playerState.money + value;

      setState({
        ...state,
        [player]: {
          ...playerState,
          money: newMoney,
          propertiesOwned: {
            ...playerState.propertiesOwned,
            [property.property_group_color]: {
              ...playerState.propertiesOwned[property.property_group_color],
              [property_id]: {
                ...propertyState,
                houses: nHouses > 0 ? nHouses - 1 : 0,
                mortgaged: nHouses >= 1 ? false : true,
              },
            },
          },
        },
      });

      toast({
        title: `
        🏠 ${TOKENS_MAP[player]} ${
          type === 'mortgage'
            ? 'mortgaged'
            : type === 'sell_house'
            ? 'sold a house'
            : 'sold a hotel'
        } ${property.name} for ${formatPrice(value)}`,
        status: 'success',
      });
    },
    [state, gameSettings?.Properties]
  );

  // Unmortgage a property
  // Unmortgage value is the property's price divided by 2
  const unmortgage = useCallback(
    (player: TokenType, property_id: string) => {
      const property = gameSettings?.Properties.find(p => p.id === property_id);
      if (!property) return;

      const playerState = state[player];

      const propertyState =
        playerState?.propertiesOwned[property.property_group_color]?.[
          property.id
        ];

      if (!playerState) return;

      if (!property) return;

      const value =
        calculateMortgageValue(property?.price ?? 0, 0, undefined, undefined)
          .value ?? 0;

      const newMoney = playerState.money - value;

      if (newMoney < 0) return;

      setState({
        ...state,
        [player]: {
          ...playerState,
          money: newMoney,
          propertiesOwned: {
            ...playerState.propertiesOwned,
            [property.property_group_color]: {
              ...playerState.propertiesOwned[property.property_group_color],
              [property_id]: {
                ...propertyState,
                houses: 0,
                mortgaged: false,
              },
            },
          },
        },
      });

      toast({
        title: `
        🏠 ${TOKENS_MAP[player]} unmortgaged ${property.name} for ${formatPrice(
          value
        )}`,
        status: 'info',
      });
    },
    [gameSettings, state, setState]
  );

  // Deals with showing the action modal
  const showActionModal = useCallback(
    (action: ActionType) => {
      setTimeout(() => {
        setCurrentAction(action);
      }, 200);
    },
    [setCurrentAction]
  );

  // Deals with hiding the action modal
  const hideActionModal = () => {
    setCurrentAction(null);
  };

  const canEndTurn = useMemo(() => currentAction === null, [currentAction]);

  return (
    <GameContext.Provider
      value={{
        gameSettings,
        showActionModal,
        canEndTurn,
        landedOnFreeParking,
        addToFreeParking,
        buy,
        players,
        state,
        buyHouse,
        mortgage,
        unmortgage,
        goto,
        currentPlayer,
        freeFromJail,
        rollDice,
        hasStarted,
        handleStartGame,
        move,
        failedToGetOutOfJail,
        time,
        hideActionModal,
        endTurn,
        bankrupt,
        couldPay,
        isMortgaged,
        showBuyHouseAction,
        hideBuyHouseAction,
        calculateRent,
        addPlayer,
        removePlayer,
        payBank,
        totalOnFreeParking,
        propertyToBuyHouseOn,
        sendToJail,
        isOwned,
        payPlayer,
        resetGame,
        isPaused,
        pause,
        resume,
        takeCard,
      }}
    >
      {/* <Flex> */}
      {hasStarted ? (
        <Flex>
          {children}
          <ActionSidebar action={currentAction} />
          <GamePausedGuard />
        </Flex>
      ) : (
        children
      )}
      {/* </Flex> */}
    </GameContext.Provider>
  );
};
