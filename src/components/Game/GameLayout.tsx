import { TOKENS_MAP, TokenType, useGameContext } from '@/hooks/useGameContext';
import {
  Avatar,
  AvatarBadge,
  Box,
  Collapse,
  Flex,
  IconButton,
  Text,
} from '@chakra-ui/react';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
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
          <GamePlayersDisplay />
        </Box>
      )}
    </>
  );
}

const GamePlayersDisplay = () => {
  const { players, currentPlayer } = useGameContext();

  const [selectedPlayer, setSelectedPlayer] = useState<TokenType | undefined>();

  useEffect(() => {
    setSelectedPlayer(currentPlayer?.token);
  }, [currentPlayer]);

  return (
    <Flex
      mt="10px"
      zIndex={'100'}
      gap="5px"
      borderRadius={'8px'}
      minH="100px"
      pos="sticky"
      p="20px"
      bottom="10px"
      w="95%"
      mx="auto"
      overflowX="auto"
      align={'flex-end'}
    >
      {players.map(player => (
        <Flex
          key={player.token}
          onClick={() =>
            setSelectedPlayer(
              selectedPlayer !== player.token ? player.token : undefined
            )
          }
          cursor="pointer"
        >
          <IconButton
            isRound
            transform={
              selectedPlayer === player.token
                ? 'translateY(-10px)'
                : 'translateY(0px)'
            }
            transition="all 0.2s ease-in-out"
            sx={{
              '&:hover, &:active, &:focus': {
                outline: 'none',
                boxShadow: 'none',
              },
            }}
            icon={
              <Avatar
                bg={'white'}
                boxShadow="md"
                icon={
                  <Text m="0" fontSize={'2xl'}>
                    {TOKENS_MAP[player.token]}
                  </Text>
                }
              >
                {selectedPlayer === player.token && (
                  <AvatarBadge
                    borderColor="green.100"
                    boxSize={'1.6rem'}
                    bg="green"
                  />
                )}
              </Avatar>
            }
            aria-label={player.name}
          />
        </Flex>
      ))}

      <Collapse in={!!selectedPlayer}>
        <AnimatePresence>
          {selectedPlayer && (
            <motion.div exit={{ opacity: 0 }}>
              <PlayerState token={selectedPlayer} />
            </motion.div>
          )}
        </AnimatePresence>
      </Collapse>
    </Flex>
  );
};
