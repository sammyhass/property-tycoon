import { useGameContext } from '@/hooks/useGameContext';
import {
  calculateStationRent,
  calculateUtilityMulitplier,
} from '@/util/calculate-rent';
import { formatPrice } from '@/util/formatPrice';
import {
  Alert,
  AlertDescription,
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Radio,
  RadioGroup,
  Stack,
  Text,
} from '@chakra-ui/react';
import { CardAction, CardType } from '@prisma/client';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ActionModalProps } from '.';
import GameCard from '../Board/cards/Card';
import BoardSpace from '../Board/spaces';

// Action Modal Content Components

export const ActionModalGetOutJail = ({ action }: ActionModalProps) => {
  const {
    currentPlayer,
    rollDice,
    payBank,
    state,
    hideActionModal,
    move,
    freeFromJail,
    failedToGetOutOfJail,
  } = useGameContext();

  if (!currentPlayer) return <></>;

  const [choice, setChoice] = useState<'roll' | 'pay'>('roll');

  const [roll, setRoll] = useState<[number, number] | null>(null);

  const [didRoll, setDidRoll] = useState(false);
  const [didPay, setDidPay] = useState(false);

  const handleContinue = useCallback(() => {
    if (didPay || (roll && roll[0] === roll[1])) {
      freeFromJail(currentPlayer.token);
      if (roll && roll[0] === roll[1]) {
        move(currentPlayer.token, roll[0] + roll[1]);
      }
    } else {
      failedToGetOutOfJail(currentPlayer.token);
    }
    hideActionModal();
  }, [currentPlayer, hideActionModal, move, roll, didPay, freeFromJail]);

  const handleDiceRoll = useCallback(() => {
    const [roll1, roll2] = rollDice();
    setRoll([roll1, roll2]);
    setDidRoll(true);
  }, [rollDice]);

  const handlePayToGetOut = useCallback(() => {
    payBank(currentPlayer?.token, 50);
    setDidPay(true);
  }, [currentPlayer, payBank]);

  return (
    <Flex direction={'column'} gap="5px">
      <Heading size="md" py="10px">
        You're in Jail!
      </Heading>

      {!(didRoll || didPay) && (
        <FormControl mb="20px">
          <FormLabel>
            <Text fontSize="sm">
              Try to get out of jail by rolling doubles (
              {3 - (state[currentPlayer.token]?.turnsInJail ?? 0)} tries left)
              or paying the fine of $50.
            </Text>
          </FormLabel>
          <RadioGroup
            value={choice}
            onChange={v =>
              v === 'roll' ? setChoice(v) : v === 'pay' ? setChoice(v) : null
            }
            defaultValue="roll"
          >
            <Stack direction="column" spacing="5px">
              <Radio value="roll">
                <Text>🎲 Roll Dice</Text>
              </Radio>
              <Radio value="pay">
                <Text>💸 Pay $50 to get out</Text>
              </Radio>
            </Stack>
          </RadioGroup>
        </FormControl>
      )}

      {choice === 'roll' ? (
        <Box>
          <Heading size="sm">
            Try to get out of jail by rolling doubles (
            {3 - (state[currentPlayer.token]?.turnsInJail ?? 0)} tries left)
          </Heading>
          <Box p="10px" bg="#eee" borderRadius={'8px'}>
            <Heading textAlign={'center'}>🎲 🎲</Heading>
            {roll ? (
              <Box>
                <Text textAlign={'center'}>You Rolled</Text>
                <Stack
                  direction="row"
                  spacing={'5px'}
                  justify="center"
                  fontSize={'lg'}
                >
                  <Text fontWeight={'bold'}>{roll[0]}</Text>
                  <Text>and</Text>
                  <Text fontWeight={'bold'}>{roll[1]}</Text>
                </Stack>
                {roll[0] === roll[1] && (
                  <Alert status="success">
                    <AlertDescription>
                      You rolled doubles! You can get out of jail!
                    </AlertDescription>
                  </Alert>
                )}
              </Box>
            ) : (
              <Button onClick={handleDiceRoll} w="100%" colorScheme={'red'}>
                Roll Dice
              </Button>
            )}
          </Box>
        </Box>
      ) : (
        <Box>
          <Heading size="sm">Pay £50 to get out of jail now?</Heading>
          <Button
            colorScheme={'purple'}
            onClick={handlePayToGetOut}
            w="100%"
            isDisabled={
              !currentPlayer || (state[currentPlayer.token]?.money ?? 0) < 50
            }
          >
            Pay £50 to get out
          </Button>
        </Box>
      )}
      {(didRoll || didPay) && (
        <Button onClick={handleContinue}>
          {roll
            ? roll[0] === roll[1] || didPay
              ? 'Get out Now'
              : 'Roll again next turn.'
            : 'Ok'}
        </Button>
      )}
    </Flex>
  );
};

