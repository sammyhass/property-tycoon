import { AuthProvider } from '@/hooks/useAuth';
import { ChakraProvider } from '@chakra-ui/react';
import type { AppProps } from 'next/app';
import { GameContextProvider } from '../hooks/useGameContext';
import '../styles/globals.css';

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
