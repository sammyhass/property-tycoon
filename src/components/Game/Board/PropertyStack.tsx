import {
  calculatePropertyRent,
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
  List,
  ListIcon,
  ListItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import { faMoneyBill } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
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
      <Box borderRadius="8px" p="5px">
        <Box bg="" p="10px" m="0">
          <Heading size="sm" color={propertyGroupToCSS[group]}>
            {group}
          </Heading>
        </Box>
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
          <ModalHeader bg={propertyGroupToCSS[group]} borderTopRadius="6px">
            <Heading color="white">{selected?.name}</Heading>
            <ModalCloseButton />
          </ModalHeader>
          <ModalBody>
            <Flex justify="center" align="center">
              <BoardSpace.Property property={selected} />
            </Flex>
            <Box mx="auto">
              {selected && <PropertyRentInfo property={selected} />}
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

export function PropertyRentInfo({ property }: { property: GameProperty }) {
  return (
    <Box mx="auto" my="20px">
      <Heading size="md">Rent</Heading>

      <List>
        {property?.rent_unimproved && property?.rent_unimproved > 0
          ? new Array(6).fill(0).map((_, i) => (
              <ListItem key={i}>
                <ListIcon>
                  <FontAwesomeIcon
                    icon={faMoneyBill}
                    color={propertyGroupToCSS[property.property_group_color]}
                  />
                </ListIcon>
                {i > 0
                  ? `with ${i < 5 ? `${i} House` : 'a Hotel'}${
                      i > 2 && i < 5 ? 's' : ''
                    }: `
                  : 'Unimproved: '}
                {formatPrice(calculatePropertyRent(property, i))}
              </ListItem>
            ))
          : property?.property_group_color === 'STATION'
          ? new Array(4).fill(0).map((_, i) => (
              <ListItem key={i}>
                <ListIcon>
                  <FontAwesomeIcon
                    icon={faMoneyBill}
                    color={propertyGroupToCSS[property.property_group_color]}
                  />
                </ListIcon>
                With {i + 1} station{i + 1 > 1 ? 's' : ''}, rent is{' '}
                {formatPrice(calculateStationRent(i + 1))}
              </ListItem>
            ))
          : new Array(2).fill(0).map((_, i) => (
              <ListItem key={i}>
                <ListIcon>
                  <FontAwesomeIcon
                    icon={faMoneyBill}
                    color={propertyGroupToCSS[property.property_group_color]}
                  />
                </ListIcon>
                When {i + 1} owned, rent is {calculateUtilityMulitplier(i + 1)}x
                Dice Roll.
              </ListItem>
            ))}
      </List>
    </Box>
  );
}
