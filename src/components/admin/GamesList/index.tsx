import { Box, Flex, Heading, Link, LinkBox } from '@chakra-ui/react';
import { game } from '@prisma/client';
import React from 'react';

interface GameListProps {
  games: game[];
}

export default function GamesList({ games }: GameListProps) {
  const activeGame = games.find(game => game.active);
  return (
    <>
      <Heading textAlign={'center'}>Your Game Boards</Heading>
      <Flex direction={'column'} w="600px" mx="auto">
        {activeGame ? (
          <GamesList.GameItem {...activeGame} />
        ) : (
          <Box p="10px">No Active Game</Box>
        )}
        {games
          .filter(g => !g.active)
          .map(game => (
            <GamesList.GameItem key={game.id} {...game} />
          ))}
      </Flex>
    </>
  );
}

GamesList.GameItem = function GameItem({ created_at, name, id, active }: game) {
  return (
    <LinkBox>
      <Link href={`/admin/games/${id}`}>
        <Box
          p="10px"
          borderRadius={'8px'}
          _hover={{
            background: '#eee',
          }}
        >
          <Flex align={'center'}>
            <Box>
              <Heading size="sm">{name}</Heading>
              <Heading size="sm" color={!active ? 'red.500' : 'green.500'}>
                {active ? 'Active' : 'Inactive'}
              </Heading>
            </Box>
            <Box ml={'auto'}>{created_at?.toDateString()}</Box>
          </Flex>
        </Box>
      </Link>
    </LinkBox>
  );
};
