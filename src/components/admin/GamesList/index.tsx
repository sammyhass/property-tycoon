import { Box, Flex, Heading, Link, LinkBox } from '@chakra-ui/react';
import { game } from '@prisma/client';
import React from 'react';

interface GameListProps {
  games: game[];
}

export default function GamesList({ games }: GameListProps) {
  return (
    <>
      <Heading textAlign={'center'}>Your Games</Heading>
      <Flex direction={'column'} w="600px" mx="auto">
        {games.map(game => (
          <GamesList.GameItem key={game.id} {...game} />
        ))}
      </Flex>
    </>
  );
}

GamesList.GameItem = function GameItem({ created_at, name, id }: game) {
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
          <Flex>
            <Heading size="sm">{name}</Heading>
            <Box ml={'auto'}>{created_at?.toDateString()}</Box>
          </Flex>
        </Box>
      </Link>
    </LinkBox>
  );
};
