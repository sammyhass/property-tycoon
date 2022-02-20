import { useGameContext } from '@/hooks/useGameContext';
import { Box } from '@chakra-ui/react';
import React from 'react';
import BoardSpaceView from './BoardSpace';

interface BoardProps {
  onTileClick?: (n: number) => void;
}

export default function Board({ onTileClick }: BoardProps) {
  const { gameSettings } = useGameContext();

  const spaces = gameSettings?.BoardSpaces;

  return (
    <Box>
      {spaces?.map(space => (
        <BoardSpaceView {...space} key={space.board_position} />
      ))}
    </Box>
  );
}

//     // <Box
//     //   sx={{
//     //     display: 'grid',
//     //     gridTemplateColumns: `repeat(${boardSize}, ${cellSize}px)`,
//     //     gridTemplateRows: `repeat(${boardSize}, ${cellSize}px)`,
//     //     gridGap: 3,
//     //   }}
//     // >
//     //   {/* Dummy element to space out center of grid */}
//     //   <Box
//     //     gridRowStart={2}
//     //     gridRowEnd={boardSize - 2}
//     //     gridColumnStart={2}
//     //     gridColumnEnd={boardSize - 2}
//     //   />
//     //   {new Array(boardSize * 4 - 4).fill(0).map((_, i) => (
//     //     <BoardSpace n={i} key={i} />
//     //   ))}
//     // </Box>
// );
