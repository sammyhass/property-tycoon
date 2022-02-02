import { API_URL } from '@/env/env';
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Input,
  Select,
  UnorderedList,
} from '@chakra-ui/react';
import {
  game_property,
  property_group,
  property_group_color,
} from '@prisma/client';
import axios from 'axios';
import { useRouter } from 'next/router';
import React, { useCallback, useMemo, useState } from 'react';

export default function NewPropertyForm({
  gameId,
  existingGroups = [],
}: {
  gameId: string;
  existingGroups: property_group[];
}) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [propertyGroup, setPropertyGroup] = useState<property_group_color>(
    existingGroups[0]?.color
  );

  const router = useRouter();

  const [error, setError] = useState('');

  const canSubmit = useMemo(() => name && price > 0, [name, price]);

  const onSubmit = useCallback(
    async e => {
      e.preventDefault();
      const { data, status } = await axios.post(
        `${API_URL}/game/${gameId}/game_properties`,
        {
          name,
          price,
          property_group_color: propertyGroup,
        } as Pick<game_property, 'name' | 'price' | 'property_group_color'>
      );
      if (status !== 200) {
        setError(data.message ?? 'Error, please try again');
      }

      router.push(`/admin/games/${gameId}`);
    },
    [gameId, name, price, propertyGroup, router]
  );

  return (
    <form onSubmit={e => canSubmit && onSubmit(e)}>
      <FormControl my="10px">
        <FormLabel m={0} p={0}>
          Name
        </FormLabel>
        <Input
          placeholder="Property Name"
          value={name}
          onChange={e => setName(e.target.value)}
        />
      </FormControl>
      <FormControl mb="10px">
        <FormLabel m="0" p="0">
          Price
        </FormLabel>
        <Input
          placeholder="Property Price in £"
          type="number"
          value={price}
          onChange={e => setPrice(Number(e.target.value))}
        />
      </FormControl>
      <FormControl mb="10px">
        <FormLabel m="0" p="0">
          Property Group
        </FormLabel>
        <FormHelperText p="0" m={0}>
          Which property group does this property belong to?
        </FormHelperText>
        <Select
          mt="10px"
          value={propertyGroup}
          bg={propertyGroup}
          onChange={e =>
            setPropertyGroup(e.target.value as property_group_color)
          }
        >
          {existingGroups.map(({ color }) => (
            <option key={color} value={color}>
              {color}
            </option>
          ))}
        </Select>
        {existingGroups.length === 0 && (
          <FormErrorMessage>
            You need to create a property group first!
          </FormErrorMessage>
        )}
      </FormControl>
      <Button type="submit" my="10px" w="100%" disabled={!canSubmit}>
        Submit
      </Button>
      {error ? (
        <FormErrorMessage>{error}</FormErrorMessage>
      ) : (
        !canSubmit && (
          <UnorderedList color="red.500">
            {!name && <li>Name is required</li>}
            {price <= 0 && <li>Price must be greater than 0</li>}
          </UnorderedList>
        )
      )}
    </form>
  );
}
