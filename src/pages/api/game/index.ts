import { prismaClient } from '@/lib/prisma';
import { board_space, space_type } from '@prisma/client';
import Joi from 'joi';
import { NextApiHandler } from 'next';

// api/game
const handler: NextApiHandler = (req, res) => {
  switch (req.method) {
    case 'GET':
      handleGET(req, res);
      break;
    case 'POST':
      handlePOST(req, res);
      break;
    case 'PUT':
      handlePUT(req, res);
      break;
  }
};

const handleGET: NextApiHandler = async (_req, res) => {
  const games = await prismaClient.game.findMany({
    select: {
      id: true,
      name: true,
      created_at: true,
      board_spaces: true,
      property_groups: true,
      game_cards: true,
      game_properties: true,
    },
  });

  res.status(200).json(games);
};

const postSchema = Joi.object().keys({
  name: Joi.string().required(),
});

const handlePOST: NextApiHandler = async (req, res) => {
  const { error } = postSchema.validate(req.body);
  if (error) throw error;

  const spaces: Pick<board_space, 'board_position' | 'space_type'>[] = [
    {
      board_position: 0,
      space_type: space_type.GO,
    },

    {
      board_position: 11,
      space_type: space_type.JUST_VISIT,
    },
    {
      board_position: 21,
      space_type: space_type.FREE_PARKING,
    },
    {
      board_position: 31,
      space_type: space_type.GO_TO_JAIL,
    },
  ];

  const otherSpaces = new Array(39).fill(0).map((_, i) => ({
    board_position: i + 1,
    space_type: space_type.EMPTY,
  }));

  const game = await prismaClient.game.create({
    data: {
      name: req.body.name,
      board_spaces: {
        createMany: {
          skipDuplicates: true,
          data: [...spaces, ...otherSpaces].sort(
            (a, b) => a.board_position - b.board_position
          ),
        },
      },
    },
  });

  res.status(200).json(game);
};
const handlePUT: NextApiHandler = async (_req, res) => {
  throw new Error('Method not implemented.');
};

export default handler;
