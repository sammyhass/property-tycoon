import { useGameContext } from '@/hooks/useGameContext';
import { calculateMortgageValue } from '@/util/calculate-mortgage-value';
import {
  calculatePropertyRent,
  calculateStationRent,
  calculateUtilityMulitplier,
} from '@/util/calculate-rent';
import { formatPrice } from '@/util/formatPrice';
import { propertyGroupToCSS } from '@/util/property-colors';
import {
  Badge,
  Box,
  Button,
  Divider,
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
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from '@chakra-ui/react';
import { faMoneyBill } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  GameProperty,
  PropertyGroup,
  PropertyGroupColor,
} from '@prisma/client';
import React, { useEffect, useMemo, useState } from 'react';
import { BoardSpaceProperty } from './spaces';

// Stack of Properties (use when displaying property groups owned by a player)
export default function PropertyGroupStack({
  properties,
  group,
}: {
  properties: GameProperty[];
  group: PropertyGroupColor;
}) {
  const {
    unmortgage,
    mortgage,
    showBuyHouseAction,
    gameSettings,
    canEndTurn,
    currentPlayer,
    isMortgaged,
    isOwned,
    state,
  } = useGameContext();

  const [selected, setSelected] = useState<GameProperty | null>(null);

  const selectedIsMortgaged = useMemo(
    () => (selected ? isMortgaged(selected.id) : false),
    [selected, isMortgaged]
  );

  const selectedPropertyOwner = useMemo(
    () => (selected ? isOwned(selected.id) : null),
    [selected, isOwned]
  );

  const currentPlayerIsOwner = useMemo(
    () =>
      selectedPropertyOwner
        ? selectedPropertyOwner.token === currentPlayer?.token
        : false,
    [selectedPropertyOwner, currentPlayer]
  );

  const ownsAllInGroup = useMemo(
    () =>
      Object.keys(
        selectedPropertyOwner?.ownerState?.propertiesOwned?.[group] ?? {}
      ).length ===
      gameSettings?.Properties.filter(p => p.property_group_color === group)
        .length,
    [selectedPropertyOwner, group, properties]
  );

  const propertyGroup = useMemo(
    () => gameSettings?.PropertyGroups.find(g => g.color === group),
    [group, gameSettings]
  );

  const [housesOnSelected, setHousesOnSelected] = useState<number>(0);

  const selectedMortgageValue = useMemo(
    () =>
      selected
        ? calculateMortgageValue(
            selected.price ?? 0,
            housesOnSelected,
            propertyGroup?.hotel_cost ?? undefined,
            propertyGroup?.house_cost ?? undefined
          )
        : undefined,
    [selected, housesOnSelected, propertyGroup]
  );

  useEffect(() => {
    if (selected) {
      setHousesOnSelected(
        selectedPropertyOwner?.ownerState?.propertiesOwned?.[group]?.[
          selected.id
        ].houses ?? 0
      );
    }
  }, [
    selected,
    Object.keys(selectedPropertyOwner?.ownerState?.propertiesOwned ?? {}),
  ]);

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
              pos="relative"
              transform={'scale(0.95)'}
              transition="transform 0.2s ease-in-out"
              _hover={{
                zIndex: 6,
                transform: 'scale(1)',
              }}
              onClick={() => setSelected(property)}
            >
              {isMortgaged(property.id) && (
                <Badge
                  pos="absolute"
                  top="-10px"
                  right="-10px"
                  colorScheme={'red'}
                  zIndex={100}
                  fontSize="sm"
                >
                  Mortgaged
                </Badge>
              )}
              <BoardSpaceProperty
                key={property.id}
                property={property}
                zIndex={i}
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
            <Box>
              {selectedIsMortgaged && (
                <Badge colorScheme={'red'}>Mortgaged</Badge>
              )}
            </Box>
            <ModalCloseButton />
          </ModalHeader>
          <ModalBody>
            <Flex justify="center" align="center">
              <BoardSpaceProperty property={selected} />
            </Flex>
            <Box mx="auto">
              {selected && (
                <PropertyRentInfo
                  nHouses={housesOnSelected}
                  group={propertyGroup}
                  property={selected}
                />
              )}
            </Box>
          </ModalBody>
          {currentPlayerIsOwner && (
            <ModalFooter
              px="0"
              display={'flex'}
              justifyContent="center"
              alignContent={'center'}
              gap="5px"
            >
              <Button
                colorScheme={selectedIsMortgaged ? 'red' : 'green'}
                onClick={
                  selectedPropertyOwner && selected?.id
                    ? selectedIsMortgaged
                      ? () =>
                          unmortgage(selectedPropertyOwner?.token, selected?.id)
                      : () =>
                          mortgage(selectedPropertyOwner?.token, selected?.id)
                    : () => {}
                }
                leftIcon={<FontAwesomeIcon icon={faMoneyBill} />}
              >
                {selectedIsMortgaged
                  ? 'Unmortgage'
                  : selectedMortgageValue?.type === 'mortgage'
                  ? 'Mortgage'
                  : selectedMortgageValue?.type === 'sell_house'
                  ? 'Sell House'
                  : 'Sell Hotel'}{' '}
                for {formatPrice(selectedMortgageValue?.value ?? 0)}
              </Button>
              {ownsAllInGroup &&
                propertyGroup?.color &&
                !(
                  propertyGroup.color === 'STATION' ||
                  propertyGroup.color === 'UTILITIES'
                ) &&
                canEndTurn &&
                selected?.id &&
                selectedPropertyOwner?.token && (
                  <Button
                    onClick={() => {
                      if (!selected) return;
                      showBuyHouseAction(selected.id);
                      setSelected(null);
                    }}
                    leftIcon={<FontAwesomeIcon icon={faMoneyBill} />}
                    disabled={
                      selectedPropertyOwner?.ownerState?.propertiesOwned?.[
                        group
                      ]?.[selected?.id]?.houses === 5
                    }
                  >
                    Buy a{' '}
                    {(selectedPropertyOwner?.ownerState?.propertiesOwned?.[
                      propertyGroup?.color
                    ]?.[selected?.id]?.houses ?? 0) > 4
                      ? 'Hotel'
                      : 'House'}{' '}
                    for {formatPrice(propertyGroup?.house_cost ?? 0)}
                  </Button>
                )}
            </ModalFooter>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

export function PropertyRentInfo({
  property,
  nHouses = undefined,
  group = undefined,
}: {
  property: GameProperty;
  nHouses?: number;
  group?: PropertyGroup;
}) {
  const renderedList = useMemo(() => {
    return (
      <List>
        {property?.rent_unimproved && property?.rent_unimproved > 0
          ? new Array(6).fill(0).map((_, i) => (
              <ListItem
                key={i}
                fontWeight={i === nHouses ? 'bold' : 'normal'}
                color={i === nHouses ? 'green' : ''}
              >
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
    );
  }, [property, nHouses]);

  return (
    <Box mx="auto" my="20px">
      <Heading size="md">Rent</Heading>
      {renderedList}
      <Divider my="20px" />
      {property.property_group_color !== 'STATION' &&
        property.property_group_color !== 'UTILITIES' && (
          <Box>
            <Heading size="md">Houses and Hotels</Heading>
            <Text>🏠 House Cost: {formatPrice(group?.house_cost ?? 0)}</Text>
            <Text>🏨 Hotel Cost: {formatPrice(group?.hotel_cost ?? 0)}</Text>
          </Box>
        )}
    </Box>
  );
}
