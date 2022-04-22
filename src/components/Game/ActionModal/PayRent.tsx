import { useGameContext } from '@/hooks/useGameContext';
import { formatPrice } from '@/util/formatPrice';
import { Button, Flex, Heading, Text } from '@chakra-ui/react';
import React, { useMemo } from 'react';
import { BoardSpaceProperty } from '../Board/spaces';

export default function PayRentContent() {
  const {
    payPlayer,
    gameSettings,
    currentPlayer,
    bankrupt,
    couldPay,
    state,
    isOwned,
    calculateRent,
    isMortgaged,
    hideActionModal,
  } = useGameContext();

  const space = currentPlayer?.token
    ? gameSettings?.BoardSpaces.find(
        space =>
          space.board_position === (state[currentPlayer?.token]?.pos ?? 0)
      )
    : null;

  const property = gameSettings?.Properties.find(
    property => property.id === space?.property_id
  );

  const owner = isOwned(property?.id ?? '');

  const rent = useMemo(() => {
    if (!property) return 0;
    return !isMortgaged(property.id) ? calculateRent(property?.id) : 0;
  }, [calculateRent, property, isMortgaged]);

  if (!owner || !property || !currentPlayer?.token) return <></>;

  return (
    <Flex direction={'column'} justify={'center'} align="center">
      <Heading size="md">Pay the Rent</Heading>
      {property && <BoardSpaceProperty property={property} />}
      <Text fontSize={'4xl'}>{formatPrice(rent ?? 0)}</Text>
      <Button
        w={'100%'}
        colorScheme={'red'}
        onClick={() => {
          if (!currentPlayer) return;
          if (couldPay(currentPlayer?.token, rent ?? 0)) {
            payPlayer(currentPlayer?.token, owner?.token, rent);
          } else {
            bankrupt(currentPlayer?.token);
          }
          setTimeout(() => {
            hideActionModal();
          }, 1000);
        }}
      >
        {couldPay(currentPlayer?.token, rent ?? 0) ? 'Pay' : "You're Bankrupt!"}
      </Button>
    </Flex>
  );
}
