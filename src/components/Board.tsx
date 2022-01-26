import { AspectRatio, Box, Flex, Text } from '@chakra-ui/react';
import React from 'react';

const CELL_SIZE = 80;

const BOARD_SIZE = 20;

const calculateRightEdgeCellPosition = (row: number) => row + BOARD_SIZE - 1;
const calculateBottomEdgeCellPosition = (col: number) =>
  2 * BOARD_SIZE - 3 + (BOARD_SIZE - col);
const calculateLeftEdgeCellPosition = (row: number) =>
  3 * BOARD_SIZE - 4 + (BOARD_SIZE - row);

export default function Board() {
  return (
    <Box width={`${BOARD_SIZE * CELL_SIZE}px`}>
      <FilledRow row={0} />
      {new Array(BOARD_SIZE - 2).fill(0).map((_, i) => (
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
      {new Array(BOARD_SIZE).fill(0).map((_, i) => (
        <BoardCell n={row === 0 ? i : calculateBottomEdgeCellPosition(i)} />
      ))}
    </Flex>
  );
};

const SpacedRow = ({ row }: { row: number }) => {
  return (
    <Flex justifyContent={'space-between'}>
      <BoardCell n={calculateLeftEdgeCellPosition(row)} />
      <BoardCell n={calculateRightEdgeCellPosition(row)} />
    </Flex>
  );
};
