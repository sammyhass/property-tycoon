import { supabase } from '@/lib/supabase';
import { NextMiddleware, NextResponse } from 'next/server';

const ERROR_RES = new Response('Unauthorized', {
  status: 401,
  statusText: 'Unauthorized, please login',
});

/**
 * Middleware to check if the user is logged in
 */
const authMiddleware: NextMiddleware = async (req, ev) => {
  const token = req.cookies['sb:token'];

  if (!token) {
    return ERROR_RES;
  }

  const { data, error } = await supabase.auth.api.getUser(token);

  if (data) {
    req.cookies.user = JSON.stringify(data);
    return NextResponse.next();
  } else {
    return ERROR_RES;
  }
};

export default authMiddleware;
