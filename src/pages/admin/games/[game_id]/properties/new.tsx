import NewPropertyForm from '@/components/admin/GameProperties/NewPropertyForm';
import AdminLayout from '@/components/UI/admin/AdminLayout';
import { enforceAuth } from '@/lib/checkAuth';
import { prismaClient } from '@/lib/prisma';
import { Box, Breadcrumb, BreadcrumbItem, Heading } from '@chakra-ui/react';
import { game, property_group } from '@prisma/client';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import React from 'react';
import { getPropertyGroups } from '../property-groups';

interface NewPropertyPageProps {
  gameId: string;
  game: game | null;
  groups: property_group[];
}
export default function NewPropertyPage({
  gameId,
  groups,
  game,
}: NewPropertyPageProps) {
  return (
    <AdminLayout>
      <Breadcrumb>
        <BreadcrumbItem>
          <Link href="/admin/games">Game Boards</Link>
        </BreadcrumbItem>

        <BreadcrumbItem>
          <Link href={`/admin/games/${gameId}`}>{game?.name}</Link>
        </BreadcrumbItem>

        <BreadcrumbItem>
          <Link href={`/admin/games/${gameId}/properties`}>Properties</Link>
        </BreadcrumbItem>

        <BreadcrumbItem isCurrentPage>
          <Link href={`/admin/games/${gameId}/properties/new`}>
            New Property
          </Link>
        </BreadcrumbItem>
      </Breadcrumb>
      <Box
        boxShadow={'xl'}
        border="1px solid #eee"
        p="15px"
        borderRadius={'8px'}
      >
        <Heading>Create a New Property</Heading>
        <NewPropertyForm gameId={gameId} existingGroups={groups} />
      </Box>
    </AdminLayout>
  );
}

export const getServerSideProps: GetServerSideProps = enforceAuth(
  user =>
    async ({ req, query }) => {
      const game_id = query.game_id as string;

      const game = await prismaClient.game.findFirst({
        where: {
          id: game_id,
          user_id: user.id,
        },
      });

      if (!game) {
        return {
          props: {
            gameId: game_id,
            game: null,
            groups: [],
          },
          redirect: {
            destination: '/admin/games',
            permanent: false,
          },
        };
      }

      const groups = await getPropertyGroups(prismaClient, game_id);

      return {
        props: {
          gameId: query.game_id as string,
          game,
          groups,
        },
      };
    }
);
