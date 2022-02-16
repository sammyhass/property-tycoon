import { prismaClient } from '@/lib/prisma';
import { supabase } from '@/lib/supabase';
import Joi from 'joi';
import { NextApiHandler } from 'next';

// Set and get the active game
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

const postSchema = Joi.object().keys({
  game_id: Joi.string().required(),
});
const handlePOST: NextApiHandler = async (req, res) => {
  const { user } = await supabase.auth.api.getUser(req.cookies['sb:token']);
  if (!user) return res.status(401).send('Unauthorized');

  const { error } = await postSchema.validate(req.body);
  if (error) throw error;

  const gameId = req.body.game_id as string;

  // set other games to inactive for this user
  await prismaClient.game.updateMany({
    where: {
      AND: [
        {
          user_id: user.id,
          id: {
            not: gameId,
          },
        },
      ],
    },
    data: {
      active: null,
    },
  });

  // set this game to active
  await prismaClient.game.update({
    where: {
      id: gameId,
    },
    data: {
      active: true,
    },
  });

  res.status(200).json({
    message: 'Game set to active',
  });
};

const handleGET: NextApiHandler = async (_req, res) => {
  const game = await prismaClient.game.findUnique({
    where: {
      active: true,
    },
    include: {
      BoardSpaces: true,
      PropertyGroups: true,
      CardActions: true,
      Properties: true,
    },
  });

  res.status(200).json(game);
};

export default handler;
