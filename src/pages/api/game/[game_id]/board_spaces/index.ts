import { prismaClient } from '@/lib/prisma';
import Joi from 'joi';
import { NextApiHandler } from 'next';

// /api/game/[game_id]/board_space
// (GET, POST)
//  - Post creates a new board_space in the game
//  - Get returns all board_spaces.
const handler: NextApiHandler = async (req, res) => {
  switch (req.method) {
    case 'GET':
      await handleGET(req, res);
      break;
    case 'POST':
      await handlePOST(req, res);
      break;
    case 'PUT':
      throw new Error('Method not implemented.');
  }
};

const handleGET: NextApiHandler = async (req, res) => {
  const game_id = req.query.game_id as string;
  const spaces = await prismaClient.board_space.findMany({
    select: {
      board_position: true,
      space_type: true,
      created_at: true,
      property_id: true,
      game_property: true,
      take_card: true,
    },
    where: {
      game_id,
    },
  });

  res.status(200).json(spaces);
};

const handlePostSchema = Joi.object()
  .keys({
    board_position: Joi.number().required(),
    space_type: Joi.string().required(),
    property_id: Joi.string(),
    take_card: Joi.string(),
  })
  .xor('property_id', 'take_card');

const handlePOST: NextApiHandler = async (req, res) => {
  const gameId = req.query.game_id as string;

  const { error } = handlePostSchema.validate(req.body);
  if (error) {
    res.status(400).json({
      message: error.message,
    });
    return;
  }
  const space = await prismaClient.board_space.create({
    data: {
      game_id: gameId,
      board_position: req.body.board_position,
      space_type: req.body.space_type,
      property_id: req.body.property_id,
      take_card: req.body.take_card,
    },
  });
  res.status(200).json(space);
};

export default handler;
