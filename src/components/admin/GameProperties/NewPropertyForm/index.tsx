import BoardSpace, {
  BOARD_SPACE_ASPECT_RATIO,
} from '@/components/Board/spaces';
import { API_URL } from '@/env/env';
import { propertyGroupToCSS } from '@/util/property-colors';
import {
  Alert,
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Heading,
  Input,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
  UnorderedList,
} from '@chakra-ui/react';
import {
  GameProperty,
  PropertyGroup,
  PropertyGroupColor,
} from '@prisma/client';
import axios from 'axios';
import { useRouter } from 'next/router';
import React, { useCallback, useMemo, useState } from 'react';

type RentInputT = Pick<
  GameProperty,
  | 'rent_unimproved'
  | 'rent_one_house'
  | 'rent_two_house'
  | 'rent_three_house'
  | 'rent_four_house'
  | 'rent_hotel'
>;

export default function NewPropertyForm({
  gameId,
  existingGroups = [],
}: {
  gameId: string;
  existingGroups: PropertyGroup[];
}) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [propertyGroup, setPropertyGroup] = useState<PropertyGroupColor>(
    existingGroups[0]?.color
  );

  // Rents are an array of numbers with rent for: unimproved, +1 house, +2 house, ..., +hotel
  const [rents, setRents] = useState<RentInputT>({
    rent_unimproved: 0,
    rent_one_house: 0,
    rent_two_house: 0,
    rent_three_house: 0,
    rent_four_house: 0,
    rent_hotel: 0,
  });

  const handleChangeRent = (t: keyof RentInputT, rent: number) => {
    setRents({
      ...rents,
      [t]: rent,
    });
  };

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
          ...rents,
        } as Pick<
          GameProperty,
          'name' | 'price' | 'property_group_color' | keyof RentInputT
        >
      );
      if (status !== 200) {
        setError(data.message ?? 'Error, please try again');
      }

      router.push(`/admin/games/${gameId}`);
    },
    [gameId, name, price, propertyGroup, router, rents]
  );

  return (
    <Flex flexShrink={0} wrap="wrap">
      <form
        onSubmit={e => canSubmit && onSubmit(e)}
        style={{ flexShrink: 0, flex: 1, minWidth: '70%' }}
      >
        {(existingGroups?.length ?? 0) < 1 && (
          <Alert variant="left-accent" colorScheme={'red'}>
            You must create a property group before creating any properties.
          </Alert>
        )}
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
            bg={propertyGroupToCSS[propertyGroup]}
            color="white"
            fontWeight={'bold'}
            onChange={e =>
              setPropertyGroup(e.target.value as PropertyGroupColor)
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
        {![
          'STATION' as PropertyGroupColor,
          'UTILITIES' as PropertyGroupColor,
        ].includes(propertyGroup) && (
          <FormControl>
            <FormLabel m="0" p="0">
              Rent
            </FormLabel>
            <Flex p="5px" direction={'column'} gap="10px">
              {Object.keys(rents).map(r => (
                <>
                  <FormLabel fontSize={'xs'} m="0" p="0">
                    {r}
                  </FormLabel>
                  <NumberInput
                    m="0"
                    value={rents[r as keyof RentInputT] as number}
                    keepWithinRange
                    defaultValue={0}
                    min={0}
                    onChange={(_, n) =>
                      handleChangeRent(r as keyof RentInputT, n)
                    }
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </>
              ))}
            </Flex>
          </FormControl>
        )}

        <Button
          type="submit"
          my="10px"
          w="100%"
          disabled={!canSubmit}
          colorScheme="green"
        >
          Submit
        </Button>
        {error ? (
          <FormErrorMessage>{error}</FormErrorMessage>
        ) : (
          !canSubmit && (
            <UnorderedList color="red.500">
              {!name && <li>Name is required</li>}
              {price <= 0 && <li>Price must be greater than 0</li>}
              {Object.values(rents).filter(r => !r || r <= 0 || isNaN(r))
                .length > 0 && (
                <li>Rent values must all be positive numbers</li>
              )}
            </UnorderedList>
          )
        )}
      </form>
      <Box p="10px" shadow="md" mx="10px" height="fit-content" minW="200px">
        <Heading fontSize="lg" mb="10px">
          Preview
        </Heading>
        <BoardSpace.Property
          w={175}
          h={155 * BOARD_SPACE_ASPECT_RATIO}
          fontSize={'lg'}
          property={{
            name: !!name ? name : 'New Property',
            price: price ?? 0,
            property_group_color: propertyGroup,
            ...rents,
            game_id: gameId,
            id: '',
          }}
        />
      </Box>
    </Flex>
  );
}
