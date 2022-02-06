import { GameCardsPageProps } from '@/pages/admin/games/[game_id]/cards';
import { Box, Divider, Heading } from '@chakra-ui/react';
import { card_type } from '@prisma/client';
import Link from 'next/link';
import React from 'react';

type CardListProps = { cards: GameCardsPageProps['game']['game_cards'] } & {
  gameId: string;
};
export default function CardList({ cards, gameId }: CardListProps) {
  const opportunityKnocksCards = cards.filter(
    card => card.type === card_type.OPPORTUNITY_KNOCKS
  );
  const potLuckCards = cards.filter(card => card.type === card_type.POT_LUCK);

  return (
    <>
      <Box>
        <Box>
          <Heading size="md">Opportunity Knocks</Heading>
          {opportunityKnocksCards.map(card => (
            <Box key={card.id}>{card.title}</Box>
          ))}
          <Link
            href={{
              pathname: '/admin/games/[game_id]/cards/new',
              query: {
                game_id: gameId,
                type: card_type.OPPORTUNITY_KNOCKS,
              },
            }}
            passHref
          >
            New Opportunity Knocks Card
          </Link>
        </Box>
        <Box>
          <Divider />
          <Heading size="md">Pot Luck</Heading>
          {potLuckCards.map(card => (
            <Box key={card.id}>{card.title}</Box>
          ))}
          <Link
            href={{
              pathname: '/admin/games/[game_id]/cards/new',
              query: {
                game_id: gameId,
                type: card_type.POT_LUCK,
              },
            }}
            passHref
          >
            New Pot Luck Card
          </Link>
        </Box>
      </Box>
    </>
  );
}
