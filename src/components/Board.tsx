import { Box, Flex } from '@chakra-ui/react';
import React from 'react';
import { useGameContext } from '../hooks/useGameContext';
import BoardCell from './BoardCell';

const CELL_SIZE = 80;

const BOARD_SIZE = 10;

const calculateRightEdgeCellPosition = (row: number, boardSize: number) =>
  row + boardSize - 1;
const calculateBottomEdgeCellPosition = (col: number, boardSize: number) =>
  2 * boardSize - 3 + (boardSize - col);
const calculateLeftEdgeCellPosition = (row: number, boardSize: number) =>
  3 * boardSize - 4 + (boardSize - row);

export default function Board() {
  const { gameSettings, boardSize, cellSize } = useGameContext();

  return (
    <Box width={`${boardSize * cellSize}px`}>
      <FilledRow row={0} boardSize={boardSize} />
      {new Array(boardSize - 2).fill(0).map((_, i) => (
        <SpacedRow key={i + 1} row={i + 1} boardSize={boardSize} />
      ))}
      <FilledRow row={9} boardSize={boardSize} />
    </Box>
  );
}

interface RowProps {
  row: number;
  boardSize: number;
}
const FilledRow = ({ row, boardSize }: RowProps) => {
  return (
    <Flex>
      {new Array(boardSize).fill(0).map((_, i) => (
        <BoardCell
          key={`${row}-${i}`}
          n={row === 0 ? i : calculateBottomEdgeCellPosition(i, boardSize)}
        />
      ))}
    </Flex>
  );
};

const SpacedRow = ({ row, boardSize }: RowProps) => {
  return (
    <Flex justifyContent={'space-between'}>
      <BoardCell n={calculateLeftEdgeCellPosition(row, boardSize)} />
      <BoardCell n={calculateRightEdgeCellPosition(row, boardSize)} />
    </Flex>
  );
};
