import Card from '@/components/UI/Board/Card';
import { GameCardsPageProps } from '@/pages/admin/games/[game_id]/cards';
import {
  Box,
  Button,
  Code,
  Divider,
  Flex,
  Heading,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import { CardType } from '@prisma/client';
import Link from 'next/link';
import React, { useMemo, useState } from 'react';

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

  return (
    <>
      <Divider my="5px" />
      <Flex direction={'column'} gap="20px">
        <Box>
          <Heading size="md">Opportunity Knocks</Heading>
          <Flex wrap="wrap" my="5px">
            {opportunityKnocksCards.map(card => (
              <Card
                key={card.id}
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
          <Flex wrap="wrap" my="5px">
            {potLuckCards.map(card => (
              <Card
                {...card}
                key={card.id}
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
          <ModalHeader>{selectedCard?.title}</ModalHeader>
          <ModalBody p="0">
            <Code w="100%" p="10px">
              <pre>{JSON.stringify(selectedCard, null, 2)}</pre>
            </Code>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme={'red'}>Delete Card</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
