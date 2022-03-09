import Board from '@/components/Board';
import GameSetup from '@/components/GameSetup';
import Navbar from '@/components/UI/admin/Navbar';
import PlayGameLayout from '@/components/UI/PlayLayout';
import { useGameContext } from '@/hooks/useGameContext';
import { Box } from '@chakra-ui/react';
import React from 'react';

/**
 * Page where game is played and setup.
 */
export default function PlayPage() {
  const { hasStarted, isPaused, gameSettings } = useGameContext();

  return (
    <PlayGameLayout>
      <Navbar />
      {!hasStarted ? (
        <Box mt="50px">
          <GameSetup />
        </Box>
      ) : (
        <Box>
          {/* Board */}
          <Box bg="white">
            <Board settings={gameSettings} />
          </Box>
        </Box>
      )}
    </PlayGameLayout>
  );
}
