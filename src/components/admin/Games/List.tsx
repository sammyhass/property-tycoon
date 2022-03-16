import GameNotFound from '@/components/UI/GameNotFound';
import {
  Alert,
  AlertDescription,
  Box,
  Flex,
  Heading,
  LinkBox,
} from '@chakra-ui/react';
import { Game } from '@prisma/client';
import Link from 'next/link';
import React from 'react';

interface GameListProps {
  games: Game[];
}

export default function GamesList({ games }: GameListProps) {
  const activeGame = games.find(game => game.active);
  return (
    <>
      <Flex direction={'column'} mx="auto">
        {activeGame ? (
          games.length > 0 ? (
            <GameItem {...activeGame} />
          ) : null
        ) : (
          <Alert status="error" borderRadius={'8px'} my="10px">
            <AlertDescription>No Active Game</AlertDescription>
          </Alert>
        )}
        {games
          .filter(g => !g.active)
          .map(game => (
            <GameItem key={game.id} {...game} />
          ))}
        {games.length === 0 && (
          <GameNotFound
            title="No Games Found"
            message="Create a game to get started"
          />
        )}
      </Flex>
    </>
  );
}

const GameItem = ({ created_at, name, id, active }: Game) => {
  return (
    <Link href={`/admin/games/${id}`} passHref>
      <LinkBox cursor="pointer">
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
      </LinkBox>
    </Link>
  );
};
