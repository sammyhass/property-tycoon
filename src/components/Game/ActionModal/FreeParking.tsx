import { useGameContext } from '@/hooks/useGameContext';
import { formatPrice } from '@/util/formatPrice';
import { Button, Flex, Heading, Text } from '@chakra-ui/react';
import React, { useEffect } from 'react';

export default function ActionModalFreeParking() {
  const {
    landedOnFreeParking,
    currentPlayer,
    hideActionModal,
    totalOnFreeParking,
  } = useGameContext();

  useEffect(() => {
    if (!currentPlayer) return;
    const v = landedOnFreeParking(currentPlayer.token);
  }, [currentPlayer, landedOnFreeParking]);

  return (
    <Flex direction={'column'} justify={'center'} align="center">
      <Heading size="md">Free Parking</Heading>

      <Text>
        The total amount on free parking is {formatPrice(totalOnFreeParking)},
        It&apos;s all yours now
      </Text>
      <Button
        w={'100%'}
        colorScheme={'blue'}
        onClick={() => {
          hideActionModal();
        }}
      >
        Continue
      </Button>
    </Flex>
  );
}
