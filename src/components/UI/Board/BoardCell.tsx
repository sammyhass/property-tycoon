import { Box, Text } from '@chakra-ui/react';
import React from 'react';
import { useBoardProps } from './Board';
export default function BoardCell({ n }: { n: number }) {
  const { onTileClick, cellSize } = useBoardProps();

  return (
    <Box
      transform={`scale(0.98)`}
      minH={'70px'}
      w={`${cellSize}px`}
      _hover={{
        transform: `scale(1)`,
      }}
      bg="blue"
      onClick={() => onTileClick && onTileClick(n)}
    >
      <Text>{n}</Text>
    </Box>
  );
}
