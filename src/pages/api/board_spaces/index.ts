import { prismaClient } from '@/lib/prisma';
import Joi from 'joi';
import { NextApiHandler } from 'next';

// /api/board_space
// (GET, POST)
// Post creates a new board_space, Get returns all board_spaces
const handler: NextApiHandler = async (req, res) => {
  return new Promise(async (resolve, reject) => {
    switch (req.method) {
      case 'GET':
        await handleGET(req, res);
        break;
      case 'POST':
        await handlePOST(req, res);
        break;
    }
    return resolve();
  });
};

const handleGET: NextApiHandler = async (_req, res) => {
  const spaces = await prismaClient.board_space.findMany({
    select: {
      board_position: true,
      space_type: true,
      created_at: true,
      property_id: true,
      game_property: true,
      take_card: true,
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
  // Validate the request body is CreateBoardSpaceDTO
  const { error } = handlePostSchema.validate(req.body);
  if (error) {
    res.status(400).json({
      message: error.message,
    });
    return;
  }

  try {
    const space = await prismaClient.board_space.create({
      data: {
        board_position: req.body.board_position,
        space_type: req.body.space_type,
        property_id: req.body.property_id,
        take_card: req.body.take_card,
      },
    });
    res.status(200).json(space);
  } catch (e) {
    res.status(500).json({ error: e });
  }
};

export default handler;
