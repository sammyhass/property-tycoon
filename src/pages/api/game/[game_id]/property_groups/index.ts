import { prismaClient } from '@/lib/prisma';
import Joi from 'joi';
import { NextApiHandler } from 'next';

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

// Get all property groups for this game
const handleGET: NextApiHandler = async (req, res) => {
  const game_id = req.query.game_id as string;
  const groups = await prismaClient.property_group.findMany({
    where: {
      game_id: game_id,
    },
  });
  res.status(200).json(groups);
};

// Create a new property group for this game
const handlePOST: NextApiHandler = async (req, res) => {
  const game_id = req.query.game_id as string;
  const { error } = Joi.object()
    .keys({
      color: Joi.string().required(),
      house_cost: Joi.number().required(),
      hotel_cost: Joi.number().required(),
    })
    .validate(req.body);
  if (error) {
    res.status(400).json({
      message: error.message,
    });
    return;
  }

  const group = await prismaClient.property_group.create({
    data: {
      game_id: game_id,
      color: req.body.color,
      hotel_cost: req.body.hotel_cost,
      house_cost: req.body.house_cost,
    },
  });
  res.status(200).json(group);
};

export default handler;
