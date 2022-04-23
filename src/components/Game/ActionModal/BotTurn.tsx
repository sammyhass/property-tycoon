import { TOKENS_MAP, useGameContext } from '@/hooks/useGameContext';
import { usePlayer } from '@/hooks/usePlayer';
import { formatPrice } from '@/util/formatPrice';
import {
  Alert,
  AlertDescription,
  Box,
  Button,
  chakra,
  Heading,
  ListItem,
  UnorderedList,
} from '@chakra-ui/react';
import { faCheck, faDice } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { BoardSpace, CardAction, CardType } from '@prisma/client';
import { useCallback, useEffect, useState } from 'react';

export type BotPreference =
  | 'GET_STATIONS'
  | 'GET_EXPENSIVE_SET'
  | 'GET_UTILITIES'
  | 'GET_CHEAP_SET'
  | 'MAX_MONEY_ALWAYS';

export default function BotTurn() {
  const {
    currentPlayer,
    payBank,
    rollDice,
    move,
    sendToJail,
    gameSettings,
    calculateRent,
    endTurn,
    landedOnFreeParking,
    payToFreeParking,
    totalOnFreeParking,
    couldPay,
    takeCard,
    performCardAction,
    bankrupt,
    payPlayer,
    isOwned,
    buy,
  } = useGameContext();

  // The property (if any) the bot is currently on.

  const [updates, setUpdates] = useState<(React.ReactNode | string)[]>([]);

  const [isTakingTurn, setIsTakingTurn] = useState(false);
  const [hasCompletedTurn, setHasCompletedTurn] = useState(false);
  const [hasMoved, setHasMoved] = useState(false);

  const { pos, name, getCurrentBoardSpace, getOwnedProperties } = usePlayer(
    currentPlayer?.token ?? undefined
  );

  useEffect(() => {
    setUpdates([]);
    setHasMoved(false);
    setIsTakingTurn(false);
    setHasCompletedTurn(false);
  }, [currentPlayer?.name]);

  const onLandOnGo = useCallback(() => {
    if (currentPlayer?.token) {
      payBank(currentPlayer.token, -200);
      setUpdates(updates => [
        ...updates,
        <>
          Earned <chakra.span color="green">{formatPrice(200)}</chakra.span> for
          landing on Go
        </>,
      ]);
    }
  }, [currentPlayer?.token, payBank]);

  const onLandOnProperty = useCallback(
    (propertyId: string) => {
      if (!currentPlayer?.token) return;
      const owner = isOwned(propertyId);

      const property = gameSettings?.Properties.find(
        gameProperty => gameProperty.id === propertyId
      );

      setUpdates(updates => [
        ...updates,
        <>
          Landed on <b>{property?.name}</b>
        </>,
      ]);

      // check to see if bot can purchase property
      if (!owner) {
        const canBuy = couldPay(currentPlayer?.token, property?.price ?? 0);

        if (canBuy && Math.random() > 0.3) {
          buy(currentPlayer.token, propertyId);
          setUpdates(updates => [
            ...updates,
            <>
              💸 Bought <b>{property?.name}</b> for{' '}
              <chakra.span color="green">
                {formatPrice(property?.price ?? 0)}
              </chakra.span>
            </>,
          ]);
        } else {
          setUpdates(updates => [
            ...updates,
            `${canBuy ? 'Chose not to buy' : 'Could not buy'} ${
              property?.name
            } for ${formatPrice(property?.price ?? 0)}`,
          ]);
        }
      } else if (owner?.token !== currentPlayer.token) {
        // Pay rent
        const rent = calculateRent(propertyId);

        if (couldPay(currentPlayer?.token, rent)) {
          payPlayer(currentPlayer.token, owner.token, rent);

          setUpdates(updates => [
            ...updates,
            <>
              Paid{' '}
              <chakra.span color="red.500">{formatPrice(rent)}</chakra.span> to
              {TOKENS_MAP[owner.token]} for landing on {property?.name}
            </>,
          ]);
        } else {
          setUpdates(updates => [
            ...updates,
            `Could not pay rent for ${property?.name}`,
            `💀 ${name} is bankrupt!`,
          ]);
          bankrupt(currentPlayer.token);
        }
      } else {
        setUpdates(updates => [
          ...updates,
          `${name} landed on ${property?.name}, but is already the owner`,
        ]);
      }
    },
    [
      couldPay,
      gameSettings,
      currentPlayer?.token,
      isOwned,
      name,
      bankrupt,
      calculateRent,
      buy,
      payPlayer,
    ]
  );

  const onLandOnFreeParking = useCallback(() => {
    if (!currentPlayer?.token) return;
    const fpTotal = totalOnFreeParking;
    landedOnFreeParking(currentPlayer?.token);
    setUpdates(updates => [
      ...updates,
      <>
        Landed on <b>Free Parking</b> and collected{' '}
        <b>{formatPrice(fpTotal)}</b>
      </>,
    ]);
  }, [currentPlayer?.token, landedOnFreeParking]);

  const onLandOnGoToJail = useCallback(() => {
    if (!currentPlayer?.token) return;
    sendToJail(currentPlayer?.token);
  }, [currentPlayer?.token, sendToJail]);

  const onLandOnTakeCard = useCallback(
    (cardType: CardType) => {
      if (!currentPlayer?.token) return;
      let card: CardAction | null = null;
      setTimeout(() => {
        card = takeCard(cardType);
        setUpdates(updates => [
          ...updates,
          <>
            {name} took a {cardType} card - {card?.description}
          </>,
        ]);
        if (!card) return;
        performCardAction(currentPlayer?.token, card);
      }, 1000);
    },
    [currentPlayer?.token, name, takeCard, performCardAction]
  );

  const onLandOnTax = useCallback(
    (taxCost: number) => {
      if (!currentPlayer?.token) return;
      payToFreeParking(currentPlayer?.token, taxCost);
      setUpdates([
        ...updates,
        `${name} paid ${formatPrice(
          taxCost
        )} to free parking for landing on tax`,
      ]);
    },
    [payToFreeParking, currentPlayer]
  );

  const onLandedOnSpace = (space: BoardSpace) => {
    if (!currentPlayer) return;

    switch (space?.space_type) {
      case 'GO':
        onLandOnGo();
        break;
      case 'FREE_PARKING':
        onLandOnFreeParking();
        break;
      case 'GO_TO_JAIL':
        onLandOnGoToJail();
        break;
      case 'PROPERTY':
        if (!space.property_id) break;
        onLandOnProperty(space.property_id);
        break;
      case 'TAX':
        onLandOnTax(space.tax_cost ?? 0);
        break;
      case 'TAKE_CARD':
        if (!space.take_card) break;
        onLandOnTakeCard(space.take_card);
        break;
      case 'JUST_VISIT':
        setUpdates(updates => [...updates, `${name} landed on Just Visit`]);
        break;
      default:
        setHasCompletedTurn(true);
        setIsTakingTurn(false);
        break;
    }
    setTimeout(() => {
      setIsTakingTurn(false);
      setHasCompletedTurn(true);
    }, 1000);
  };

  useEffect(() => {
    if (!hasMoved) return;
    const space = getCurrentBoardSpace();
    if (space) {
      onLandedOnSpace(space);
    }
  }, [pos]);

  const performTurn = useCallback(() => {
    setIsTakingTurn(true);
    setHasCompletedTurn(false);
    if (!currentPlayer) return;

    const [dice1, dice2] = rollDice();
    setUpdates([`🎲 ${name} rolled ${dice1} and ${dice2}`]);
    if (!currentPlayer) return;
    const space = move(currentPlayer?.token, dice1 + dice2, true);
    setHasMoved(true);

    return space;
  }, [currentPlayer, rollDice, name, move, onLandedOnSpace]);

  return (
    <Box>
      <Heading size="md">
        {currentPlayer?.name}{' '}
        {!hasCompletedTurn ? 'is taking their turn...' : 'has taken their turn'}
      </Heading>
      {!isTakingTurn && !hasCompletedTurn && (
        <Alert size="sm" my="5px" borderRadius={'8px'}>
          <AlertDescription>
            Click below to simulate {name}&apos;s turn
          </AlertDescription>
        </Alert>
      )}
      <Button
        size="lg"
        w="100%"
        my="10px"
        onClick={hasCompletedTurn ? endTurn : performTurn}
        colorScheme={hasCompletedTurn ? 'green' : 'blue'}
        isLoading={isTakingTurn}
        leftIcon={
          <FontAwesomeIcon icon={hasCompletedTurn ? faCheck : faDice} />
        }
      >
        {hasCompletedTurn ? 'End Turn' : 'Simulate Turn'}
      </Button>
      <Box mt="10px">
        <UnorderedList spacing={3} fontSize="md">
          {updates.map((update, index) => (
            <ListItem
              layoutId={`${currentPlayer?.name}-update-${index}`}
              key={`${update}-${index}`}
            >
              {update}
            </ListItem>
          ))}
        </UnorderedList>
      </Box>
    </Box>
  );
}
