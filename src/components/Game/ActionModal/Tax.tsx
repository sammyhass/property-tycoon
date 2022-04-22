import { useGameContext } from '@/hooks/useGameContext';
import { formatPrice } from '@/util/formatPrice';
import { Button, Flex, Heading, Text } from '@chakra-ui/react';
import React from 'react';

export default function TaxContent() {
  const {
    gameSettings,
    state,
    bankrupt,
    currentPlayer,
    couldPay,
    payToFreeParking,
    hideActionModal,
  } = useGameContext();

  if (!gameSettings || !currentPlayer) return <></>;

  const space = gameSettings?.BoardSpaces.find(
    space => space.board_position === (state[currentPlayer?.token]?.pos ?? 0)
  );

  const taxAmount = space?.tax_cost ?? 0;

  const couldPayTax = couldPay(currentPlayer?.token, taxAmount);

  return (
    <Flex direction={'column'} justify={'center'} align="center">
      <Heading size="md">Pay the Tax</Heading>
      <Text size="sm">
        You are paying {formatPrice(taxAmount)} in taxes to free parking.
      </Text>
      <Text fontSize={'4xl'}>{formatPrice(taxAmount)}</Text>
      <Button
        w={'100%'}
        colorScheme={'red'}
        onClick={() => {
          if (couldPayTax) {
            payToFreeParking(currentPlayer?.token, taxAmount);
          } else {
            bankrupt(currentPlayer?.token);
          }
          setTimeout(() => {
            hideActionModal();
          }, 1000);
        }}
      >
        {couldPayTax ? 'Pay' : "You're Bankrupt!"}
      </Button>
    </Flex>
  );
}
