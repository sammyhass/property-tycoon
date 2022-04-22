import { useGameContext } from '@/hooks/useGameContext';
import {
  Box,
  Button,
  Flex,
  Heading,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
} from '@chakra-ui/react';
import { faExclamation, faPlay } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { GameTimeDisplay } from './HUD';
import PlayerState from './PlayerState';

export default function GamePausedGuard() {
  const { isPaused, pause, resume, players, resetGame, currentPlayer } =
    useGameContext();

  return (
    <Modal
      isOpen={isPaused}
      isCentered
      onClose={resume}
      size="lg"
      scrollBehavior="inside"
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Heading>Game Paused</Heading>
          <Flex align={'center'}>
            <Heading size="sm">Game Time:</Heading>
            <GameTimeDisplay />
          </Flex>
        </ModalHeader>
        <ModalBody px="5px" py="10px" overflowX={'hidden'}>
          <Heading size="md" textAlign={'center'}>
            Here&apos;s how it stands:
          </Heading>
          <Stack maxH="300px" overflow={'auto'}>
            {players.map(player => (
              <PlayerState key={player.token} token={player.token} my="10px" />
            ))}
          </Stack>
          <Box></Box>
        </ModalBody>
        <ModalFooter flexDir={'column'} gap="5px">
          <Button
            size="lg"
            w="100%"
            onClick={resume}
            colorScheme={'green'}
            leftIcon={<FontAwesomeIcon icon={faPlay} />}
          >
            Resume
          </Button>
          <Button
            size="lg"
            w="100%"
            onClick={resetGame}
            colorScheme={'red'}
            leftIcon={<FontAwesomeIcon icon={faExclamation} />}
          >
            Reset Game
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
