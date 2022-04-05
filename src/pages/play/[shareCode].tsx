import GameLayout from '@/components/Game/GameLayout';
import Navbar from '@/components/UI/admin/Navbar';
import GameNotFound from '@/components/UI/GameNotFound';
import PlayGameLayout from '@/components/UI/PlayLayout';
import { GameContextProvider } from '@/hooks/useGameContext';
import { prismaClient } from '@/lib/prisma';
import { GetServerSideProps } from 'next';
import React from 'react';
import { GameT } from '../admin/games/[game_id]';

export default function SharedGamePage({ game }: { game: GameT }) {
  return (
    <PlayGameLayout>
      <Navbar />

      {game ? (
        <GameContextProvider initialGameSettings={game}>
          <GameLayout />
        </GameContextProvider>
      ) : (
        <GameNotFound />
      )}
    </PlayGameLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const shareCode = params?.shareCode;

  if (!shareCode) {
    return { props: {} };
  }

  try {
    const game = await prismaClient.game.findFirst({
      where: {
        share_code: shareCode as string,
      },
      include: {
        BoardSpaces: true,
        CardActions: true,
        Properties: true,
        PropertyGroups: true,
      },
    });

    return { props: { game } };
  } catch (e) {
    return { props: {} };
  }
};
