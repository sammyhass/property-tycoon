import { Box, Flex } from '@chakra-ui/react';
import React, { createContext, useContext } from 'react';
import BoardCell from './BoardCell';

const CELL_SIZE = 80;

const BOARD_SIZE = 10;

export const calculateRightEdgeCellPosition = (
  row: number,
  boardSize: number
) => row + boardSize - 1;
export const calculateBottomEdgeCellPosition = (
  col: number,
  boardSize: number
) => 2 * boardSize - 3 + (boardSize - col);
export const calculateLeftEdgeCellPosition = (row: number, boardSize: number) =>
  3 * boardSize - 4 + (boardSize - row);

interface BoardProps {
  onTileClick?: (n: number) => void;
  boardSize?: number;
  cellSize?: number;
}

const BoardPropsContext = createContext<BoardProps>({});

export const useBoardProps = () => useContext(BoardPropsContext);

export default function Board({
  onTileClick,
  boardSize = BOARD_SIZE,
  cellSize = CELL_SIZE,
}: BoardProps) {
  return (
    <BoardPropsContext.Provider value={{ onTileClick, boardSize, cellSize }}>
      <Box width={`${boardSize * cellSize}px`}>
        <FilledRow row={0} boardSize={boardSize} />
        {new Array(boardSize - 2).fill(0).map((_, i) => (
          <SpacedRow key={i + 1} row={i + 1} boardSize={boardSize} />
        ))}
        <FilledRow row={9} boardSize={boardSize} />
      </Box>
    </BoardPropsContext.Provider>
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
