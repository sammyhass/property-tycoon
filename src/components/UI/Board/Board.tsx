import { Box } from '@chakra-ui/react';
import React, { createContext, useContext } from 'react';
import BoardSpace from './BoardSpace';

const CELL_SIZE = 80;

const BOARD_SIZE = 10;

interface BoardProps {
  onTileClick?: (n: number) => void;

  // TODO: Board size and cell size are unnecessary. Grid should just contain 40 tiles as per monopoly.
  // Board should take the GameSettingsT as props, as described in the GameContext.

  boardSize?: number;
  cellSize?: number;
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
          <BoardSpace n={i} key={i} />
        ))}
      </Box>
    </BoardPropsContext.Provider>
  );
}
