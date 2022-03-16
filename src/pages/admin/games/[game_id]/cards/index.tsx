import CardList from '@/components/admin/GameCards/CardList';
import AdminLayout from '@/components/UI/admin/AdminLayout';
import { enforceAuth } from '@/lib/checkAuth';
import { prismaClient } from '@/lib/prisma';
import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Heading,
} from '@chakra-ui/react';
import { CardAction, Game, GameProperty } from '@prisma/client';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import React from 'react';

export interface GameCardsPageProps {
  game: Game & {
    CardActions: (CardAction & {
      GameProperty?: GameProperty;
    })[];
  };
}

export default function GameCardsPage({ game }: GameCardsPageProps) {
  return (
    <AdminLayout>
      <Breadcrumb>
        <BreadcrumbItem>
          <Link href="/admin/games">Game Boards</Link>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <Link
            href={{
              pathname: '/admin/games/[game_id]',
              query: {
                game_id: game?.id,
              },
            }}
          >
            {game?.name}
          </Link>
        </BreadcrumbItem>
        <BreadcrumbItem isCurrentPage>
          <Link href="#">Cards</Link>
        </BreadcrumbItem>
      </Breadcrumb>

      <Box>
        <Heading>Cards</Heading>
        <Link
          href={{
            pathname: '/admin/games/[game_id]/cards/new',
            query: {
              game_id: game?.id,
            },
          }}
          passHref
        >
          <Button colorScheme={'green'}>Create a New Card</Button>
        </Link>
        <Box mt="20px">
          <CardList
            cards={game?.CardActions}
            gameId={game.id}
            onClick="show_modal"
          />
        </Box>
      </Box>
    </AdminLayout>
  );
}

export const getServerSideProps: GetServerSideProps = enforceAuth(
  user =>
    async ({ params }) => {
      const game_id = params?.game_id as string;

      const data = await prismaClient.game.findFirst({
        where: {
          id: game_id,
          user_id: user.id,
        },
        include: {
          CardActions: {
            include: {
              GameProperty: true,
            },
          },
        },
      });

      if (!data) {
        return {
          props: {
            game: null,
          },
          redirect: {
            destination: '/admin/games',
            statusCode: 302,
          },
        };
      }

      return {
        props: {
          game: data,
        },
      };
    }
);
