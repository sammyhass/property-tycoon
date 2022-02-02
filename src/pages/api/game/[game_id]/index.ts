import { prismaClient } from '@/lib/prisma';
import { isUUID } from 'class-validator';
import { NextApiHandler } from 'next';

// api/game/[id]
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
  const id = req.query.game_id as string;

  if (!isUUID(id)) {
    res.status(400).json({
      message: 'Invalid game id',
    });
  }

  const game = await prismaClient.game.findUnique({ where: { id } });

  if (!game) {
    res.status(404).json({
      message: 'Game not found',
    });
  }

  return res.status(200).json(game);
};

const handlePOST: NextApiHandler = async (req, res) => {
  throw new Error('Method not implemented.');
};
