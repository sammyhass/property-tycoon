import { Box } from '@chakra-ui/react';
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
  cellSize: CELL_SIZE,
});

export const useBoardProps = () => useContext(BoardPropsContext);

export default function Board({
  onTileClick,
  boardSize = BOARD_SIZE,
  cellSize = CELL_SIZE,
}: BoardProps) {
  return (
    <BoardPropsContext.Provider value={{ onTileClick, boardSize, cellSize }}>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: `repeat(${boardSize}, ${cellSize}px)`,
          gridTemplateRows: `repeat(${boardSize}, ${cellSize}px)`,
          gridGap: 3,
        }}
      >
        {/* Dummy element to space out center of grid */}
        <Box
          gridRowStart={2}
          gridRowEnd={boardSize - 2}
          gridColumnStart={2}
          gridColumnEnd={boardSize - 2}
        />
        {new Array(boardSize * 4 - 4).fill(0).map((_, i) => (
          <BoardCell n={i} key={i} />
        ))}
      </Box>
    </BoardPropsContext.Provider>
  );
}
