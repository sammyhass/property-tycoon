import BoardSpacesEditor from '@/components/admin/BoardSpacesEditor';
import DeleteGameButton from '@/components/admin/DeleteGameButton';
import CardList from '@/components/admin/GameCards/CardList';
import GameProperties from '@/components/admin/GameProperties';
import PropertyGroups from '@/components/admin/PropertyGroups';
import AdminLayout from '@/components/UI/admin/AdminLayout';
import { API_URL } from '@/env/env';
import { enforceAuth } from '@/lib/checkAuth';
import { prismaClient } from '@/lib/prisma';
import {
  Alert,
  Box,
  Breadcrumb,
  BreadcrumbItem,
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
import Link from 'next/link';
import React from 'react';

export const getGame = async (pc: PrismaClient, id: string, userId: string) => {
  return await pc.game.findFirst({
    where: {
      id,
      user_id: userId,
    },
    include: {
      BoardSpaces: true,
      CardActions: true,
      Properties: true,
      PropertyGroups: true,
    },
  });
};

export type GameT = Prisma.PromiseReturnType<typeof getGame>;

interface AdminGamePageProps {
  game: GameT;
}

export default function AdminGamePage({ game }: AdminGamePageProps) {
  const setActive = async () => {
    if (!game) return;
    const { data, status } = await axios.post(`${API_URL}/active`, {
      game_id: game?.id,
    });

    if (status === 200) {
      window.location.reload();
    }
  };

  return (
    <AdminLayout>
      <Breadcrumb separator={'/'}>
        <BreadcrumbItem>
          <Link href="/admin/games">Game Boards</Link>
        </BreadcrumbItem>

        <BreadcrumbItem isCurrentPage>
          <Link href="#">{game?.name}</Link>
        </BreadcrumbItem>
      </Breadcrumb>
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
            <Box mb="5px">
              <Text m="0" p="0">
                Created {game.created_at?.toDateString()}
              </Text>
              <DeleteGameButton id={game.id} name={game.name} />
            </Box>
          </Flex>
          <Divider />
          <BoardSpacesEditor
            boardSpaces={game.BoardSpaces}
            properties={game.Properties}
            gameId={game.id}
          />
          <Divider />
          {game.PropertyGroups.length < 1 && (
            <Alert my="5px" variant={'left-accent'} colorScheme="red">
              You must create a property group before you can create any
              properties
            </Alert>
          )}
          <Box mt="10px">
            <PropertyGroups gameId={game.id} groups={game.PropertyGroups} />
          </Box>
          <Box mt="10px">
            <GameProperties gameId={game.id} properties={game.Properties} />
          </Box>
          <Box mt="10px" p="10px" shadow="xl">
            <Link
              passHref
              href={`
              /admin/games/${game.id}/cards
            `}
            >
              <Heading size="md">Cards</Heading>
            </Link>
            <CardList cards={game.CardActions} gameId={game.id} />
          </Box>
        </Box>
      ) : (
        <Box>Nothing Found</Box>
      )}
    </AdminLayout>
  );
}

export const getServerSideProps: GetServerSideProps = enforceAuth(
  user =>
    async ({ query }) => {
      const game_id = query.game_id as string;

      const game = await getGame(prismaClient, game_id, user.id);

      return {
        props: {
          game,
        },
      };
    }
);
