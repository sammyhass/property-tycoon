import { prismaClient } from '@/lib/prisma';
import { NextApiHandler } from 'next';

const handler: NextApiHandler = async (req, res) => {
  switch (req.method) {
    case 'GET':
      await handleGET(req, res);
      break;
  }
};

const handleGET: NextApiHandler = async (req, res) => {
  const game_id = req.query.game_id as string;
  const pos = req.query.position;

  try {
    const nId = parseInt(pos as string);
    const space = await prismaClient.board_space.findFirst({
      where: {
        board_position: nId,
        game_id,
      },
    });

    res.status(200).json(space);
  } catch (e: any) {
    res.status(400).json({
      message: e.message || 'Bad Request',
    });
  }
};

export default handler;
