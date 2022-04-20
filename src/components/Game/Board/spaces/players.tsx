import { TokenType, useGameContext } from '@/hooks/useGameContext';
import { Box, Flex, Stack, Wrap } from '@chakra-ui/react';
import { SpaceType } from '@prisma/client';
import React, { useMemo } from 'react';
import PlayerToken from '../players';

type BoardSpacePlayersProps = {
  players: TokenType[];
  space_type?: SpaceType;
};

// Renders player tokens on a space in a circle
export default function BoardSpacePlayers({
  players,
  space_type,
}: BoardSpacePlayersProps) {
  const { state } = useGameContext();
  const isJail = space_type === 'JUST_VISIT';

  const playersInJail = useMemo(() => {
    return players.filter(player => {
      return state[player]?.inJail ?? false;
    });
  }, [players]);

  const playersNotInJail = useMemo(() => {
    return players.filter(player => {
      return !(state[player]?.inJail ?? false);
    });
  }, [players]);

  return (
    <Flex
      pos={'absolute'}
      top={0}
      left={0}
      right={0}
      wrap="wrap"
      bottom={0}
      justify={isJail ? 'flex-start' : 'center'}
      align={'center'}
      zIndex={100}
    >
      {isJail ? (
        <>
          <Stack
            w="3.5rem"
            maxW="60px"
            align="center"
            // spacing should go down as the number of players increases
            spacing={playersNotInJail.length <= 4 ? '-5px' : '-20px'}
            h="100%"
            justify={'center'}
          >
            {playersNotInJail.map(player => (
              <PlayerToken
                key={player}
                token={player}
                layoutId={`player-${player}`}
              />
            ))}
          </Stack>

          <Box w="7.5rem" pos="relative" top="10px" left="0px">
            <Wrap
              w={'100%'}
              spacing={playersInJail.length <= 4 ? '-5px' : '-20px'}
              mt="30px"
              align={'center'}
              justify={'center'}
            >
              {playersInJail.map(player => {
                return <BoardSpacePlayer key={player} token={player} />;
              })}
            </Wrap>
          </Box>
        </>
      ) : (
        <>
          {players.map(player => {
            return <BoardSpacePlayer key={player} token={player} />;
          })}
        </>
      )}
    </Flex>
  );
}

function BoardSpacePlayer({ token }: { token: TokenType }) {
  return (
    <Box>
      <PlayerToken token={token} key={token} layoutId="board-space-player" />
    </Box>
  );
}
