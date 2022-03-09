import { TOKENS_MAP, TokenType, useGameContext } from '@/hooks/useGameContext';
import {
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  IconButton,
  Input,
  Select,
  Text,
} from '@chakra-ui/react';
import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useCallback, useState } from 'react';

export default function GameSetup() {
  const { setHasStarted, gameSettings, addPlayer, players, removePlayer } =
    useGameContext();

  const [newPlayerName, setNewPlayerName] = useState('');
  const [newPlayerToken, setNewPlayerToken] = useState<TokenType>(
    Object.keys(TOKENS_MAP)[0] as TokenType
  );

  const onAddPlayer = useCallback(() => {
    addPlayer({
      name: newPlayerName,
      token: newPlayerToken as TokenType,
    });
    setNewPlayerName('');

    // attempt to set the token to the next one in the list
    const nextToken = Object.keys(TOKENS_MAP)[
      Object.keys(TOKENS_MAP).indexOf(newPlayerToken) + 1
    ] as TokenType;

    if (nextToken) {
      setNewPlayerToken(nextToken);
    }
  }, [newPlayerName, newPlayerToken, addPlayer]);

  return (
    <Box
      shadow={'md'}
      borderRadius="8px"
      p="20px"
      maxW="90%"
      mx="auto"
      bg="white"
    >
      <Heading size="xl">Game Setup</Heading>
      <Divider />
      <Box p="10px">
        <form
          onSubmit={e => {
            e.preventDefault();
            onAddPlayer();
          }}
        >
          <Flex my="10px" gap="10px">
            <FormControl isInvalid={!newPlayerName}>
              <FormLabel>Player Name</FormLabel>
              <Input
                placeholder="Player Name"
                value={newPlayerName}
                onChange={e => setNewPlayerName(e.target.value)}
              />
            </FormControl>
            <FormControl isInvalid={!newPlayerToken}>
              <FormLabel>Player Token</FormLabel>
              <Select
                defaultValue={newPlayerToken}
                value={newPlayerToken}
                onChange={e => setNewPlayerToken(e.target.value as TokenType)}
              >
                {Object.keys(TOKENS_MAP).map(token => (
                  <option
                    key={token}
                    value={token}
                    disabled={!!players.find(player => player.token === token)}
                  >
                    {TOKENS_MAP[token as TokenType]} {token}
                  </option>
                ))}
              </Select>
            </FormControl>
          </Flex>
          <Button
            colorScheme="green"
            w="100%"
            type="submit"
            disabled={
              !newPlayerName ||
              !newPlayerToken ||
              !!players.find(p => p.name === newPlayerName) ||
              !!players.find(p => p.token === newPlayerToken)
            }
            leftIcon={<FontAwesomeIcon icon={faPlus} />}
          >
            Add Player
          </Button>
        </form>
      </Box>
      <Divider my="10px" />
      <Heading size="lg" textAlign={'center'} mt="40px">
        Players
      </Heading>
      <Flex gap="10px" flexWrap={'wrap'} justify="center">
        {players.map(player => (
          <Flex
            key={player.name}
            transition="all 0.2s ease-in-out"
            minW="200px"
            direction="column"
            padding={'20px'}
            align="center"
            borderRadius={'8px'}
            shadow={'md'}
            cursor="default"
            pos="relative"
            bg={'white'}
          >
            <Text fontSize={'5xl'} p="0" m="0">
              {TOKENS_MAP[player.token]}
            </Text>
            <Heading size="sm">{player.name}</Heading>
            <IconButton
              pos={'absolute'}
              top={'10px'}
              right={'10px'}
              onClick={() => removePlayer(player.token)}
              aria-label="Remove Player"
              colorScheme={'red'}
              icon={<FontAwesomeIcon icon={faTrash} />}
            />
          </Flex>
        ))}
      </Flex>
      {players.length === 0 && (
        <Heading size="sm" fontWeight={'normal'} textAlign="center">
          No players have been added yet.
        </Heading>
      )}
      <Button
        w="100%"
        colorScheme="green"
        onClick={() => setHasStarted(true)}
        size={'lg'}
        disabled={players.length === 0}
        mt="10px"
      >
        Start Game
      </Button>
    </Box>
  );
}
