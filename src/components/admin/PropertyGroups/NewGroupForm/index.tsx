import { API_URL } from '@/env/env';
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  Input,
  ListItem,
  Select,
  UnorderedList,
} from '@chakra-ui/react';
import { property_group, property_group_color } from '@prisma/client';
import axios from 'axios';
import { useRouter } from 'next/router';
import React, { useCallback, useMemo, useState } from 'react';

type AddPropertyInput = Pick<
  property_group,
  'color' | 'hotel_cost' | 'house_cost'
>;

export default function NewPropertyGroupForm({
  gameId,
  existingGroups = [],
}: {
  gameId: string;
  existingGroups: property_group[];
}) {
  const [color, setColor] = useState<string>(
    Object.values(property_group_color)[0]
  );
  const [hotelCost, setHotelCost] = useState<number>(100);
  const [houseCost, setHouseCost] = useState<number>(100);
  const [error, setError] = useState('');

  const router = useRouter();

  const canSubmit = useMemo(
    () => !!color && hotelCost > 0 && houseCost > 0,
    [color, hotelCost, houseCost]
  );

  const onSubmit = useCallback(
    async e => {
      e.preventDefault();
      const { data, status } = await axios.post(
        `${API_URL}/game/${gameId}/property_groups`,
        {
          color: color,
          hotel_cost: hotelCost,
          house_cost: houseCost,
        }
      );

      if (status !== 200) {
        setError(data.message ?? 'Error, please try again');
      }

      router.push(`/admin/games/${gameId}`);
    },
    [color, hotelCost, houseCost, gameId, router]
  );

  return (
    <Box
      w="600px"
      maxW={'100%'}
      mx="auto"
      mt="70px"
      boxShadow={'xl'}
      border="1px solid #eee"
      p="15px"
      borderRadius={'8px'}
    >
      <Heading>New Property Group</Heading>
      <form onSubmit={e => canSubmit && onSubmit(e)}>
        <FormControl my="10px">
          <FormLabel htmlFor="color" m="0" p=")">
            Color
          </FormLabel>
          <FormHelperText m="0" p="0">
            Choose a color for this property group.
          </FormHelperText>
          <Select
            mt="6px"
            color="blackAlpha.500"
            fontWeight={'bold'}
            bg={color}
            value={color}
            onChange={e => setColor(e.target.value)}
          >
            {Object.keys(property_group_color).map(color => (
              <option
                key={color}
                value={color}
                disabled={existingGroups.some(
                  group => group.color === (color as property_group_color)
                )}
              >
                {color}
              </option>
            ))}
          </Select>
        </FormControl>
        <FormControl mb="10px">
          <FormLabel m="0" p="0">
            House Cost
          </FormLabel>

          <FormHelperText m="0" p="0">
            Cost per house in this group
          </FormHelperText>

          <Input
            type="number"
            placeholder="Cost in £"
            min={0}
            value={houseCost}
            onChange={e => setHouseCost(parseInt(e.target.value))}
          />
        </FormControl>
        <FormControl mb="10px">
          <FormLabel m="0" p="0">
            Hotel Cost
          </FormLabel>

          <FormHelperText m="0" p="0">
            Cost per hotel in this group
          </FormHelperText>

          <Input
            type="number"
            placeholder="Cost in £"
            value={hotelCost}
            min={0}
            onChange={e => setHotelCost(parseInt(e.target.value))}
          />
        </FormControl>
        <Button type="submit" my="10px" w="100%" disabled={!canSubmit}>
          Submit
        </Button>
        {error && <FormHelperText color="red.500">{error}</FormHelperText>}
        {!canSubmit && (
          <UnorderedList color={'red'}>
            {!color && <ListItem>Color is required</ListItem>}
            {hotelCost <= 0 && (
              <ListItem>Hotel cost must be a positive number</ListItem>
            )}
            {houseCost <= 0 && (
              <ListItem>House cost must be a positive number</ListItem>
            )}
          </UnorderedList>
        )}
      </form>
    </Box>
  );
}
