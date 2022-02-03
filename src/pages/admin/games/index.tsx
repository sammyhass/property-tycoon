import GamesList from '@/components/admin/GamesList';
import AdminLayout from '@/components/UI/admin/AdminLayout';
import { enforceAuth } from '@/lib/checkAuth';
import { prismaClient } from '@/lib/prisma';
import { Box, Button, Divider, Heading } from '@chakra-ui/react';
import { game } from '@prisma/client';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import React from 'react';

interface AdminGamesProps {
  games: game[];
}

export default function AdminGames({ games }: AdminGamesProps) {
  return (
    <AdminLayout>
      <Box my="10px">
        <Heading mb={'5px'}>Game Boards</Heading>
        <Link href="/admin/games/new" passHref>
          <Button colorScheme={'green'}>Create a New Game Board</Button>
        </Link>
      </Box>

      <Divider />
      <GamesList games={games} />
    </AdminLayout>
  );
}

export const getServerSideProps: GetServerSideProps = enforceAuth(
  user => async () => {
    const games = await prismaClient.game.findMany({
      where: {
        user_id: user.id,
      },
    });

    return {
      props: {
        games,
      },
    };
  }
);
