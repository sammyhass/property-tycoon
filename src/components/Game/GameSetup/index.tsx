import {
  GameModeT,
  PLAYER_LIMIT,
  TOKENS_MAP,
  TokenType,
  useGameContext,
} from '@/hooks/useGameContext';
import {
  Alert,
  AlertDescription,
  AlertIcon,
  Badge,
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Text,
} from '@chakra-ui/react';
import { faker } from '@faker-js/faker';
import {
  faDice,
  faPlus,
  faRobot,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useCallback, useState } from 'react';
import GameModePicker from './GameModePicker';

// The GameSetup component is responsible for rendering the game setup screen where players initially choose their tokens.
export default function GameSetup() {
  const { handleStartGame, gameSettings, addPlayer, players, removePlayer } =
    useGameContext();

  const [gameMode, setGameMode] = useState<GameModeT>('normal');

  const [newPlayerName, setNewPlayerName] = useState('');
  const [newPlayerToken, setNewPlayerToken] = useState<TokenType>(
    Object.keys(TOKENS_MAP)[0] as TokenType
  );

  const setNextToken = useCallback(() => {
    // attempt to set the token to the next one in the list
    const nextToken = Object.keys(TOKENS_MAP)[
      Object.keys(TOKENS_MAP).indexOf(newPlayerToken) + 1
    ] as TokenType;

    if (nextToken) {
      setNewPlayerToken(nextToken);
    } else {
      // if we've reached the end of the list, set the token to the first one
      setNewPlayerToken(Object.keys(TOKENS_MAP)[0] as TokenType);
    }
  }, [newPlayerToken]);

  const onAddBot = useCallback(() => {
    addPlayer({
      isBot: true,
      name:
        newPlayerName && !players.find(p => p.name === newPlayerName)
          ? newPlayerName
          : faker.name.firstName(),
      token: newPlayerToken,
    });
    setNextToken();
  }, [addPlayer, newPlayerName, newPlayerToken]);

  const onAddPlayer = useCallback(() => {
    addPlayer({
      name: newPlayerName,
      isBot: false,
      token: newPlayerToken as TokenType,
    });
    setNewPlayerName('');
    setNextToken();
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
      <Heading size="xl">Game Setup - {gameSettings?.name}</Heading>
      <Box>
        <GameModePicker value={gameMode} onChange={setGameMode} />
      </Box>
      <Divider />
      <Box p="10px">
        <form
          onSubmit={e => {
            e.preventDefault();
            onAddPlayer();
          }}
        >
          <Flex my="10px" gap="10px" align={'flex-end'}>
            <FormControl isInvalid={!newPlayerName}>
              <FormLabel>Player Name</FormLabel>
              <InputGroup>
                <InputLeftElement>
                  <IconButton
                    variant={'ghost'}
                    color="blackAlpha.600"
                    size="xs"
                    icon={
                      <FontAwesomeIcon icon={faDice} color="currentColor" />
                    }
                    aria-label="Randomize"
                    onClick={() => {
                      setNewPlayerName(faker.name.firstName());
                    }}
                  />
                </InputLeftElement>
                <Input
                  placeholder="Player Name"
                  value={newPlayerName}
                  onChange={e => setNewPlayerName(e.target.value)}
                />
              </InputGroup>
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
            {players.length < 6 && (
              <Button
                aria-label={'Add Bot'}
                flexShrink={0}
                maxH={'40px'}
                colorScheme="purple"
                borderRadius={'8px'}
                size="lg"
                shadow="md"
                onClick={onAddBot}
                disabled={!!players.find(p => p.token === newPlayerToken)}
                leftIcon={<FontAwesomeIcon icon={faRobot} />}
              >
                Add Bot
              </Button>
            )}
          </Flex>
          <Button
            colorScheme="green"
            w="100%"
            type="submit"
            size="lg"
            disabled={
              !newPlayerName ||
              !newPlayerToken ||
              !!players.find(p => p.name === newPlayerName) ||
              !!players.find(p => p.token === newPlayerToken) ||
              players.length >= PLAYER_LIMIT
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

            {player.isBot && (
              <Badge m="0" colorScheme={'purple'}>
                <FontAwesomeIcon icon={faRobot} /> Robot
              </Badge>
            )}
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
        onClick={() => handleStartGame(gameMode)}
        size={'lg'}
        disabled={players.length <= 1}
        mt="10px"
      >
        Start Game
      </Button>
      {players.length <= 1 && (
        <Alert borderRadius={'8px'} mt="20px">
          <AlertIcon />
          <AlertDescription>
            You need at least 2 players to start the game.
          </AlertDescription>
        </Alert>
      )}
    </Box>
  );
}
