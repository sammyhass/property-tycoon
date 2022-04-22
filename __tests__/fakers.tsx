import {
  GameContext,
  GameContextT,
  Player,
  PlayerState,
  TOKENS_MAP,
  TokenType,
} from '@/hooks/useGameContext';
import { BoardSpace, CardAction, GameProperty } from '@prisma/client';
import { render } from '@testing-library/react';

// Mocks for game context so we can test the board space component.

export const fakeProperty = (params?: Partial<GameProperty>): GameProperty => ({
  game_id: '1',
  id: '1',
  name: 'Tia Square',
  price: 400,
  property_group_color: 'DEEP_BLUE',
  rent_four_house: 0,
  rent_hotel: 0,
  rent_one_house: 0,
  rent_three_house: 0,
  rent_two_house: 0,
  rent_unimproved: 0,
  ...params,
});

export const fakeBoardSpace = (params?: Partial<BoardSpace>): BoardSpace => ({
  board_position: 1,
  created_at: new Date(),
  game_id: '1',
  locked: false,
  property_id: null,
  space_type: 'EMPTY',
  take_card: null,
  tax_cost: null,
  ...params,
});

export const fakePlayer = (tokenType?: TokenType): Player => {
  if (tokenType)
    return {
      name: 'Player 1',
      token: tokenType,
    };

  const tokens = Object.keys(TOKENS_MAP);
  const token = tokens[Math.floor(Math.random() * tokens.length)];
  return {
    token: token as TokenType,
    name: `Player ${token}`,
  };
};

export const fakeCard = (params?: Partial<CardAction>): CardAction => ({
  action_type: 'EARN_FROM_BANK',
  cost: 0,
  created_at: new Date(),
  description: 'Earn $200 from the bank',
  game_id: '1',
  id: '1',
  property_id: null,
  type: 'OPPORTUNITY_KNOCKS',
  ...params,
});

export const MockGameContextProvider = ({
  params,
  children,
}: {
  params?: Partial<GameContextT>;
  children: React.ReactNode;
}) => {
  return (
    <GameContext.Provider
      value={{
        addPlayer: jest.fn(),
        totalOnFreeParking: 0,
        bankrupt: jest.fn(),
        buyHouse: jest.fn(),
        couldPay: jest.fn().mockReturnValue(true),
        hideBuyHouseAction: jest.fn(),
        isMortgaged: jest.fn().mockReturnValue(false),
        mortgage: jest.fn(),
        pause: jest.fn(),
        payToFreeParking: jest.fn(),
        pickUpGetOutOfJailFreeCard: jest.fn(),
        propertyToBuyHouseOn: null,
        resume: jest.fn(),
        useGetOutOfJailFreeCard: jest.fn(),
        giveOwnedProperty: jest.fn(),
        showBuyHouseAction: jest.fn(),
        unmortgage: jest.fn(),
        buy: jest.fn(),
        currentPlayer: {
          name: 'Player 1',
          token: 'cat',
        },
        calculateRent: jest.fn(),
        canEndTurn: true,
        failedToGetOutOfJail: jest.fn(),
        freeFromJail: jest.fn(),
        rollDice: jest.fn().mockImplementation(() => [1, 5]),
        endTurn: jest.fn(),
        goto: jest.fn(),
        gameSettings: fakeGameSettings(),
        handleStartGame: jest.fn(),
        hasStarted: true,
        takeCard: jest.fn(),
        time: 1000,
        hideActionModal: jest.fn(),
        isOwned: jest.fn(),
        isPaused: false,
        landedOnFreeParking: jest.fn(),
        move: jest.fn(),
        payBank: jest.fn(),
        payPlayer: jest.fn(),
        players: [fakePlayer('cat'), fakePlayer('boot')],
        removePlayer: jest.fn(),
        resetGame: jest.fn(),
        sendToJail: jest.fn(),
        showActionModal: jest.fn(),
        state: {
          cat: fakePlayerState(),
          boot: fakePlayerState(),
        },
        ...params,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const fakePlayerState = (
  params?: Partial<PlayerState[TokenType]>
): PlayerState[TokenType] => ({
  inJail: false,
  money: 5000,
  lastRoll: 6,
  turnsInJail: 0,
  propertiesOwned: {},
  pos: 0,
  hasGetOutOfJailFreeCard: false,
  isBankrupt: false,
  ...params,
});

export const fakeGameSettings = (
  params?: Partial<GameContextT['gameSettings']>
): GameContextT['gameSettings'] => ({
  BoardSpaces: [
    fakeBoardSpace({ space_type: 'GO', board_position: 0 }),
    fakeBoardSpace({
      space_type: 'PROPERTY',
      property_id: '1',
      board_position: 1,
    }),
    fakeBoardSpace({
      space_type: 'TAX',
      board_position: 2,
      tax_cost: 200,
    }),
    fakeBoardSpace({
      space_type: 'GO_TO_JAIL',
      board_position: 3,
    }),
    fakeBoardSpace({
      space_type: 'FREE_PARKING',
      board_position: 4,
    }),
  ],
  starting_money: 5000,
  Properties: [
    fakeProperty({
      id: '1',
      property_group_color: 'BLUE',
      name: 'Property 1',
      price: 100,
      rent_one_house: 100,
      rent_two_house: 200,
      rent_three_house: 300,
      rent_four_house: 400,
      rent_hotel: 500,
    }),
  ],
  CardActions: [],
  PropertyGroups: [
    {
      color: 'BLUE',
      hotel_cost: 100,
      house_cost: 100,
      game_id: '0',
      created_at: new Date(),
    },
  ],
  active: true,
  created_at: new Date(),
  id: '0',
  name: 'Game 1',
  share_code: '0',
  user_id: '0',
  ...params,
});

export const renderWithGameContext = (
  ui: React.ReactElement,
  params?: Partial<GameContextT>
) =>
  render(
    <MockGameContextProvider params={params}>{ui}</MockGameContextProvider>
  );
