import { AspectRatio, Box, Flex, Text } from '@chakra-ui/react';
import React from 'react';

const CELL_SIZE = 80;

const NUM_ROWS = 10;
const NUM_COLS = 10;

export default function Board() {
  return (
    <Box width={`${NUM_COLS * CELL_SIZE}px`}>
      <FilledRow row={0} />
      {new Array(NUM_ROWS - 2).fill(0).map((_, i) => (
        <SpacedRow row={i + 1} />
      ))}
      <FilledRow row={9} />
    </Box>
  );
}

const BoardCell = ({ n }: { n: number }) => {
  return (
    <AspectRatio
      ratio={1}
      minW={CELL_SIZE}
      h={CELL_SIZE}
      bg="blue"
      onClick={() => alert(n)}
    >
      <Flex>
        <Text>Board</Text>
      </Flex>
    </AspectRatio>
  );
};

const FilledRow = ({ row }: { row: number }) => {
  return (
    <Flex>
      {new Array(NUM_COLS).fill(0).map((_, i) => (
        <BoardCell
          n={row === 0 ? i : NUM_COLS + NUM_COLS - 3 + (NUM_COLS - i)}
        />
      ))}
    </Flex>
  );
};

const SpacedRow = ({ row }: { row: number }) => {
  return (
    <Flex justifyContent={'space-between'}>
      <BoardCell n={3 * NUM_COLS - 3 + (NUM_ROWS - 1 - row)} />
      <BoardCell n={row + NUM_COLS - 1} />
    </Flex>
  );
};
