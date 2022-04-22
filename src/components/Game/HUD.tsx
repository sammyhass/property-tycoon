import { useGameContext } from '@/hooks/useGameContext';
import { Box, Button, Code, Flex, IconButton } from '@chakra-ui/react';
import {
  faArrowRight,
  faPause,
  faPlay,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect } from 'react';

// Heads-up-display to show in game, displays current player and time
export default function HUD() {
  const { time, endTurn, canEndTurn, isPaused, pause, resume } =
    useGameContext();

  const mins = Math.floor(time / 60);
  const secs = time % 60;

  useEffect(() => {}, []);

  return (
    <>
      <Box zIndex={'modal'} bg="#333" px="10px" pb={canEndTurn ? '10px' : '0'}>
        <Flex py="10px" w="100%" justifyContent={'space-between'}>
          <IconButton
            aria-label={isPaused ? 'Resume' : 'Pause'}
            colorScheme={isPaused ? 'blue' : 'red'}
            onClick={!isPaused ? pause : resume}
            icon={<FontAwesomeIcon icon={!isPaused ? faPause : faPlay} />}
          />
          <GameTimeDisplay />
        </Flex>
        {canEndTurn && (
          <Button
            onClick={endTurn}
            w="100%"
            colorScheme={'green'}
            mt="10px"
            rightIcon={<FontAwesomeIcon icon={faArrowRight} />}
          >
            End Turn
          </Button>
        )}
      </Box>
    </>
  );
}

export const GameTimeDisplay = () => {
  const { time } = useGameContext();

  const mins = Math.floor(time / 60);
  const secs = time % 60;
  return (
    <Box flexShrink={0}>
      <Code fontSize={'2xl'} bg="white">
        {mins}:{secs < 10 ? `0${secs}` : secs}
      </Code>
    </Box>
  );
};
