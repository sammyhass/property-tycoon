import Board from '@/components/Game/Board';
import GameSetup from '@/components/Game/GameSetup';
import HUD from '@/components/Game/HUD';
import PlayerState from '@/components/Game/PlayerState';
import Navbar from '@/components/UI/admin/Navbar';
import GameNotFound from '@/components/UI/GameNotFound';
import PlayGameLayout from '@/components/UI/PlayLayout';
import { GameContextProvider, useGameContext } from '@/hooks/useGameContext';
import { Box, Flex } from '@chakra-ui/react';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { GameT } from '../admin/games/[game_id]';

/**
 * Page where game is played and setup.
 */
export function PlayPageInner() {
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
          <Box>
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
          <Flex mt="10px" gap="5px" maxW="95%" mx="auto" overflowX="auto">
            {players.map(player => (
              <PlayerState
                key={player.token}
                isTurn={currentPlayer?.token === player.token}
                token={player.token}
              />
            ))}
          </Flex>
          <Box>
            <Box pos="fixed" bottom={'15px'} right="15px">
              <HUD />
            </Box>
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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGame = async () => {
      axios
        .get('/api/active', {
          validateStatus: s => s === 200,
        })
        .then(({ data }) => {
          setGame(data as GameT);
          setLoading(false);
        })
        .catch(e => {
          setError(e.response.data);
          setLoading(false);
        });
    };

    fetchGame();
  }, []);

  return (
    <PlayGameLayout>
      <Navbar />
      {!loading ? (
        !error && game ? (
          <GameContextProvider initialGameSettings={game}>
            <PlayPageInner />
          </GameContextProvider>
        ) : (
          <GameNotFound message={error ?? ''} title="Whoops!" />
        )
      ) : (
        <></>
      )}
    </PlayGameLayout>
  );
}
