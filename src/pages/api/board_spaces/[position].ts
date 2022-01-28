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
  const pos = req.query.position;

  try {
    const nId = parseInt(pos as string);
    const space = await prismaClient.board_space.findUnique({
      where: {
        board_position: nId,
      },
    });

    res.status(200).json(space);
  } catch (e) {
    res.status(400).json({
      message: e || 'Bad Request',
    });
  }
};

export default handler;
