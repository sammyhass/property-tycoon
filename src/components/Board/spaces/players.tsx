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
      pos={'absolute'}
      top={0}
      left={0}
      right={0}
      wrap="wrap"
      bottom={0}
      justify={'center'}
      align={'center'}
      zIndex={100}
    >
      {players.map(player => (
        <PlayerToken token={player} key={player} />
      ))}
    </Flex>
  );
}
