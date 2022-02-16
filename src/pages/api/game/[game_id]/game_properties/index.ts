import { prismaClient } from '@/lib/prisma';
import Joi from 'joi';
import { NextApiHandler } from 'next';

// /api/game/[game_id]/game_properties
// POST creates a new game_property for the game
// GET returns all game_properties for the game
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
  let gameId = req.query.game_id as string;
  const gameProperties = await prismaClient.gameProperty.findMany({
    where: {
      game_id: gameId,
    },
  });
  res.status(200).json(gameProperties);
};

const postSchema = Joi.object().keys({
  name: Joi.string().required(),
  price: Joi.number().required(),
  property_group_color: Joi.string().required(),
});

const handlePOST: NextApiHandler = async (req, res) => {
  const { error } = await postSchema.validate(req.body);
  if (error) {
    res.status(400).json({
      message: error.message,
    });
    return;
  }

  const gameId = req.query.game_id as string;
  const gameProperty = await prismaClient.gameProperty.create({
    data: {
      game_id: gameId,
      name: req.body.name,
      price: req.body.price,
      property_group_color: req.body.property_group_color,
    },
  });
  res.status(200).json(gameProperty);
};

export default handler;
