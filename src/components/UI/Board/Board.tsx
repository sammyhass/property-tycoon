import { Box, Flex } from '@chakra-ui/react';
import React, { createContext, useContext } from 'react';
import BoardCell from './BoardCell';

const CELL_SIZE = 80;

const BOARD_SIZE = 10;

interface BoardProps {
  onTileClick?: (n: number) => void;
  boardSize: number;
  cellSize: number;
}

const BoardPropsContext = createContext<BoardProps>({
  boardSize: BOARD_SIZE,
  cellSize: CELL_SIZE
});

export const useBoardProps = () => useContext(BoardPropsContext);

export default function Board({
  onTileClick,
  boardSize = BOARD_SIZE,
  cellSize = CELL_SIZE,
}: BoardProps) {
  return (
    <BoardPropsContext.Provider value={{ onTileClick, boardSize, cellSize }}>
      <style>{`
        #board-grid {
          display: grid;
          grid-template-rows: repeat(${boardSize}, ${cellSize}px);
          grid-template-columns: repeat(${boardSize}, ${cellSize}px);
          grid-gap: 3px;
        }
      `}</style>
      <Box id="board-grid">
        {/* Dummy element to space out center of grid */}
        <Box
          gridRowStart={2}
          gridRowEnd={boardSize - 2}
          gridColumnStart={2}
          gridColumnEnd={boardSize - 2}
        />
        {new Array((boardSize * 4) - 4).fill(0).map((_, i) => (
          <BoardCell n={i} />
        ))}
      </Box>
    </BoardPropsContext.Provider>
  );
}

/*
<FilledRow row={0} boardSize={boardSize} />
{new Array(boardSize - 2).fill(0).map((_, i) => (
  <SpacedRow key={i + 1} row={i + 1} boardSize={boardSize} />
))}
<FilledRow row={9} boardSize={boardSize} />
*/

/*
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
*/