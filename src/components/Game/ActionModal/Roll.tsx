import { useGameContext } from '@/hooks/useGameContext';
import { Button, Flex, Heading, Stack, Text } from '@chakra-ui/react';
import React, { useCallback, useState } from 'react';

// Content for our action modal when a player is rolling the dice.

export default function RollContent() {
  const { currentPlayer, move, rollDice } = useGameContext();

  const [isRolling, setIsRolling] = useState(false);
  const [isMoving, setIsMoving] = useState(false);

  const [diceRoll, setDiceRoll] = useState<[number, number] | null>(null);

  const handleMove = useCallback(() => {
    if (!currentPlayer) return;
    setIsMoving(true);
    setTimeout(() => {
      move(currentPlayer.token, diceRoll![0] + diceRoll![1]);
      setIsMoving(false);
    }, 500);
  }, [currentPlayer, move, diceRoll]);

  // Roll the dice.
  const handleRoll = useCallback(() => {
    setIsRolling(true);

    if (!currentPlayer) return;
    // Choose a random number between 1 and 12
    setTimeout(() => {
      const [dice1, dice2] = rollDice();
      setDiceRoll([dice1, dice2]);
      setIsRolling(false);
    }, 500);
  }, [currentPlayer, rollDice]);

  return (
    <Flex direction={'column'} justify={'center'} align="center">
      <Heading size="4xl">🎲 🎲</Heading>
      {isRolling && <Heading size="md">Rolling...</Heading>}
      {diceRoll && (
        <Stack spacing={4} justify="center" align={'center'}>
          <Text>You rolled:</Text>
          <Flex justify={'center'} gap="10px" align="center">
            <Heading size="md">{diceRoll[0]}</Heading>
            <Text>{` and `}</Text>
            <Heading size="md">{diceRoll[1]}</Heading>
          </Flex>
        </Stack>
      )}
      <Button
        w="100%"
        colorScheme={diceRoll ? 'green' : 'purple'}
        onClick={diceRoll ? handleMove : handleRoll}
        mt="10px"
        isLoading={isRolling || isMoving}
        disabled={isRolling || isMoving}
      >
        {diceRoll ? 'Move' : 'Roll'}
      </Button>
    </Flex>
  );
}
