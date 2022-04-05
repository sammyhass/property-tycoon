import { prismaClient } from '@/lib/prisma';
import { GameProperty } from '@prisma/client';
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

const postSchema =
  Joi.object<
    Pick<
      GameProperty,
      | 'name'
      | 'price'
      | 'property_group_color'
      | 'rent_unimproved'
      | 'rent_four_house'
      | 'rent_one_house'
      | 'rent_two_house'
      | 'rent_hotel'
      | 'rent_three_house'
    >
  >();

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
      rent_one_house: req.body.rent_one_house,
      rent_two_house: req.body.rent_two_house,
      rent_three_house: req.body.rent_three_house,
      rent_four_house: req.body.rent_four_house,
      rent_unimproved: req.body.rent_unimproved,
      rent_hotel: req.body.rent_hotel,
    },
  });
  res.status(200).json(gameProperty);
};

export default handler;
