import { prismaClient } from '@/lib/prisma';
import { supabase } from '@/lib/supabase';
import { CardAction } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import Joi from 'joi';
import { NextApiHandler } from 'next';

const postSchema =
  Joi.object<
    Pick<
      CardAction,
      'property_id' | 'cost' | 'title' | 'action_type' | 'description' | 'type'
    >
  >();

// Handles game card creation
const handlePOST: NextApiHandler = async (req, res) => {
  const gameId = req.query.game_id as string;

  const { value, error } = postSchema.validate(req.body);
  if (!value || error) {
    res.status(400).json({
      message: error?.message,
    });
    return;
  }

  try {
    const card = await prismaClient.cardAction.create({
      data: {
        game_id: gameId,
        title: value.title,
        type: value.type,
        action_type: value.action_type,
        cost: value.cost,
        property_id: value.property_id,
        description: value.description,
      },
    });
    res.status(200).json(card);
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError) {
      res.status(500).json({
        message: e.message,
      });
    } else {
      throw e;
    }
  }
};

const handleDELETE: NextApiHandler = async (req, res) => {
  const gameId = req.query.game_id as string;

  const cardId = req.body.card_id as string;

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
  const user = await supabase.auth.api.getUserByCookie(req);

  if (!user) {
    res.status(401).json({
      message: 'Unauthorized',
    });
    return;
  }

  switch (req.method) {
    case 'POST':
      await handlePOST(req, res);
      break;
    case 'DELETE':
      await handleDELETE(req, res);
      break;
    default:
      break;
  }
};

export default handler;
