import { useGameContext } from '@/hooks/useGameContext';
import { formatPrice } from '@/util/formatPrice';
import {
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
} from '@chakra-ui/react';
import { CardAction, CardType } from '@prisma/client';
import React, { useState } from 'react';
import BoardSpace from '../Board/spaces';

// Different types of action modal we can use for our modal.
export type ActionType =
  | 'BUY' // Buying a property
  | 'MORTGAGE'
  | 'PAY_RENT' // Pay rent
  | 'ROLL' // Roll dice
  // Taking Cards
  | 'TAKE_POT_LUCK'
  | 'TAKE_OPPORTUNITY_KNOCKS'
  // ---
  | 'GO_TO_JAIL' // Player is sent to jail
  | 'FREE_PARKING' // Land on a Free Parking space
  | 'GO'; // Land on a Go space

interface ActionModalProps {
  action: ActionType | null;
  onClose: () => void;
  isOpen: boolean;
}

const actionModalComponents: Record<ActionType, React.FC<ActionModalProps>> = {
  BUY: () => <ActionModal.Buy />,
  MORTGAGE: () => <div>Mortgage</div>,
  PAY_RENT: () => <div>Pay Rent</div>,
  ROLL: props => <ActionModal.Roll {...props} />,
  GO_TO_JAIL: () => <div>Jail</div>,
  TAKE_POT_LUCK: () => <ActionModal.TakeCard cardType={'POT_LUCK'} />,
  TAKE_OPPORTUNITY_KNOCKS: () => (
    <ActionModal.TakeCard cardType="OPPORTUNITY_KNOCKS" />
  ),
  FREE_PARKING: () => <div>Free Parking</div>,
  GO: () => <div>GO!</div>,
};

export default function ActionModal(props: ActionModalProps) {
  const ActionComponent = props.action
    ? (actionModalComponents[props.action] as React.FC<ActionModalProps>)
    : null;

  return (
    <Modal onClose={props.onClose} isOpen={props.isOpen}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{props.action}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {ActionComponent && <ActionComponent {...props} />}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

// Content for our action modal when a player is rolling the dice.
ActionModal.Roll = ({ onClose }: ActionModalProps) => {
  const { currentPlayer, move } = useGameContext();

  const [isRolling, setIsRolling] = useState(false);
  const [roll, setRoll] = useState(0);

  // Roll the dice.
  const handleRoll = () => {
    setIsRolling(true);

    if (!currentPlayer) return;
    // Choose a random number between 1 and 6
    const roll = Math.floor(Math.random() * 6) + 1;

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
      <Heading size="4xl">🎲</Heading>
      {isRolling && <Heading size="md">Rolling...</Heading>}
      {roll > 0 && <Heading size="sm">Dice landed on {roll}</Heading>}
      <Button onClick={() => handleRoll()}>Roll</Button>
    </Flex>
  );
};

// Content of our action modal for taking a card (pot luck or opportunity knocks)
ActionModal.TakeCard = ({ cardType }: { cardType: CardType }) => {
  const { takeCard } = useGameContext();

  const [cardAction, setCardAction] = useState<CardAction | null>(null);

  const handleTakeCard = () => {
    const action = takeCard(cardType);
    if (action) {
      setCardAction(action);
    }
  };

  return (
    <Flex direction={'column'} justify={'center'} align="center">
      <Heading size="md">
        Pick a {cardType === 'POT_LUCK' ? 'Pot Luck' : 'Opportunity Knocks'}{' '}
        Card
      </Heading>
      <pre>{JSON.stringify(cardAction, null, 2)}</pre>
      <Button onClick={() => handleTakeCard()}>Take</Button>
    </Flex>
  );
};

ActionModal.Buy = () => {
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
      </Box>
      <Button
        colorScheme="green"
        isLoading={buying}
        onClick={() => {
          handleBuy();
        }}
      >
        Buy {property.name}
      </Button>
    </Box>
  );
};
