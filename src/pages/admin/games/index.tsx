import GamesList from '@/components/admin/GamesList';
import AdminLayout from '@/components/UI/admin/AdminLayout';
import { prismaClient } from '@/lib/prisma';
import { Box, Button, Flex, Link } from '@chakra-ui/react';
import { game } from '@prisma/client';
import { GetServerSideProps } from 'next';
import React from 'react';

interface AdminGamesProps {
  games: game[];
}

export default function AdminGames({ games }: AdminGamesProps) {
  return (
    <AdminLayout>
      <Box mt="40px" />
      <Flex my="10px" align="center" justify={'center'}>
        <Link href="/admin/games/new">
          <Button>Create a New Game</Button>
        </Link>
      </Flex>
      <GamesList games={games} />
    </AdminLayout>
  );
}

export const getServerSideProps: GetServerSideProps<
  AdminGamesProps
> = async () => {
  const games = await prismaClient.game.findMany();

  return {
    props: {
      games,
    },
  };
};
