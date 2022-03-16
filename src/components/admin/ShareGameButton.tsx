import { API_URL } from '@/env/env';
import { Box, Button } from '@chakra-ui/react';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

// If the game is not shared, this button will allow it to be shared.
// otherwise, this button will display the share code and a link to the game.
export default function ShareGameButton({
  gameId,
  shareCode,
}: {
  gameId: string;
  shareCode?: string;
}) {
  const router = useRouter();

  const handleShareGame = async () => {
    const { data } = await axios.post(`${API_URL}/game/${gameId}/share`);

    if (data.shareCode) {
      router.reload();
    }
  };

  return (
    <Box>
      {shareCode ? (
        <Box mt="5px">
          <Link passHref href={`/play/${shareCode}`}>
            <Button
              colorScheme="green"
              leftIcon={<FontAwesomeIcon icon={faCheck} />}
            >
              Play Game: {shareCode}
            </Button>
          </Link>
        </Box>
      ) : (
        <Button mt="5px" colorScheme="blue" onClick={() => handleShareGame()}>
          Share Game
        </Button>
      )}
    </Box>
  );
}
