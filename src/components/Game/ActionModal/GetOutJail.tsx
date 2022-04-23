import { useGameContext } from '@/hooks/useGameContext';
import {
  Alert,
  AlertDescription,
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Radio,
  RadioGroup,
  Stack,
  Text,
} from '@chakra-ui/react';
import React, { useCallback, useMemo, useState } from 'react';
import { ActionModalProps } from '.';

export default function ActionModalGetOutJail({ action }: ActionModalProps) {
  const {
    currentPlayer,
    rollDice,
    payBank,
    state,
    hideActionModal,
    move,
    freeFromJail,
    getOutOfJailWithCard,
    failedToGetOutOfJail,
  } = useGameContext();

  const [choice, setChoice] = useState<'roll' | 'pay' | 'use_card'>('pay');

  const [roll, setRoll] = useState<[number, number] | null>(null);

  const [didRoll, setDidRoll] = useState(false);
  const [didPay, setDidPay] = useState(false);

  const handleContinue = useCallback(() => {
    if (!currentPlayer) return;
    if (didPay || (didRoll && roll && roll[0] === roll[1])) {
      freeFromJail(currentPlayer.token);
      if (roll && roll[0] === roll[1]) {
        move(currentPlayer.token, roll[0] + roll[1]);
      }
    } else {
      failedToGetOutOfJail(currentPlayer.token);
    }
    hideActionModal();
  }, [
    failedToGetOutOfJail,
    currentPlayer,
    hideActionModal,
    move,
    roll,
    didRoll,
    didPay,
    freeFromJail,
  ]);

  const handleDiceRoll = useCallback(() => {
    if (!currentPlayer) return;
    const [roll1, roll2] = rollDice(false);
    setRoll([roll1, roll2]);
    setDidRoll(true);
  }, [rollDice, currentPlayer]);

  const handlePayToGetOut = useCallback(() => {
    if (!currentPlayer) return;

    payBank(currentPlayer?.token, 50);
    setDidPay(true);
  }, [currentPlayer, payBank]);

  const hasGetOutOfJailFreeCard = useMemo(() => {
    if (!currentPlayer) return false;
    return state?.[currentPlayer?.token]?.hasGetOutOfJailFreeCard;
  }, [state, currentPlayer]);

  if (!currentPlayer) return <></>;
  return (
    <Flex direction={'column'} gap="5px">
      <Heading size="md" py="10px">
        You&apos;re in Jail!
      </Heading>

      {!(didRoll || didPay) && (
        <FormControl mb="20px">
          <FormLabel>
            <Text fontSize="sm">
              Try to get out of jail by rolling doubles (
              {3 - (state[currentPlayer.token]?.turnsInJail ?? 0)} tries left)
              or paying the fine of $50.
            </Text>
          </FormLabel>
          <RadioGroup
            value={choice}
            onChange={v => setChoice(v as 'roll' | 'pay' | 'use_card')}
            defaultValue="pay"
          >
            <Stack direction="column" spacing="5px">
              {(state[currentPlayer.token]?.turnsInJail ?? 0) < 3 && (
                <Radio value="roll">
                  <Text>🎲 Roll Dice</Text>
                </Radio>
              )}
              <Radio value="pay">
                <Text>💸 Pay $50 to get out</Text>
              </Radio>
              {hasGetOutOfJailFreeCard && (
                <Radio value="use_card">
                  <Text>🎁 Use Get Out of Jail Free Card</Text>
                </Radio>
              )}
            </Stack>
          </RadioGroup>
        </FormControl>
      )}

      {choice === 'roll' ? (
        <Box>
          <Heading size="sm">
            Try to get out of jail by rolling doubles (
            {3 - (state[currentPlayer.token]?.turnsInJail ?? 0)} tries left)
          </Heading>
          <Box p="10px" bg="#eee" borderRadius={'8px'}>
            <Heading textAlign={'center'}>🎲 🎲</Heading>
            {roll ? (
              <Box>
                <Text textAlign={'center'}>You Rolled</Text>
                <Stack
                  direction="row"
                  spacing={'5px'}
                  justify="center"
                  fontSize={'lg'}
                >
                  <Text fontWeight={'bold'}>{roll[0]}</Text>
                  <Text>and</Text>
                  <Text fontWeight={'bold'}>{roll[1]}</Text>
                </Stack>
                {roll[0] === roll[1] && (
                  <Alert status="success">
                    <AlertDescription>
                      You rolled doubles! You can get out of jail!
                    </AlertDescription>
                  </Alert>
                )}
              </Box>
            ) : (
              <Button onClick={handleDiceRoll} w="100%" colorScheme={'red'}>
                Roll Dice
              </Button>
            )}
          </Box>
        </Box>
      ) : choice === 'pay' ? (
        <Box>
          <Heading size="sm">Pay £50 to get out of jail now?</Heading>
          <Button
            colorScheme={'purple'}
            onClick={handlePayToGetOut}
            w="100%"
            isDisabled={
              !currentPlayer ||
              (state[currentPlayer.token]?.money ?? 0) < 50 ||
              didPay
            }
          >
            Pay £50 to get out
          </Button>
        </Box>
      ) : choice === 'use_card' && hasGetOutOfJailFreeCard ? (
        <Box>
          <Heading size="sm">Use Get Out of Jail Free Card?</Heading>
          <Button
            colorScheme={'purple'}
            onClick={() => {
              getOutOfJailWithCard(currentPlayer.token);
              hideActionModal();
            }}
            w="100%"
            isDisabled={!currentPlayer || didPay}
          >
            Use Get Out of Jail Free Card
          </Button>
        </Box>
      ) : null}
      {(didRoll || didPay) && (
        <Button onClick={handleContinue} mt="20px">
          {roll
            ? roll[0] === roll[1] || didPay
              ? 'Get out Now'
              : 'Roll again next turn.'
            : 'Continue'}
        </Button>
      )}
    </Flex>
  );
}
