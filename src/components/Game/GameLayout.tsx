import { useGameContext } from '@/hooks/useGameContext';
import { Box, Flex } from '@chakra-ui/react';
import { AnimatePresence } from 'framer-motion';
import React from 'react';
import Board from './Board';
import GameSetup from './GameSetup';
import PlayerState from './PlayerState';

export default function GameLayout() {
  const { hasStarted, isPaused, gameSettings, state, currentPlayer, players } =
    useGameContext();

  return (
    <>
      {!hasStarted ? (
        <Box mt="50px">
          <GameSetup />
        </Box>
      ) : (
        <Box>
          {/* Board */}
          <AnimatePresence>
            <Board
              settings={gameSettings}
              positions={Object.entries(state).reduce(
                (acc, [key, value]) => ({
                  ...acc,
                  [key]: value.pos,
                }),
                {}
              )}
            />
          </AnimatePresence>
          <Flex
            mt="10px"
            gap="5px"
            borderRadius={'8px'}
            maxW="96%"
            mx="auto"
            overflowX="auto"
            bg="whiteAlpha.900"
          >
            {players.map(player => (
              <PlayerState
                key={player.token}
                isTurn={currentPlayer?.token === player.token}
                token={player.token}
              />
            ))}
          </Flex>
        </Box>
      )}
    </>
  );
}
