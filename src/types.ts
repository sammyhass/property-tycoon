// Different types of tokens each player can use
export type TokenType =
  | 'boot'
  | 'smartphone'
  | 'ship'
  | 'hatstand'
  | 'cat'
  | 'iron';
export type GameBoardSpaceType =
  | 'property'
  | 'pot_luck'
  | 'opportunity_knocks'
  | 'free_parking'
  | 'go_to_jail'
  | 'just_visting';

export type GamePlayer = {
  id: string;
  name: string;
  token: TokenType;
  boardPosition: number;
  propertiesOwned: Property[];
  cash: number;
};

export type GameBoardSpace<T extends GameBoardSpaceType> = {
  id: string;
  name: string;
  type: T;
  instructions: string;
  action?: () => void;
  property?: Property;
};

export type Property = {
  name: string;
  price: number;
  rent: number;

  houses: number;
  hotels: number;
  ownedBy: string | undefined;
};

export type PropertySpace = GameBoardSpace<'property'>;

export type GameState = {
  // turnId is the id of the player whos turn it is
  turnId: string;

  // player id to Game Board Space id
  playerPositions: {
    [playerId: string]: string;
  };

  // properties owned by each player
  playerProperties: {
    [playerId: string]: Property[];
  };
};