// Content for our action modal when a player is rolling the dice.
export const ActionModalRoll = () => {
  const { currentPlayer, move, rollDice } = useGameContext();

  const [isRolling, setIsRolling] = useState(false);
  const [isMoving, setIsMoving] = useState(false);

  const [diceRoll, setDiceRoll] = useState<[number, number] | null>(null);

  const handleMove = useCallback(() => {
    if (!currentPlayer) return;
    setIsMoving(true);
    setTimeout(() => {
      move(currentPlayer.token, diceRoll![0] + diceRoll![1]);
      setIsMoving(false);
    }, 500);
  }, [currentPlayer, diceRoll, move]);

  // Roll the dice.
  const handleRoll = useCallback(() => {
    setIsRolling(true);

    if (!currentPlayer) return;
    // Choose a random number between 1 and 12
    setTimeout(() => {
      const [dice1, dice2] = rollDice();
      setDiceRoll([dice1, dice2]);
      setIsRolling(false);
    }, 500);
  }, [currentPlayer, rollDice]);

  return (
    <Flex direction={'column'} justify={'center'} align="center">
      <Heading size="4xl">🎲 🎲</Heading>
      {isRolling && <Heading size="md">Rolling...</Heading>}
      {diceRoll && (
        <Stack spacing={4} justify="center" align={'center'}>
          <Text>You rolled:</Text>
          <Flex justify={'center'} gap="10px" align="center">
            <Heading size="md">{diceRoll[0]}</Heading>
            <Text>{` and `}</Text>
            <Heading size="md">{diceRoll[1]}</Heading>
          </Flex>
        </Stack>
      )}
      <Button
        w="100%"
        colorScheme={diceRoll ? 'green' : 'purple'}
        onClick={diceRoll ? handleMove : handleRoll}
        mt="10px"
        isLoading={isRolling || isMoving}
        disabled={isRolling || isMoving}
      >
        {diceRoll ? 'Move' : 'Roll'}
      </Button>
    </Flex>
  );
};

export const ActionModalGo = ({}) => {
  const { payBank, currentPlayer, state } = useGameContext();

  if (!currentPlayer) return <></>;

  return (
    <Box>
      <Heading size="md">You landed on Go!</Heading>
      <Box>Collect £ from the bank!</Box>
    </Box>
  );
};

