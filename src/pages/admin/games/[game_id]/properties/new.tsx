import NewPropertyForm from '@/components/admin/GameProperties/NewPropertyForm';
import AdminLayout from '@/components/UI/admin/AdminLayout';
import { prismaClient } from '@/lib/prisma';
import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Heading,
} from '@chakra-ui/react';
import { game, property_group } from '@prisma/client';
import { GetServerSideProps } from 'next';
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
}: NewPropertyPageProps) {
  return (
    <AdminLayout>
      <Breadcrumb separator="-">
        <BreadcrumbItem>
          <BreadcrumbLink href="/admin/games">Game Boards</BreadcrumbLink>
        </BreadcrumbItem>

        <BreadcrumbItem>
          <BreadcrumbLink href={`/admin/games/${gameId}`}>Game</BreadcrumbLink>
        </BreadcrumbItem>

        <BreadcrumbItem>
          <BreadcrumbLink href={`/admin/games/${gameId}/properties`}>
            Properties
          </BreadcrumbLink>
        </BreadcrumbItem>

        <BreadcrumbItem isCurrentPage>
          <BreadcrumbLink href={`/admin/games/${gameId}/properties/new`}>
            New Property
          </BreadcrumbLink>
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

export const getServerSideProps: GetServerSideProps<
  NewPropertyPageProps
> = async ({ query }) => {
  const game_id = query.game_id as string;

  const game = await prismaClient.game.findUnique({
    where: {
      id: game_id,
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
};
