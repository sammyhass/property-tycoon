import { Box } from '@chakra-ui/react';
import { BoardSpace, CardType, SpaceType } from '@prisma/client';
import React from 'react';

function rad(deg: number) {
  return (deg / 180) * Math.PI;
}

const EXAMPLE_SPACES: BoardSpace[] = [
  {
    // SpaceType = SpaceType.TAKE_CARD - take_card field is non-null and contains card type to pick up
    board_position: 0,
    game_id: '',
    created_at: new Date(),
    take_card: CardType.POT_LUCK,
    property_id: '',
    space_type: SpaceType.TAKE_CARD,
    locked: false,
  },
  {
    // SpaceType = FreeParking,
    board_position: 1,
    game_id: '',
    take_card: null,
    created_at: new Date(),
    property_id: null,
    space_type: SpaceType.FREE_PARKING,
    locked: false,
  },
  {
    // SpaceType = Property, property_id will be the id of the property present
    board_position: 2,
    game_id: '',
    take_card: null,
    locked: false,
    created_at: new Date(),
    property_id: '1',
    space_type: SpaceType.PROPERTY,
  },
  {
    // SpaceType = EMPTY, just show empty box
    space_type: 'EMPTY',
    board_position: 3,
    game_id: '',
    take_card: null,
    created_at: new Date(),
    locked: false,
    property_id: null,
  },
];

// Todo: board cell  should take a board_space as props, which will include ALL necessary information to render the correct tile
export default function BoardSpaceView({
  board_position,
  created_at,
  game_id,
  property_id,
  space_type,
  take_card,
}: BoardSpace) {
  return <Box></Box>;
}
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
