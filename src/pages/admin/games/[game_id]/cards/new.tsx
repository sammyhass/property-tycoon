import NewCardForm from '@/components/admin/GameCards/NewCardForm';
import AdminLayout from '@/components/UI/admin/AdminLayout';
import { enforceAuth } from '@/lib/checkAuth';
import { prismaClient } from '@/lib/prisma';
import { Breadcrumb, BreadcrumbItem } from '@chakra-ui/react';
import { card_type, game, game_card } from '@prisma/client';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import React from 'react';

export default function NewCardPage({
  game,
  initialValues,
}: {
  game: game;
  initialValues?: Partial<game_card>;
}) {
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
        <BreadcrumbItem>
          <Link
            href={{
              pathname: '/admin/games/[game_id]/cards',
              query: {
                game_id: game?.id,
              },
            }}
          >
            Cards
          </Link>
        </BreadcrumbItem>
        <BreadcrumbItem isCurrentPage>
          <Link href="#">New Card</Link>
        </BreadcrumbItem>
      </Breadcrumb>
      <NewCardForm initialValues={initialValues} gameId={game?.id} />
    </AdminLayout>
  );
}

export const getServerSideProps: GetServerSideProps = enforceAuth(
  user =>
    async ({ params, req, query }) => {
      const gameId = params?.game_id as string;

      const initialValues: Partial<game_card> = {
        type: query.type as card_type,
      };

      const game = await prismaClient.game.findFirst({
        where: {
          user_id: user.id,
          id: gameId,
        },
      });

      return {
        props: {
          game,
          initialValues,
        },
      };
    }
);
