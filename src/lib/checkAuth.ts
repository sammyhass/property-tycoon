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

export const enforceAuth = <T>(
  inner?: GetServerSideProps<T>
): GetServerSideProps => {
  return async ctx => {
    const { req } = ctx;
    const user = await supabase.auth.api.getUserByCookie(req);
    if (!user.token) {
      return { props: {}, redirect: { destination: '/login' } };
    }

    if (inner) {
      return inner(ctx);
    }

    return { props: {} };
  };
};
