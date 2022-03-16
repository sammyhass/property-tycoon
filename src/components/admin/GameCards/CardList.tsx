import Card from '@/components/Game/Board/cards/Card';
import { GameCardsPageProps } from '@/pages/admin/games/[game_id]/cards';
import {
  Box,
  Button,
  chakra,
  Divider,
  Flex,
  Heading,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalOverlay,
} from '@chakra-ui/react';
import { CardType } from '@prisma/client';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useCallback, useMemo, useState } from 'react';

type CardListProps = {
  cards: GameCardsPageProps['game']['CardActions'];

  onClick?: 'show_modal' | undefined;
} & {
  gameId: string;
};
export default function CardList({ cards, gameId, onClick }: CardListProps) {
  const [selected, setSelected] = useState<string | null>(null);

  const selectedCard = useMemo(
    () => cards.find(card => card.id === selected),
    [cards, selected]
  );

  const opportunityKnocksCards = cards.filter(
    card => card.type === CardType.OPPORTUNITY_KNOCKS
  );
  const potLuckCards = cards.filter(card => card.type === CardType.POT_LUCK);

  const router = useRouter();

  const handleDelete = useCallback(async () => {
    if (selectedCard) {
      await axios.delete(`/api/game/${gameId}/game_cards/${selectedCard.id}`);
      setSelected(null);

      router.reload();
    }
  }, [gameId, selectedCard]);

  return (
    <>
      <Divider my="5px" />
      <Flex direction={'column'} gap="20px">
        <Box>
          <Heading size="md">Opportunity Knocks</Heading>
          <Flex overflowX="auto" my="5px" gap="5px" py="10px">
            {opportunityKnocksCards.map(card => (
              <Card
                key={card.id}
                propertyName={card.GameProperty?.name}
                {...card}
                onClick={() => setSelected(card.id)}
              />
            ))}
          </Flex>
          <Link
            href={{
              pathname: '/admin/games/[game_id]/cards/new',
              query: {
                game_id: gameId,
                type: CardType.OPPORTUNITY_KNOCKS,
              },
            }}
            passHref
          >
            <Button>New Opportunity Knocks Card</Button>
          </Link>
        </Box>
        <Box>
          <Divider />
          <Heading size="md">Pot Luck</Heading>
          <Flex overflowX="auto" my="5px" gap="5px">
            {potLuckCards.map(card => (
              <Card
                {...card}
                key={card.id}
                propertyName={card.GameProperty?.name}
                onClick={() => setSelected(card.id)}
              />
            ))}
          </Flex>
          <Link
            href={{
              pathname: '/admin/games/[game_id]/cards/new',
              query: {
                game_id: gameId,
                type: CardType.POT_LUCK,
              },
            }}
            passHref
          >
            <Button>New Pot Luck Card</Button>
          </Link>
        </Box>
      </Flex>
      <Modal
        isOpen={onClick === 'show_modal' && !!selected}
        onClose={() => setSelected(null)}
        size="lg"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalBody p="0" overflowX={'auto'}>
            <chakra.pre w="100%" p="10px">
              {JSON.stringify(selectedCard, null, 2)}
            </chakra.pre>
          </ModalBody>
          <ModalFooter>
            <Button onClick={() => handleDelete()} colorScheme={'red'}>
              Delete Card
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
