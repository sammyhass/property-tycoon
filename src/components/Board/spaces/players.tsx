import { TokenType } from '@/hooks/useGameContext';
import { Flex } from '@chakra-ui/react';
import React from 'react';
import PlayerToken from '../players';

// Renders player tokens on a space in a circle
export default function BoardSpacePlayers({
  players,
}: {
  players: TokenType[];
}) {
  return (
    <Flex
      pos="absolute"
      w="100%"
      h="100%"
      justify={'center'}
      align="center"
      wrap="wrap"
      zIndex={10}
    >
      {players.map(player => (
        <PlayerToken token={player} />
      ))}
    </Flex>
  );
}
