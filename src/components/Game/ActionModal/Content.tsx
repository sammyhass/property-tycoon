import { useGameContext } from '@/hooks/useGameContext';
import { formatPrice } from '@/util/formatPrice';
import {
  Alert,
  AlertDescription,
  AlertIcon,
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
import { PropertyRentInfo } from '../Board/PropertyStack';
import { BoardSpaceProperty } from '../Board/spaces';

// Action Modal Content Components

export const ActionModalBuyHouse = () => {
  const {
    buyHouse,
    hideBuyHouseAction,
    propertyToBuyHouseOn,
    state,
    gameSettings,
    currentPlayer,
  } = useGameContext();

  const currentHouses = useMemo(() => {
    if (!propertyToBuyHouseOn || !currentPlayer) return 0;
    return state?.[currentPlayer?.token]?.propertiesOwned?.[
      propertyToBuyHouseOn?.property_group_color
    ]?.[propertyToBuyHouseOn?.id]?.houses;
  }, [
    state,
    currentPlayer,
    propertyToBuyHouseOn,
    state[currentPlayer?.token ?? 'boot']?.propertiesOwned,
  ]);

  const houseCost = useMemo(() => {
    if (!propertyToBuyHouseOn) return 0;
    return gameSettings?.PropertyGroups.find(
      group => group.color === propertyToBuyHouseOn.property_group_color
    )?.house_cost;
  }, [propertyToBuyHouseOn, gameSettings?.PropertyGroups]);

  const hotelCost = useMemo(() => {
    if (!propertyToBuyHouseOn) return 0;
    return gameSettings?.PropertyGroups.find(
      group => group.color === propertyToBuyHouseOn.property_group_color
    )?.hotel_cost;
  }, [propertyToBuyHouseOn, gameSettings?.PropertyGroups]);

  return (
    <Box>
      <Heading size="sm">Buy a house on {propertyToBuyHouseOn?.name}?</Heading>
      <Flex w="100%" align={'center'} justify="center" my="10px">
        <BoardSpaceProperty
          property={propertyToBuyHouseOn}
          nHouses={currentHouses}
        />
      </Flex>
      {(currentHouses ?? 0) < 5 && (
        <Button
          w="100%"
          colorScheme="green"
          onClick={() => {
            if (!currentPlayer || !propertyToBuyHouseOn) return;
            buyHouse(currentPlayer?.token, propertyToBuyHouseOn.id, 1);
          }}
        >
          {`Buy a ${
            (currentHouses ?? 0) < 4 ? 'House' : 'Hotel'
          } for ${formatPrice(
            (currentHouses ?? 0) < 4 ? houseCost ?? 0 : hotelCost ?? 0
          )}`}
        </Button>
      )}

      {(currentHouses ?? 0) === 5 && (
        <Alert mt="10px">
          <AlertIcon />
          <AlertDescription>
            You have already bought a hotel on this property.
          </AlertDescription>
        </Alert>
      )}

      <Button
        onClick={hideBuyHouseAction}
        w="100%"
        colorScheme={'purple'}
        mt="10px"
      >
        All Done!
      </Button>
    </Box>
  );
};

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

  const [choice, setChoice] = useState<'roll' | 'pay'>('pay');

  const [roll, setRoll] = useState<[number, number] | null>(null);

  const [didRoll, setDidRoll] = useState(false);
  const [didPay, setDidPay] = useState(false);

  const handleContinue = useCallback(() => {
    if (!currentPlayer) return;
    if (didPay || (didRoll && roll && roll[0] === roll[1])) {
      freeFromJail(currentPlayer.token);
      if (roll && roll[0] === roll[1]) {
        move(currentPlayer.token, roll[0] + roll[1]);
      }
    } else {
      failedToGetOutOfJail(currentPlayer.token);
    }
    hideActionModal();
  }, [
    failedToGetOutOfJail,
    currentPlayer,
    hideActionModal,
    move,
    roll,
    didRoll,
    didPay,
    freeFromJail,
  ]);

  const handleDiceRoll = useCallback(() => {
    if (!currentPlayer) return;
    const [roll1, roll2] = rollDice();
    setRoll([roll1, roll2]);
    setDidRoll(true);
  }, [rollDice, currentPlayer]);

  const handlePayToGetOut = useCallback(() => {
    if (!currentPlayer) return;

    payBank(currentPlayer?.token, 50);
    setDidPay(true);
  }, [currentPlayer, payBank]);

  if (!currentPlayer) return <></>;
  return (
    <Flex direction={'column'} gap="5px">
      <Heading size="md" py="10px">
        You&apos;re in Jail!
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
            defaultValue="pay"
          >
            <Stack direction="column" spacing="5px">
              {(state[currentPlayer.token]?.turnsInJail ?? 0) < 3 && (
                <Radio value="roll">
                  <Text>🎲 Roll Dice</Text>
                </Radio>
              )}
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
              !currentPlayer ||
              (state[currentPlayer.token]?.money ?? 0) < 50 ||
              didPay
            }
          >
            Pay £50 to get out
          </Button>
        </Box>
      )}
      {(didRoll || didPay) && (
        <Button onClick={handleContinue} mt="20px">
          {roll
            ? roll[0] === roll[1] || didPay
              ? 'Get out Now'
              : 'Roll again next turn.'
            : 'Continue'}
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
  }, [currentPlayer, move, diceRoll]);

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
  const { payBank, currentPlayer, hideActionModal } = useGameContext();

  const [loading, setLoading] = useState(false);

  const collect = useCallback(() => {
    setLoading(true);
    if (!currentPlayer) return;
    payBank(currentPlayer.token, -200);

    setTimeout(() => {
      setLoading(false);

      hideActionModal();
    }, 500);
  }, [currentPlayer, payBank, hideActionModal]);

  if (!currentPlayer) return <></>;

  return (
    <Flex direction={'column'} gap="5px" align={'center'}>
      <Heading size="4xl">🎉</Heading>
      <Heading size="md">You landed on Go!</Heading>
      <Box>Collect {formatPrice(200)} from the bank!</Box>
      <Button
        w="100%"
        colorScheme={'green'}
        isLoading={loading}
        onClick={collect}
      >
        Collect £200
      </Button>
    </Flex>
  );
};

