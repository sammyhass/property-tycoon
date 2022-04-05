import {
  calculateStationRent,
  calculateUtilityMulitplier,
} from '@/util/calculate-rent';
import { formatPrice } from '@/util/formatPrice';
import { propertyGroupToCSS } from '@/util/property-colors';
import {
  Box,
  Flex,
  Heading,
  HStack,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
} from '@chakra-ui/react';
import { GameProperty, PropertyGroupColor } from '@prisma/client';
import React, { useState } from 'react';
import BoardSpace from './spaces';

// Stack of Properties (use when displaying property groups)
export default function PropertyGroupStack({
  properties,
  group,
}: {
  properties: GameProperty[];
  group: PropertyGroupColor;
}) {
  const [selected, setSelected] = useState<GameProperty | null>(null);

  return (
    <>
      <Box
        border={'5px solid'}
        borderColor={propertyGroupToCSS[group]}
        borderRadius="8px"
        p="5px"
      >
        <Heading size="sm">{group}</Heading>
        <HStack spacing="-50px">
          {properties.map((property, i) => (
            <Box
              key={property.id}
              cursor="pointer"
              onClick={() => setSelected(property)}
            >
              <BoardSpace.Property
                key={property.id}
                property={property}
                zIndex={i}
                transform={'scale(0.95)'}
                transition="transform 0.2s ease-in-out"
                _hover={{
                  zIndex: 6,
                  transform: 'scale(1)',
                }}
              />
            </Box>
          ))}
        </HStack>
      </Box>
      <Modal isOpen={!!selected} onClose={() => setSelected(null)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Heading>{selected?.name}</Heading>
            <ModalCloseButton />
          </ModalHeader>
          <Flex justify="center" align="center">
            <BoardSpace.Property property={selected} />
          </Flex>
          <Box mx="auto" w="90%" py="10px">
            {selected?.rent_unimproved && selected?.rent_unimproved > 0 ? (
              <Text fontWeight={'600'} fontSize="lg" textAlign={'center'}>
                Rent Unimproved: {formatPrice(selected?.rent_unimproved ?? 0)}
                <br />
                Rent One House: {formatPrice(selected?.rent_one_house ?? 0)}
                <br />
                Rent Two Houses: {formatPrice(selected?.rent_two_house ?? 0)}
                <br />
                Rent Three Houses:{' '}
                {formatPrice(selected?.rent_three_house ?? 0)}
                <br />
                Rent Four Houses: {formatPrice(selected?.rent_four_house ?? 0)}
                <br />
                Rent Hotel: {formatPrice(selected?.rent_hotel ?? 0)}
                <br />
              </Text>
            ) : selected?.property_group_color === 'STATION' ? (
              new Array(4).fill(0).map((_, i) => (
                <Box>
                  With {i + 1} station{i + 1 > 1 ? 's' : ''}, rent is{' '}
                  {formatPrice(calculateStationRent(i + 1))}
                </Box>
              ))
            ) : (
              new Array(2).fill(0).map((_, i) => (
                <Box>
                  When {i + 1} owned, rent is{' '}
                  {calculateUtilityMulitplier(i + 1)}x Dice Roll.
                </Box>
              ))
            )}
          </Box>
        </ModalContent>
      </Modal>
    </>
  );
}
