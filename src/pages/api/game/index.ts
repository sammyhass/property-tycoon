import { prismaClient } from '@/lib/prisma';
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
  console.log(req.body);
  const { error } = postSchema.validate(req.body);
  if (error) throw error;

  const game = await prismaClient.game.create({
    data: {
      name: req.body.name,
    },
  });
  res.status(200).json(game);
};
const handlePUT: NextApiHandler = async (_req, res) => {
  throw new Error('Method not implemented.');
};

export default handler;
