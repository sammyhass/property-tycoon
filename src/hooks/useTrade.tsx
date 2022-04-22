import { createContext, useCallback, useContext, useState } from 'react';
import { TokenType, useGameContext } from './useGameContext';

export type TradeContextT = {
  // The player the current player is trading with
  tradingWithPlayer: TokenType | undefined;

  // Properties the current player is trading
  propertiesToTrade: string[];
  addPropertyToTrade: (property: string) => void;
  removePropertyToTrade: (property: string) => void;

  // Properties the current player is to receive from the trading player
  propertiesToReceive: string[];
  addPropertyToReceive: (property: string) => void;
  removePropertyToReceive: (property: string) => void;

  // Money the current player is to give to the trading player (negative if money is being earned by current player)
  moneyToTrade: number;
  setMoneyToTrade: (money: number) => void;

  setPlayerToTradeWith: (token: TokenType | undefined) => void;
  initializeTrade: (token?: TokenType) => void;
  cancelTrade: () => void;
  performTrade: () => void;
  currentPlayerIsGivingMoney: boolean;
  setCurrentPlayerIsGivingMoney: (isGivingMoney: boolean) => void;
};

const TradeContext = createContext<TradeContextT>({
  cancelTrade: () => {},
  initializeTrade: () => {},
  addPropertyToReceive: () => {},
  addPropertyToTrade: () => {},
  removePropertyToReceive: () => {},
  removePropertyToTrade: () => {},
  setPlayerToTradeWith: () => {},
  moneyToTrade: 0,
  setMoneyToTrade: () => {},
  performTrade: () => {},
  propertiesToReceive: [],
  propertiesToTrade: [],
  tradingWithPlayer: undefined,
  currentPlayerIsGivingMoney: false,
  setCurrentPlayerIsGivingMoney: () => {},
});

export const useTrade = () => useContext(TradeContext);

export const TradeProvider = ({ children }: { children: React.ReactNode }) => {
  const { showActionModal, hideActionModal, payPlayer, trade, currentPlayer } =
    useGameContext();

  const [currentPlayerIsGivingMoney, setCurrentPlayerIsGivingMoney] =
    useState(true);

  const [tradingWithPlayer, setPlayerToTradeWith] = useState<
    TokenType | undefined
  >();
  const [propertiesToTrade, setPropertiesToTrade] = useState<string[]>([]);
  const [propertiesToReceive, setPropertiesToReceive] = useState<string[]>([]);
  const [moneyToTrade, setMoneyToTrade] = useState<number>(0);

  const initializeTrade = (token?: TokenType) => {
    setPlayerToTradeWith(token);
    setPropertiesToTrade([]);
    setPropertiesToReceive([]);
    setMoneyToTrade(0);
    showActionModal('TRADE');
  };

  const cancelTrade = () => {
    setPlayerToTradeWith(undefined);
    setPropertiesToTrade([]);
    setPropertiesToReceive([]);
    setMoneyToTrade(0);
    setCurrentPlayerIsGivingMoney(true);
    hideActionModal();
  };

  const addPropertyToTrade = (property: string) => {
    if (!propertiesToTrade.includes(property)) {
      setPropertiesToTrade([...propertiesToTrade, property]);
    }
  };

  const removePropertyToTrade = (property: string) => {
    setPropertiesToTrade(propertiesToTrade.filter(p => p !== property));
  };

  const addPropertyToReceive = (property: string) => {
    if (!propertiesToReceive.includes(property)) {
      setPropertiesToReceive([...propertiesToReceive, property]);
    }
  };

  const removePropertyToReceive = (property: string) => {
    setPropertiesToReceive(propertiesToReceive.filter(p => p !== property));
  };

  const performTrade = useCallback(() => {
    // moneyToTrade should be positive if the current player is giving money to the trading player
    // moneyToTrade should be negative if the current player is receiving money from the trading player

    if (!(currentPlayer?.token && tradingWithPlayer)) return;
    trade({
      currentPlayerIsGivingMoney,
      moneyToTrade,
      propertiesToReceive,
      propertiesToTrade,
      tradingWithPlayer,
    });

    cancelTrade();
  }, [
    propertiesToReceive,
    propertiesToTrade,
    moneyToTrade,
    tradingWithPlayer,
    currentPlayerIsGivingMoney,
    currentPlayer,
  ]);

  return (
    <TradeContext.Provider
      value={{
        tradingWithPlayer,
        propertiesToTrade,
        propertiesToReceive,
        currentPlayerIsGivingMoney,
        setCurrentPlayerIsGivingMoney,
        addPropertyToReceive,
        addPropertyToTrade,
        removePropertyToReceive,
        removePropertyToTrade,
        setMoneyToTrade,
        moneyToTrade,
        setPlayerToTradeWith,
        initializeTrade,
        cancelTrade,
        performTrade,
      }}
    >
      {children}
    </TradeContext.Provider>
  );
};
