import { prismaClient } from '@/lib/prisma';
import { BoardSpace } from '@prisma/client';
import Joi from 'joi';
import { NextApiHandler } from 'next';

const handler: NextApiHandler = async (req, res) => {
  switch (req.method) {
    case 'POST':
      await handlePOST(req, res);
      break;
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
    const space = await prismaClient.boardSpace.findFirst({
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

const postSchema =
  Joi.object<
    Pick<BoardSpace, 'take_card' | 'space_type' | 'property_id' | 'tax_cost'>
  >();
const handlePOST: NextApiHandler = async (req, res) => {
  const game_id = req.query.game_id as string;
  const pos = req.query.position;

  console.log(req.body);

  const { error } = postSchema.validate(req.body);
  if (error) {
    res.status(400).json({
      message: error.message || 'Bad Request',
    });
    return;
  }

  try {
    const nId = parseInt(pos as string);
    const space = await prismaClient.boardSpace.update({
      where: {
        board_position_game_id: {
          board_position: nId,
          game_id,
        },
      },
      data: {
        take_card: req.body.take_card ?? null,
        space_type: req.body.space_type,
        property_id: req.body.property_id ?? null,
        tax_cost: req.body.tax_cost ?? null,
      },
    });
    res.status(200).json(space);
    return;
  } catch (e: any) {
    res.status(400).json({
      message: e.message || 'Bad Request',
    });
    return;
  }
};

export default handler;
