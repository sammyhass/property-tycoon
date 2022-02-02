import { AuthProvider } from '@/hooks/useAuth';
import { ChakraProvider } from '@chakra-ui/react';
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
import type { AppProps } from 'next/app';
import { GameContextProvider } from '../hooks/useGameContext';
import '../styles/globals.css';

config.autoAddCss = false;

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider resetCSS={true}>
      <AuthProvider>
        <GameContextProvider>
          <Component {...pageProps} />
        </GameContextProvider>
      </AuthProvider>
    </ChakraProvider>
  );
}

export default MyApp;
