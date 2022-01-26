import { ChakraProvider } from '@chakra-ui/react';
import type { AppProps } from 'next/app';
import { GameContextProvider } from '../hooks/useGameContext';
import '../styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider resetCSS={true}>
      <GameContextProvider>
        <Component {...pageProps} />
      </GameContextProvider>
    </ChakraProvider>
  );
}

export default MyApp;
