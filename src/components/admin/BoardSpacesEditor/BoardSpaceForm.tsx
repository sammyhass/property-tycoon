import { API_URL } from '@/env/env';
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  CloseButton,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Select,
} from '@chakra-ui/react';
import { BoardSpace, CardType, GameProperty, SpaceType } from '@prisma/client';
import axios from 'axios';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

interface BoardSpaceFormProps {
  onComplete: (v: BoardSpace) => void;
  boardSpace: BoardSpace;
  properties: GameProperty[];
  gameId: string;
}

export default function BoardSpaceForm({
  boardSpace,
  onComplete,
  properties,
  gameId,
}: BoardSpaceFormProps) {
  const [spaceType, setSpaceType] = useState(boardSpace.space_type);
  const [cardType, setCardType] = useState<CardType | null>(null);
  const [propertyId, setPropertyId] = useState<string | null>(null);

  useEffect(() => {
    setSpaceType(boardSpace.space_type);
    setCardType(boardSpace.take_card);
    setPropertyId(boardSpace.property_id);
  }, [boardSpace.space_type, boardSpace.take_card, boardSpace.property_id]);

  useEffect(() => {
    if (spaceType === SpaceType.TAKE_CARD) {
      setCardType(CardType.POT_LUCK);
      setPropertyId(null);
    } else if (spaceType === SpaceType.PROPERTY) {
      setCardType(null);
      setPropertyId(properties[0]?.id ?? null);
    } else {
      setCardType(null);
      setPropertyId(null);
    }
  }, [spaceType, properties]);

  const [error, setError] = useState<string | null>(null);

  const selectedProperty = useMemo(() => {
    return properties.find(p => p.id === propertyId);
  }, [propertyId, properties]);

  const handleSubmit = useCallback(async () => {
    try {
      const { data } = await axios.post(
        `${API_URL}/game/${gameId}/board_spaces/${boardSpace.board_position}`,
        {
          space_type: spaceType,
          take_card: cardType,
          property_id: propertyId,
        }
      );
      onComplete(data);
    } catch (e: any) {
      setError(e?.message ?? 'Unknown error');
    }
  }, [
    spaceType,
    cardType,
    propertyId,
    boardSpace.board_position,
    onComplete,
    gameId,
  ]);

  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        handleSubmit();
      }}
    >
      <Flex direction={'column'} gap="10px">
        <FormControl>
          <FormLabel htmlFor="space_type">Space Type</FormLabel>
          <Select
            defaultValue={boardSpace.space_type as string}
            name="space_type"
            id="space_type"
            value={spaceType}
            onChange={v => setSpaceType(v.target.value as SpaceType)}
          >
            {[SpaceType.EMPTY, SpaceType.PROPERTY, SpaceType.TAKE_CARD].map(
              k => (
                <option key={k} value={k} disabled={k === 'EMPTY'}>
                  {SpaceType[k as keyof typeof SpaceType]}
                </option>
              )
            )}
          </Select>
        </FormControl>
        {spaceType === 'TAKE_CARD' ? (
          <FormControl>
            <FormLabel htmlFor="take_card">Card Type</FormLabel>
            <Select
              name="take_card"
              id="take_card"
              value={cardType as CardType}
              onChange={v => setCardType(v.target.value as CardType)}
            >
              {Object.keys(CardType).map(k => (
                <option key={k} value={k}>
                  {CardType[k as keyof typeof CardType]}
                </option>
              ))}
            </Select>
          </FormControl>
        ) : spaceType === 'PROPERTY' ? (
          <FormControl>
            <FormLabel htmlFor="property_id">Choose a Property</FormLabel>
            <Select
              defaultValue={boardSpace.property_id as string}
              name="property_id"
              backgroundColor={selectedProperty?.property_group_color}
              id="property_id"
              value={propertyId as string}
              onChange={v => setPropertyId(v.target.value as string)}
            >
              {properties.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
              {properties.length < 1 && (
                <option disabled>No properties to choose from</option>
              )}
            </Select>
          </FormControl>
        ) : null}
      </Flex>
      <Button mt="10px" w="100%" type="submit" colorScheme={'green'}>
        Update
      </Button>
      {error && (
        <Alert status="error" mt="10px">
          <AlertIcon />
          <Box flex="1">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription display="block">{error}</AlertDescription>
            <Divider />
            {spaceType === 'PROPERTY' && (
              <AlertDescription>
                Ensure you haven&apos;t already assigned this property to a
                board space
              </AlertDescription>
            )}
          </Box>
          <CloseButton position="absolute" right="8px" top="8px" />
        </Alert>
      )}
    </form>
  );
}