// Content of our action modal for taking a card (pot luck or opportunity knocks)
export const ActionModalTakeCard = ({ cardType }: { cardType: CardType }) => {
  const {
    takeCard,
    payBank,
    currentPlayer,
    gameSettings,
    goto,
    sendToJail,
    hideActionModal,
  } = useGameContext();

  const [cardAction, setCardAction] = useState<CardAction | null>(null);

  const handleTakeCard = () => {
    const action = takeCard(cardType);
    if (action) {
      setCardAction(action);
    }
  };

  const performAction = useCallback(() => {
    if (!cardAction || !currentPlayer?.token) return;

    switch (cardAction.action_type) {
      case 'EARN_FROM_BANK':
        payBank(currentPlayer?.token, -(cardAction?.cost ?? 0));
        break;
      case 'PAY_BANK':
        payBank(currentPlayer?.token, cardAction?.cost ?? 0);
        break;
      case 'GO_TO_JAIL':
        sendToJail(currentPlayer?.token);
        break;
      case 'GO_TO_PROPERTY':
        const property = gameSettings?.BoardSpaces?.find(
          space => space.property_id === cardAction?.property_id
        );
        if (property) {
          goto(currentPlayer?.token, property.board_position);
        }
      default:
        break;
    }

    setTimeout(() => {
      hideActionModal();
    }, 1000);
  }, [cardAction]);

  return (
    <Flex direction={'column'} justify={'center'} align="center">
      <Heading size="md">
        Pick a {cardType === 'POT_LUCK' ? 'Pot Luck' : 'Opportunity Knocks'}{' '}
        Card
      </Heading>
      {cardAction && (
        <GameCard
          {...cardAction}
          propertyName={
            gameSettings?.Properties?.find(
              property => property.id === cardAction?.property_id
            )?.name ?? undefined
          }
        />
      )}
      <Button
        colorScheme={'green'}
        mt={'10px'}
        w="100%"
        onClick={() => (cardAction ? performAction() : handleTakeCard())}
      >
        {cardAction ? 'Perform Card Action' : 'Take'}
      </Button>
    </Flex>
  );
};

export const ActionModalBuy = () => {
  const { gameSettings, currentPlayer, state, buy, hideActionModal } =
    useGameContext();
  const [buying, setBuying] = useState(false);

  // Logic: the only way to buy a property is if it is your turn and you have landed on it.

  if (!currentPlayer) return <></>;

  const space = gameSettings?.BoardSpaces.find(
    space => space.board_position === state[currentPlayer?.token]?.pos
  );

  const property = gameSettings?.Properties.find(
    property => property.id === space?.property_id
  );

  if (!property) return <></>;

  const handleBuy = () => {
    setBuying(true);
    buy(currentPlayer?.token, property.id);
    setTimeout(() => {
      hideActionModal();
      setBuying(false);
    }, 1000);
  };

  return (
    <Box>
      <Flex direction={'column'} justify={'center'} align="center">
        <BoardSpace.Property property={property} />
      </Flex>
      <Divider my="15px" />
      <Box my="10px" p="10px" bg="#eee" borderRadius={'8px'}>
        <Heading size="md">
          {property.name} - {formatPrice(property.price ?? 0)}
        </Heading>
        {property.property_group_color !== 'STATION' &&
        property.property_group_color !== 'UTILITIES' ? (
          <Text p="0" fontWeight={'600'}>
            Rent Unimproved: {formatPrice(property.rent_unimproved ?? 0)}
            <br />
            Rent 1 House: {formatPrice(property.rent_one_house ?? 0)}
            <br />
            Rent 2 Houses: {formatPrice(property.rent_two_house ?? 0)}
            <br />
            Rent 3 Houses: {formatPrice(property.rent_three_house ?? 0)}
            <br />
            Rent 4 Houses: {formatPrice(property.rent_four_house ?? 0)}
            <br />
            Rent Hotel: {formatPrice(property.rent_hotel ?? 0)}
          </Text>
        ) : property.property_group_color === 'STATION' ? (
          <Stack spacing={'4px'}>
            {new Array(4).fill(0).map((_, i) => (
              <Text m="0">
                If player owns {i + 1} station{i + 1 > 1 ? 's' : ''} - Rent is{' '}
                {formatPrice(calculateStationRent(i + 1))}
              </Text>
            ))}
          </Stack>
        ) : property.property_group_color === 'UTILITIES' ? (
          <Stack spacing={'4px'}>
            {new Array(2).fill(0).map((_, i) => (
              <Text m="0">
                If player owns {i + 1} utilit{i + 1 > 1 ? 'ies' : 'y'} - Rent is{' '}
                {calculateUtilityMulitplier(i + 1)}x dice roll
              </Text>
            ))}
          </Stack>
        ) : (
          <></>
        )}
      </Box>
      <Flex direction="column" gap="5px">
        <Button
          w="100%"
          disabled={
            !currentPlayer ||
            !property ||
            !state[currentPlayer?.token] ||
            (state[currentPlayer?.token]?.money ?? 0) < (property?.price ?? 0) // Disable the button if you don't have enough money
          }
          colorScheme="green"
          isLoading={buying}
          onClick={() => {
            handleBuy();
          }}
        >
          {(state[currentPlayer?.token]?.money ?? 0) < (property?.price ?? 0)
            ? 'Not enough money'
            : 'Buy'}
        </Button>
        <Button w="100%" colorScheme={'blue'} onClick={() => hideActionModal()}>
          No thanks
        </Button>
      </Flex>
    </Box>
  );
};

