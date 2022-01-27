import { definitions } from '../types/db-types';
import { prisma } from './prisma';

type BoardSpaceT = definitions['board_space'];

export const getBoard = async () => {
  const spaces = await prisma.board_space.findMany({
    select: {
      board_position: true,
      id: true,
      space_type: true,
      property: true,
      game_property: true,
      take_card: true,
    },
  });

  return JSON.parse(JSON.stringify(spaces));
};
