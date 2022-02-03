import { AuthProvider } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { ChakraProvider } from '@chakra-ui/react';
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
import type { AppProps } from 'next/app';
import { Provider } from 'react-supabase';
import { GameContextProvider } from '../hooks/useGameContext';
import '../styles/globals.css';

config.autoAddCss = false;

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider resetCSS={true}>
      <Provider value={supabase}>
        <AuthProvider>
          <GameContextProvider>
            <Component {...pageProps} />
          </GameContextProvider>
        </AuthProvider>
      </Provider>
    </ChakraProvider>
  );
}

export default MyApp;