export const ActionModalTax = () => {
  const { gameSettings, state, currentPlayer, payBank, hideActionModal } =
    useGameContext();

  if (!gameSettings || !currentPlayer) return <></>;

  const space = gameSettings?.BoardSpaces.find(
    space => space.board_position === (state[currentPlayer?.token]?.pos ?? 0)
  );

  const taxAmount = space?.tax_cost ?? 0;

  return (
    <Flex direction={'column'} justify={'center'} align="center">
      <Heading size="md">Pay the Tax</Heading>
      <Text fontSize={'4xl'}>{formatPrice(taxAmount)}</Text>
      <Button
        w={'100%'}
        colorScheme={'red'}
        onClick={() => {
          payBank(currentPlayer?.token, taxAmount);
          setTimeout(() => {
            hideActionModal();
          }, 1000);
        }}
      >
        Pay
      </Button>
    </Flex>
  );
};

export const ActionModalPayRent = () => {
  const {
    payPlayer,
    gameSettings,
    currentPlayer,
    state,
    isOwned,
    calculateRent,
    hideActionModal,
  } = useGameContext();

  if (!gameSettings || !currentPlayer) return <></>;

  const space = gameSettings?.BoardSpaces.find(
    space => space.board_position === (state[currentPlayer?.token]?.pos ?? 0)
  );

  const property = gameSettings?.Properties.find(
    property => property.id === space?.property_id
  );

  if (!property) return <></>;

  const owner = isOwned(property?.id);

  if (!owner) return <></>;

  const rent = useMemo(
    () => calculateRent(property?.id),
    [property?.id, calculateRent]
  );

  return (
    <Flex direction={'column'} justify={'center'} align="center">
      <Heading size="md">Pay the Rent</Heading>
      {property && <BoardSpace.Property property={property} />}
      <Text fontSize={'4xl'}>{formatPrice(rent ?? 0)}</Text>
      <Button
        w={'100%'}
        colorScheme={'red'}
        onClick={() => {
          payPlayer(currentPlayer?.token, owner?.token, rent);

          setTimeout(() => {
            hideActionModal();
          }, 1000);
        }}
      >
        Pay
      </Button>
    </Flex>
  );
};

export const ActionModalFreeParking = () => {
  const {
    landedOnFreeParking,
    currentPlayer,
    hideActionModal,
    totalOnFreeParking,
  } = useGameContext();

  useEffect(() => {
    if (!currentPlayer) return;
    const v = landedOnFreeParking(currentPlayer.token);
  }, [currentPlayer]);

  return (
    <Flex direction={'column'} justify={'center'} align="center">
      <Heading size="md">Free Parking</Heading>

      <Text>
        The total amount on free parking is {formatPrice(totalOnFreeParking)},
        It&apos;s all yours now
      </Text>
      <Button
        w={'100%'}
        colorScheme={'blue'}
        onClick={() => {
          hideActionModal();
        }}
      >
        Continue
      </Button>
    </Flex>
  );
};

export const ActionModalGoToJail = () => {
  const { sendToJail, currentPlayer, hideActionModal, gameSettings } =
    useGameContext();

  const handleGoToJail = () => {
    if (!currentPlayer) return;
    sendToJail(currentPlayer?.token);

    setTimeout(() => {
      hideActionModal();
    }, 1000);
  };

  return (
    <Flex direction={'column'} justify={'center'} align="center">
      <Heading size="md">Go To Jail</Heading>
      <Text>You have been sent to jail</Text>
      <Button onClick={() => handleGoToJail()}>Go To Jail</Button>
    </Flex>
  );
};
