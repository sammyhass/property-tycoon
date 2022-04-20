import { prismaClient } from '@/lib/prisma';
import { supabase } from '@/lib/supabase';
import { BoardSpace, SpaceType } from '@prisma/client';
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
      BoardSpaces: true,
      PropertyGroups: true,
      CardActions: true,
      Properties: true,
    },
  });

  res.status(200).json(games);
};

const postSchema = Joi.object().keys({
  name: Joi.string().required(),
  starting_money: Joi.number().required(),
});

const handlePOST: NextApiHandler = async (req, res) => {
  const { data, user } = await supabase.auth.api.getUserByCookie(req);

  if (!user) {
    res.status(401).json({
      message: 'Unauthorized',
    });
    return;
  }

  console.log(data);

  const { error } = postSchema.validate(req.body);
  if (error) throw error;

  const spaces: Pick<BoardSpace, 'board_position' | 'space_type' | 'locked'>[] =
    [
      {
        board_position: 1,
        space_type: SpaceType.GO,
        locked: true,
      },

      {
        board_position: 11,
        space_type: SpaceType.JUST_VISIT,
        locked: true,
      },
      {
        board_position: 21,
        space_type: SpaceType.FREE_PARKING,
        locked: true,
      },
      {
        board_position: 31,
        space_type: SpaceType.GO_TO_JAIL,
        locked: true,
      },
    ];

  const otherSpaces: typeof spaces = new Array(40).fill(0).map((_, i) => ({
    board_position: i + 1,
    space_type: SpaceType.EMPTY,
    locked: false,
  }));

  const game = await prismaClient.game.create({
    data: {
      user_id: user.id,
      name: req.body.name,
      starting_money: req.body.starting_money,
      BoardSpaces: {
        createMany: {
          skipDuplicates: true,
          data: [...spaces, ...otherSpaces].sort(
            (a, b) => a.board_position - b.board_position
          ),
        },
      },
    },
  });
  res.status(200).json(game);
};
const handlePUT: NextApiHandler = async (_req, res) => {
  throw new Error('Method not implemented.');
};

export default handler;
