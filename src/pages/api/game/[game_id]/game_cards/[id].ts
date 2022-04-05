import { prismaClient } from '@/lib/prisma';
import { NextApiHandler } from 'next';

const handleDELETE: NextApiHandler = async (req, res) => {
  const gameId = req.query.game_id as string;

  const cardId = req.query.id as string;

  if (!cardId) {
    res.status(400).json({
      message: 'Invalid card id',
    });
    return;
  }

  try {
    const card = await prismaClient.cardAction.delete({
      where: {
        id: cardId,
      },
    });
    if (!card) {
      res.status(404).json({
        message: 'Card not found',
      });
    }

    return res.status(200).json(card);
  } catch (e) {
    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};

const handler: NextApiHandler = async (req, res) => {
  switch (req.method) {
    case 'DELETE':
      await handleDELETE(req, res);
      break;
    default:
      res.status(405).json({
        message: 'Method Not Allowed',
      });
      break;
  }
};

export default handler;
