import Navbar from '@/components/UI/admin/Navbar';
import PlayGameLayout from '@/components/UI/PlayLayout';
import { GameContextProvider } from '@/hooks/useGameContext';
import { prismaClient } from '@/lib/prisma';
import { Box, Heading, Text } from '@chakra-ui/react';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { GetServerSideProps } from 'next';
import React from 'react';
import { PlayPageInner } from '.';
import { GameT } from '../admin/games/[game_id]';

export default function SharedGamePage({ game }: { game: GameT }) {
  return (
    <PlayGameLayout>
      <Navbar />
      {game ? (
        <GameContextProvider initialGameSettings={game}>
          <PlayPageInner />
        </GameContextProvider>
      ) : (
        <Box
          bg="white"
          w="90%"
          mt="50px"
          mx="auto"
          p="20px"
          borderRadius={'8px'}
          shdaow="md"
        >
          <Heading>
            <FontAwesomeIcon
              icon={faExclamationCircle}
              color="red"
              style={{ margin: '0 2px' }}
            />
            No Game Found
          </Heading>
          <Text size="sm">Check the sharecode and try again.</Text>
        </Box>
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
    const game = await prismaClient.game.findUnique({
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
