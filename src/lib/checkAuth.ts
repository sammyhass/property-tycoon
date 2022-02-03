import { User } from '@supabase/supabase-js';
import { GetServerSideProps } from 'next';
import { supabase } from './supabase';

export const checkAuth = (req: Request) => {
  try {
    const user = supabase.auth.api.getUserByCookie(req);
    if (user) {
      return user;
    }
  } catch (e) {
    return null;
  }
  return null;
};

// Enforce auth can be used on getServerSideProps only
// - use it to check the user is logged in and load the user data into the request cookies
export const enforceAuth = (
  inner?: (user: User) => GetServerSideProps
): GetServerSideProps => {
  return async ctx => {
    const { req, res } = ctx;
    const auth = await supabase.auth.api.getUserByCookie(req);
    if (!auth.token || !auth.user) {
      return { props: {}, redirect: { destination: '/login' } };
    }

    if (inner) {
      return inner(auth.user)(ctx);
    }

    return { props: {} };
  };
};
