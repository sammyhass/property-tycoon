import { prismaClient } from '@/lib/prisma';
import { randomBytes } from 'crypto';
import { NextApiHandler } from 'next';

// Handle Share Codes for a Game
const handler: NextApiHandler = async (req, res) => {
  switch (req.method) {
    case 'POST':
      await handlePOST(req, res);
      break;
    case 'PUT':
      throw new Error('Method not implemented.');
  }
};

const handlePOST: NextApiHandler = async (req, res) => {
  // Generate sharecode for game as base64 string of 12, must be alphanumeric only
  let isValidShareCode = false;
  let shareCode = '';
  while (!isValidShareCode) {
    shareCode = randomBytes(12).toString('base64');
    const game = await prismaClient.game.findUnique({
      where: {
        share_code: shareCode,
      },
    });
    if (!game) {
      isValidShareCode = true;
    }
  }

  // Update game with share code
  await prismaClient.game.update({
    where: {
      id: req.query.game_id as string,
    },
    data: {
      share_code: shareCode,
    },
  });

  return res.status(200).json({
    code: shareCode,
  });
};

export default handler;
