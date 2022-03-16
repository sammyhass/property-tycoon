import { useGameContext } from '@/hooks/useGameContext';
import { Box, Button, Code, Heading } from '@chakra-ui/react';
import React from 'react';

// Heads-up-display to show in game, displays current player and time
export default function HUD() {
  const { time, currentPlayer, state, endTurn } = useGameContext();

  return (
    <Box zIndex={100} bg="whiteAlpha.500" p="10px">
      <Heading>
        Time Elapsed: <Code fontSize={'inherit'}>{time}s</Code>
      </Heading>
      <Button onClick={endTurn} w="100%" colorScheme={'red'} mt="10px">
        End Turn
      </Button>
    </Box>
  );
}
