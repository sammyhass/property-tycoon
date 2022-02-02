import GameProperties from '@/components/admin/GameProperties';
import PropertyGroups from '@/components/admin/PropertyGroups';
import AdminLayout from '@/components/UI/admin/AdminLayout';
import { API_URL } from '@/env/env';
import { prismaClient } from '@/lib/prisma';
import {
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  Spacer,
  Text,
} from '@chakra-ui/react';
import { Prisma, PrismaClient } from '@prisma/client';
import axios from 'axios';
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
  const setActive = async () => {
    if (!game) return;
    const { data, status } = await axios.post(`${API_URL}/game/active`, {
      game_id: game?.id,
    });

    if (status === 200) {
      window.location.reload();
    }
  };

  return (
    <AdminLayout>
      <Box w="80%" m="auto" mt="60px">
        {game ? (
          <Box>
            <Flex align="center" justify="center">
              <Box>
                <Heading>{game.name}</Heading>
                {game.active ? (
                  <Text color="green.500">Active</Text>
                ) : (
                  <Flex align="center" my="10px" gap="20px">
                    <Text color="red.500">Inactive</Text>
                    <Button onClick={() => setActive()} colorScheme={'green'}>
                      Activate
                    </Button>
                  </Flex>
                )}
              </Box>
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
