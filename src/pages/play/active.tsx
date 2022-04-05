import GameLayout from '@/components/Game/GameLayout';
import Navbar from '@/components/UI/admin/Navbar';
import GameNotFound from '@/components/UI/GameNotFound';
import PlayGameLayout from '@/components/UI/PlayLayout';
import { GameContextProvider } from '@/hooks/useGameContext';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { GameT } from '../admin/games/[game_id]';

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
            <GameLayout />
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
