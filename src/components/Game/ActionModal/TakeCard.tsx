import { useGameContext } from '@/hooks/useGameContext';
import { Button, Flex, Heading } from '@chakra-ui/react';
import { CardAction, CardType } from '@prisma/client';
import React, { useCallback, useState } from 'react';
import GameCard from '../Board/cards/Card';

// Content of our action modal for taking a card (pot luck or opportunity knocks)

export default function TakeCardContent({ cardType }: { cardType: CardType }) {
  const {
    takeCard,
    currentPlayer,
    gameSettings,
    canEndTurn,
    performCardAction,
    hideActionModal,
  } = useGameContext();

  const [hasPerformedAction, setHasPerformedAction] = useState(false);
  const [cardAction, setCardAction] = useState<CardAction | null>(null);
  const [isChoosingCard, setIsChoosingCard] = useState(false);

  const [isPerformingAction, setIsPerformingAction] = useState(false);

  const handleTakeCard = () => {
    setIsChoosingCard(true);
    setTimeout(() => {
      const action = takeCard(cardType);
      if (action) {
        setCardAction(action);
      }
      setIsChoosingCard(false);
    }, 500);
  };

  const handlePerformCardAction = useCallback(() => {
    if (!currentPlayer) return;
    setIsPerformingAction(true);
    setTimeout(() => {
      if (cardAction) {
        performCardAction(currentPlayer.token, cardAction);
      }
      setHasPerformedAction(true);
      setCardAction(null);
    }, 500);
    setIsPerformingAction(false);
  }, [currentPlayer, cardAction, performCardAction, setCardAction]);

  return (
    <Flex direction={'column'} justify={'center'} align="center">
      {!hasPerformedAction ? (
        <>
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
            isLoading={isPerformingAction || isChoosingCard}
            mt={'10px'}
            w="100%"
            onClick={cardAction ? handlePerformCardAction : handleTakeCard}
          >
            {cardAction ? 'Perform Card Action' : 'Take'}
          </Button>
        </>
      ) : (
        <Button
          size="lg"
          onClick={hideActionModal}
          w="100%"
          colorScheme={'blue'}
        >
          Continue
        </Button>
      )}
    </Flex>
  );
}
