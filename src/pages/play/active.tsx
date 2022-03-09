import Board from '@/components/Board';
import GameSetup from '@/components/GameSetup';
import Navbar from '@/components/UI/admin/Navbar';
import PlayGameLayout from '@/components/UI/PlayLayout';
import { GameContextProvider, useGameContext } from '@/hooks/useGameContext';
import { Box } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { GameT } from '../admin/games/[game_id]';

/**
 * Page where game is played and setup.
 */
export function PlayPageInner() {
  const { hasStarted, isPaused, gameSettings, state } = useGameContext();
  console.log(state);

  return (
    <>
      {!hasStarted ? (
        <Box mt="50px">
          <GameSetup />
        </Box>
      ) : (
        <Box>
          {/* Board */}
          <Box bg="white">
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
          </Box>
        </Box>
      )}
    </>
  );
}

export default function PlayPage() {
  // Main play page just uses the active game, so we can fetch it from the api
  const [game, setGame] = useState<GameT | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGame = async () => {
      const response = await fetch('/api/active');
      const game = (await response.json()) as GameT;
      setGame(game);
      setLoading(false);
    };

    fetchGame();
  }, []);

  return (
    <PlayGameLayout>
      <Navbar />
      {!loading ? (
        <GameContextProvider initialGameSettings={game}>
          <PlayPageInner />
        </GameContextProvider>
      ) : (
        <></>
      )}
    </PlayGameLayout>
  );
}
