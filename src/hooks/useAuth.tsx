import { supabase } from '@/lib/supabase';
import { ApiError, User } from '@supabase/supabase-js';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface IAuthContext {
  isAuthenticated: boolean;
  user: User | null;
  signIn: (
    email: string,
    next?: string
  ) => Promise<{
    user: User | null;
    error: ApiError | null;
  }>;
  signOut: () => Promise<void>;
  isLoading: boolean;
}
const AuthContext = createContext<IAuthContext>({
  isAuthenticated: false,
  user: null,
  signIn: async () => {
    return {
      error: null,
      user: null,
    };
  },
  signOut: async () => {},
  isLoading: false,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const signIn = async (email: string, next?: string) => {
    setIsLoading(true);
    const { user, error } = await supabase.auth.signIn(
      { email },
      {
        ...(next && { redirectTo: next }),
      }
    );
    if (user) {
      setIsAuthenticated(true);
      setUser(supabase?.auth.user);
    }
    setIsLoading(false);

    return { user, error };
  };

  const signOut = async () => {
    setIsLoading(true);
    const { error } = await supabase.auth.signOut();
    if (!error) {
      setIsAuthenticated(false);
      setUser(null);
    }
    setIsLoading(false);
  };
  useEffect(() => {
    const { data: authListener } = supabase?.auth.onAuthStateChange(
      (event, session) => {
        if (session) {
          setIsAuthenticated(true);
          setUser(session.user);
        }
      }
    ) ?? { data: null };

    return () => {
      authListener?.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        user,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
