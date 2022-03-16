import { useGameContext } from '@/hooks/useGameContext';
import { Box, Code, Heading } from '@chakra-ui/react';
import React from 'react';

// Heads-up-display to show in game, displays current player and time
export default function HUD() {
  const { time, currentPlayer, state } = useGameContext();

  return (
    <Box zIndex={100} bg="whiteAlpha.500" p="10px">
      <Heading>
        Time Elapsed: <Code fontSize={'inherit'}>{time}s</Code>
      </Heading>
    </Box>
  );
}
