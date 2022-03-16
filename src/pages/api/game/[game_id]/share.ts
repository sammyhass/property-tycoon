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

// Handle POST requests - create a new share code for a game
const handlePOST: NextApiHandler = async (req, res) => {
  let isValidShareCode = false;
  let shareCode = '';
  while (!isValidShareCode) {
    shareCode = randomBytes(12).toString('base64url');
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
