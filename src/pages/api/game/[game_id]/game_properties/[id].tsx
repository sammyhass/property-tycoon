import { prismaClient } from '@/lib/prisma';
import { supabase } from '@/lib/supabase';
import { NextApiHandler } from 'next';

const handler: NextApiHandler = async (req, res) => {
  switch (req.method) {
    case 'DELETE':
      handleDELETE(req, res);
  }
};

// Deleting game properties
const handleDELETE: NextApiHandler = async (req, res) => {
  const { user, error } = await supabase.auth.api.getUser(
    req.cookies['sb:token']
  );
  if (error) {
    res.status(401).json({ error: error.message });
    return;
  }

  const { id, game_id } = req.query;
  if (!id || !game_id) {
    res.status(400).json({ error: 'Missing required query parameters' });
    return;
  }

  const { count } = await prismaClient.gameProperty.deleteMany({
    where: {
      id: id as string,
      game_id: game_id as string,
    },
  });

  if (count === 0) {
    res.status(404).json({ error: 'Game Property not found' });
    return;
  }

  res.status(200).json({ message: 'Game Property deleted' });
};

export default handler;
