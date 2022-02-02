import GameProperties from '@/components/admin/GameProperties';
import PropertyGroups from '@/components/admin/PropertyGroups';
import AdminLayout from '@/components/UI/admin/AdminLayout';
import { prismaClient } from '@/lib/prisma';
import { Box, Divider, Flex, Heading, Spacer, Text } from '@chakra-ui/react';
import { Prisma, PrismaClient } from '@prisma/client';
import { GetServerSideProps } from 'next';
import React from 'react';

const getGame = async (pc: PrismaClient, id: string) => {
  return await pc.game.findUnique({
    where: {
      id,
    },
    include: {
      board_spaces: true,
      game_properties: true,
      property_groups: true,
    },
  });
};

type GameT = Prisma.PromiseReturnType<typeof getGame>;

interface AdminGamePageProps {
  game: GameT;
}

export default function AdminGamePage({ game }: AdminGamePageProps) {
  return (
    <AdminLayout>
      <Box w="80%" m="auto" mt="60px">
        {game ? (
          <Box>
            <Flex align="center" justify="center">
              <Heading>{game.name}</Heading>
              <Spacer />
              <Text m="0" p="0">
                Created {game.created_at?.toDateString()}
              </Text>
            </Flex>
            <Divider />
            <Box mt="10px">
              <GameProperties
                gameId={game.id}
                properties={game.game_properties}
              />
            </Box>
            <Box mt="10px">
              <PropertyGroups gameId={game.id} groups={game.property_groups} />
            </Box>
          </Box>
        ) : (
          <Box>Nothing Found</Box>
        )}
      </Box>
    </AdminLayout>
  );
}

export const getServerSideProps: GetServerSideProps<
  AdminGamePageProps
> = async ({ query }) => {
  const game_id = query.game_id as string;

  const game = await getGame(prismaClient, game_id);

  return {
    props: {
      game,
    },
  };
};
