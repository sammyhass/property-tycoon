import { useGameContext } from '@/hooks/useGameContext';
import { formatPrice } from '@/util/formatPrice';
import {
  Alert,
  AlertDescription,
  AlertIcon,
  Box,
  Button,
  Flex,
  Heading,
} from '@chakra-ui/react';
import React, { useMemo } from 'react';
import { BoardSpaceProperty } from '../Board/spaces';

export default function BuyHouseContent() {
  const {
    buyHouse,
    hideBuyHouseAction,
    propertyToBuyHouseOn,
    state,
    gameSettings,
    currentPlayer,
  } = useGameContext();

  const currentHouses = useMemo(() => {
    if (!propertyToBuyHouseOn || !currentPlayer) return 0;
    return state?.[currentPlayer?.token]?.propertiesOwned?.[
      propertyToBuyHouseOn?.property_group_color
    ]?.[propertyToBuyHouseOn?.id]?.houses;
  }, [
    state,
    currentPlayer,
    propertyToBuyHouseOn,
    state[currentPlayer?.token ?? 'boot']?.propertiesOwned,
  ]);

  const houseCost = useMemo(() => {
    if (!propertyToBuyHouseOn) return 0;
    return gameSettings?.PropertyGroups.find(
      group => group.color === propertyToBuyHouseOn.property_group_color
    )?.house_cost;
  }, [propertyToBuyHouseOn, gameSettings?.PropertyGroups]);

  const hotelCost = useMemo(() => {
    if (!propertyToBuyHouseOn) return 0;
    return gameSettings?.PropertyGroups.find(
      group => group.color === propertyToBuyHouseOn.property_group_color
    )?.hotel_cost;
  }, [propertyToBuyHouseOn, gameSettings?.PropertyGroups]);

  return (
    <Box>
      <Heading size="sm">Buy a house on {propertyToBuyHouseOn?.name}?</Heading>
      <Flex w="100%" align={'center'} justify="center" my="10px">
        <BoardSpaceProperty
          property={propertyToBuyHouseOn}
          nHouses={currentHouses}
        />
      </Flex>
      {(currentHouses ?? 0) < 5 && (
        <Button
          w="100%"
          colorScheme="green"
          onClick={() => {
            if (!currentPlayer || !propertyToBuyHouseOn) return;
            buyHouse(currentPlayer?.token, propertyToBuyHouseOn.id, 1);
          }}
        >
          {`Buy a ${
            (currentHouses ?? 0) < 4 ? 'House' : 'Hotel'
          } for ${formatPrice(
            (currentHouses ?? 0) < 4 ? houseCost ?? 0 : hotelCost ?? 0
          )}`}
        </Button>
      )}

      {(currentHouses ?? 0) === 5 && (
        <Alert mt="10px">
          <AlertIcon />
          <AlertDescription>
            You have already bought a hotel on this property.
          </AlertDescription>
        </Alert>
      )}

      <Button
        onClick={hideBuyHouseAction}
        w="100%"
        colorScheme={'purple'}
        mt="10px"
      >
        All Done!
      </Button>
    </Box>
  );
}
