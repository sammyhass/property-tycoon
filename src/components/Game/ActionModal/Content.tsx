import { useGameContext } from '@/hooks/useGameContext';
import { formatPrice } from '@/util/formatPrice';
import {
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  Stack,
  Text,
} from '@chakra-ui/react';
import { CardAction, CardType } from '@prisma/client';
import React, { useCallback, useEffect, useState } from 'react';
import { ActionModalProps } from '.';
import GameCard from '../Board/cards/Card';
import BoardSpace from '../Board/spaces';

// Action Modal Content Components

// Content for our action modal when a player is rolling the dice.
export const ActionModalRoll = ({ onClose }: ActionModalProps) => {
  const { currentPlayer, move } = useGameContext();

  const [isRolling, setIsRolling] = useState(false);
  const [roll, setRoll] = useState(0);

  // Roll the dice.
  const handleRoll = () => {
    setIsRolling(true);

    if (!currentPlayer) return;
    // Choose a random number between 1 and 12
    const roll = Math.floor(Math.random() * 12) + 1;

    setTimeout(() => {
      move(currentPlayer?.token, roll);
      setRoll(roll);
      setIsRolling(false);
    }, 1000);

    if (!currentPlayer) {
      return <></>;
    }
  };
  return (
    <Flex direction={'column'} justify={'center'} align="center">
      <Heading size="4xl">🎲 🎲</Heading>
      {isRolling && <Heading size="md">Rolling...</Heading>}
      {roll > 0 && <Heading size="sm">Dice landed on {roll}</Heading>}
      <Button
        w="100%"
        colorScheme="purple"
        onClick={() => handleRoll()}
        mt="10px"
      >
        Roll
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
    goto,
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
        const jail = gameSettings?.BoardSpaces?.find(
          space => space.space_type === 'JUST_VISIT'
        );
        if (jail) {
          goto(currentPlayer?.token, jail.board_position);
        }
        break;
      case 'GO_TO_PROPERTY':
        const property = gameSettings?.BoardSpaces?.find(
          space => space.space_type === 'PROPERTY'
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
        {property.rent_unimproved ? (
          <Stack>
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
            </Text>
          </Stack>
        ) : null}
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

  const rent = property?.rent_unimproved ?? 0;

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
  const { landedOnFreeParking, currentPlayer, hideActionModal } =
    useGameContext();

  const [collected, setCollected] = useState(0);

  useEffect(() => {
    if (!currentPlayer) return;
    const v = landedOnFreeParking(currentPlayer.token);
    setCollected(v);
  }, [currentPlayer]);

  return (
    <Flex direction={'column'} justify={'center'} align="center">
      <Heading size="md">Free Parking</Heading>

      <Text>
        The total amount on free parking is {formatPrice(collected)}, It&apos;s
        all yours now
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
