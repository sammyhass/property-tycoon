import { supabase } from '@/lib/supabase';
import { NextApiHandler } from 'next';

const handler: NextApiHandler = (req, res) => {
  supabase.auth.api.setAuthCookie(req, res);
};

export default handler;
