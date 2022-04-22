import { useGameContext } from '@/hooks/useGameContext';
import { formatPrice } from '@/util/formatPrice';
import { Box, Button, Divider, Flex, Heading } from '@chakra-ui/react';
import React, { useState } from 'react';
import { PropertyRentInfo } from '../Board/PropertyStack';
import { BoardSpaceProperty } from '../Board/spaces';

export default function BuyContent() {
  const { gameSettings, currentPlayer, state, buy, hideActionModal } =
    useGameContext();
  const [buying, setBuying] = useState(false);

  // Logic: the only way to buy a property is if it is your turn and you have landed on it.
  if (!currentPlayer) return <></>;

  const space = gameSettings?.BoardSpaces.find(
    space => space.board_position === state[currentPlayer?.token]?.pos
  );

  const property = gameSettings?.Properties.find(
    property => property.id === space?.property_id
  );

  const group = gameSettings?.PropertyGroups.find(
    group => group.color === property?.property_group_color
  );

  if (!property) return <></>;

  const handleBuy = () => {
    setBuying(true);
    buy(currentPlayer?.token, property.id);
    setTimeout(() => {
      hideActionModal();
      setBuying(false);
    }, 1000);
  };

  return (
    <Box>
      <Flex direction={'column'} justify={'center'} align="center">
        <BoardSpaceProperty property={property} />
      </Flex>
      <Divider my="15px" />
      <Box my="10px" p="10px" bg="#eee" borderRadius={'8px'}>
        <Heading size="md">
          {property.name} - {formatPrice(property.price ?? 0)}
        </Heading>
        <PropertyRentInfo property={property} group={group} />
      </Box>
      <Flex direction="column" gap="5px">
        <Button
          w="100%"
          disabled={
            !currentPlayer ||
            !property ||
            !state[currentPlayer?.token] ||
            (state[currentPlayer?.token]?.money ?? 0) < (property?.price ?? 0) // Disable the button if you don't have enough money
          }
          colorScheme="green"
          isLoading={buying}
          onClick={() => {
            handleBuy();
          }}
        >
          {(state[currentPlayer?.token]?.money ?? 0) < (property?.price ?? 0)
            ? 'Not enough money'
            : 'Buy'}
        </Button>
        <Button w="100%" colorScheme={'blue'} onClick={() => hideActionModal()}>
          No thanks
        </Button>
      </Flex>
    </Box>
  );
}