// Content of our action modal for taking a card (pot luck or opportunity knocks)
export const ActionModalTakeCard = ({ cardType }: { cardType: CardType }) => {
  const {
    takeCard,
    payBank,
    currentPlayer,
    gameSettings,
    bankrupt,
    goto,
    couldPay,
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

    hideActionModal();

    switch (cardAction.action_type) {
      case 'EARN_FROM_BANK':
        payBank(currentPlayer?.token, -(cardAction?.cost ?? 0));
        break;
      case 'PAY_BANK':
        if (couldPay(currentPlayer?.token, cardAction?.cost ?? 0)) {
          payBank(currentPlayer?.token, cardAction?.cost ?? 0);
        } else {
          bankrupt(currentPlayer?.token);
        }
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
      case 'GO_TO_GO':
        const goSpace = gameSettings?.BoardSpaces?.find(
          space => space.space_type === 'GO'
        );
        if (goSpace) {
          goto(currentPlayer?.token, goSpace.board_position);
        }
        break;
      default:
        alert('Unknown card action');
        break;
    }
  }, [
    cardAction,
    currentPlayer,
    gameSettings,
    hideActionModal,
    payBank,
    sendToJail,
    goto,
  ]);

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

  const group = gameSettings?.PropertyGroups.find(
    group => group.color === property?.property_group_color
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
        <BoardSpaceProperty property={property} />
      </Flex>
      <Divider my="15px" />
      <Box my="10px" p="10px" bg="#eee" borderRadius={'8px'}>
        <Heading size="md">
          {property.name} - {formatPrice(property.price ?? 0)}
        </Heading>
        <PropertyRentInfo property={property} group={group} />
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
  const {
    gameSettings,
    state,
    bankrupt,
    currentPlayer,
    couldPay,
    payBank,
    endTurn,

    hideActionModal,
  } = useGameContext();

  if (!gameSettings || !currentPlayer) return <></>;

  const space = gameSettings?.BoardSpaces.find(
    space => space.board_position === (state[currentPlayer?.token]?.pos ?? 0)
  );

  const taxAmount = space?.tax_cost ?? 0;

  const couldPayTax = couldPay(currentPlayer?.token, taxAmount);

  return (
    <Flex direction={'column'} justify={'center'} align="center">
      <Heading size="md">Pay the Tax</Heading>
      <Text fontSize={'4xl'}>{formatPrice(taxAmount)}</Text>
      <Button
        w={'100%'}
        colorScheme={'red'}
        onClick={() => {
          if (couldPayTax) {
            payBank(currentPlayer?.token, taxAmount);
          } else {
            bankrupt(currentPlayer?.token);
          }
          setTimeout(() => {
            hideActionModal();
          }, 1000);
        }}
      >
        {couldPayTax ? 'Pay' : "You're Bankrupt!"}
      </Button>
    </Flex>
  );
};

export const ActionModalPayRent = () => {
  const {
    payPlayer,
    gameSettings,
    currentPlayer,
    bankrupt,
    couldPay,
    state,
    isOwned,
    calculateRent,
    isMortgaged,
    hideActionModal,
  } = useGameContext();

  const space = currentPlayer?.token
    ? gameSettings?.BoardSpaces.find(
        space =>
          space.board_position === (state[currentPlayer?.token]?.pos ?? 0)
      )
    : null;

  const property = gameSettings?.Properties.find(
    property => property.id === space?.property_id
  );

  const owner = isOwned(property?.id ?? '');

  const rent = useMemo(() => {
    if (!property) return 0;
    return !isMortgaged(property.id) ? calculateRent(property?.id) : 0;
  }, [calculateRent, property, isMortgaged]);

  if (!owner || !property || !currentPlayer?.token) return <></>;

  return (
    <Flex direction={'column'} justify={'center'} align="center">
      <Heading size="md">Pay the Rent</Heading>
      {property && <BoardSpaceProperty property={property} />}
      <Text fontSize={'4xl'}>{formatPrice(rent ?? 0)}</Text>
      <Button
        w={'100%'}
        colorScheme={'red'}
        onClick={() => {
          if (!currentPlayer) return;
          if (couldPay(currentPlayer?.token, rent ?? 0)) {
            payPlayer(currentPlayer?.token, owner?.token, rent);
          } else {
            bankrupt(currentPlayer?.token);
          }
          setTimeout(() => {
            hideActionModal();
          }, 1000);
        }}
      >
        {couldPay(currentPlayer?.token, rent ?? 0) ? 'Pay' : "You're Bankrupt!"}
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
  }, [currentPlayer, landedOnFreeParking]);

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
