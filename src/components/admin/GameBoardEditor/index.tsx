import { Flex } from '@chakra-ui/react';
import { board_space, game, space_type } from '@prisma/client';
import React from 'react';

const spaceTypeColors: Record<space_type, string> = {
  [space_type.GO]: 'green.500',
  [space_type.GO_TO_JAIL]: 'red.500',
  [space_type.FREE_PARKING]: 'blue.500',
  [space_type.PROPERTY]: 'white',
  [space_type.EMPTY]: 'white',
  TAKE_CARD: 'white',
  JUST_VISIT: 'orange.500',
};

const loudSpaceTypes: space_type[] = [
  'GO',
  'FREE_PARKING',
  'GO_TO_JAIL',
  'JUST_VISIT',
];

/*
 Where the admin can choose which properties add in which board_space
*/
export default function GameBoardEditor({
  game,
  board_spaces,
}: {
  game: game;
  board_spaces: board_space[];
}) {
  return (
    <Flex direction={'column'} maxW={'100%'}>
      <Flex w="100%">
        {/*
					Todo: Render game board spaces
				*/}
      </Flex>
    </Flex>
  );
}
