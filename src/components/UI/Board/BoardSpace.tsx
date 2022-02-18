import { Box } from '@chakra-ui/react';
import React from 'react';
import { useBoardProps } from './Board';

function rad(deg: number) {
  return (deg / 180) * Math.PI;
}

// Todo: board cell  should take a board_space as props, which will include ALL necessary information to render the correct tile
export default function BoardSpace({ n }: { n: number }) {
  const { onTileClick, boardSize, cellSize } = useBoardProps();

  // let boardRadius = (boardSize - 1) / 2;
  // let totalCells = boardSize * 4 - 4;
  // let boardSqr = boardRadius * Math.sqrt(2);

  // function calculateRow(n: number) {
  //   return Math.round(
  //     Math.min(
  //       Math.max(
  //         boardSqr * Math.sin(rad((n / totalCells) * 360 - 135)) + boardRadius,
  //         0
  //       ),
  //       boardSize - 1
  //     )
  //   );
  // }

  // function calculateColumn(n: number) {
  //   return Math.round(
  //     Math.min(
  //       Math.max(
  //         boardSqr * Math.cos(rad((n / totalCells) * 360 - 135)) + boardRadius,
  //         0
  //       ),
  //       boardSize - 1
  //     )
  //   );
  // }

  // return (
  //   <Box
  //     gridRow={calculateRow(n) + 1}
  //     gridColumn={calculateColumn(n) + 1}
  //     minH={'70px'}
  //     w={`${cellSize}px`}
  //     _hover={{
  //       transform: `scale(1)`,
  //     }}
  //     bg="blue"
  //     onClick={() => onTileClick && onTileClick(n)}
  //   >
  //     <Text>{n + 1}</Text>
  //   </Box>
  // );

  return <Box>{n}</Box>;
}
