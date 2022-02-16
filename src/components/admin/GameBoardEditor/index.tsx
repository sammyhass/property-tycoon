import { Flex } from '@chakra-ui/react';
import { BoardSpace, Game, SpaceType } from '@prisma/client';
import React from 'react';

const spaceTypeColors: Record<SpaceType, string> = {
  [SpaceType.GO]: 'green.500',
  [SpaceType.GO_TO_JAIL]: 'red.500',
  [SpaceType.FREE_PARKING]: 'blue.500',
  [SpaceType.PROPERTY]: 'white',
  [SpaceType.EMPTY]: 'white',
  TAKE_CARD: 'white',
  JUST_VISIT: 'orange.500',
};

const loudSpaceTypes: SpaceType[] = [
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
  game: Game;
  board_spaces: BoardSpace[];
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
