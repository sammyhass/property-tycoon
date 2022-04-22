import { useGameContext } from '@/hooks/useGameContext';
import { Button, Flex, Heading } from '@chakra-ui/react';
import { CardAction, CardType } from '@prisma/client';
import React, { useCallback, useState } from 'react';
import GameCard from '../Board/cards/Card';

// Content of our action modal for taking a card (pot luck or opportunity knocks)

export default function TakeCardContent({ cardType }: { cardType: CardType }) {
  const {
    takeCard,
    payBank,
    currentPlayer,
    gameSettings,
    bankrupt,
    pickUpGetOutOfJailFreeCard,
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
      case 'GET_OUT_OF_JAIL_FREE':
        pickUpGetOutOfJailFreeCard(currentPlayer?.token);
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
}
