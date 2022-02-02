import { Box, Text } from '@chakra-ui/react';
import React from 'react';
import { useGameContext } from '../hooks/useGameContext';
export default function BoardCell({ n }: { n: number }) {
  const { gameSettings: boardSettings, cellSize } = useGameContext();

  return (
    <Box
      transform={`scale(0.98)`}
      minH={'70px'}
      w={`${cellSize}px`}
      _hover={{
        transform: `scale(1)`,
      }}
      bg="blue"
      onClick={() => alert(n)}
    >
      <Text>{n}</Text>
    </Box>
  );
}
