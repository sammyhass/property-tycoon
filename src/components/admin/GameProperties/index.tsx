import { propertyGroupToCSS } from '@/util/property-colors';
import { Box, Button, Flex, Heading, Square, Text } from '@chakra-ui/react';
import { GameProperty } from '@prisma/client';
import Link from 'next/link';

export default function GameProperties({
  gameId,
  properties,
}: {
  properties: GameProperty[];
  gameId: string;
}) {
  return (
    <Box p="10px" boxShadow={'xl'} borderRadius={'8px'}>
      <Link href={`/admin/games/${gameId}/properties`} passHref>
        <Heading
          size="md"
          cursor={'pointer'}
          _hover={{
            textDecor: 'underline',
          }}
        >
          Game Properties
        </Heading>
      </Link>
      <Flex overflow={'auto'} my="10px">
        {properties.map(property => (
          <GameProperties.PropertyItem key={property.id} {...property} />
        ))}
      </Flex>
      {properties.length === 0 && <Box>No Properties created yet</Box>}
      <Link href={`/admin/games/${gameId}/properties/new`} passHref>
        <Button>Create a New Property</Button>
      </Link>
    </Box>
  );
}

GameProperties.PropertyItem = function PropertyItem({
  game_id,
  id,
  name,
  price,
  property_group_color,
}: GameProperty) {
  return (
    <Link href={`/admin/games/${game_id}/properties/${id}`} passHref>
      <Box
        p="10px"
        cursor={'pointer'}
        borderRadius={'8px'}
        _hover={{
          background: '#eee',
        }}
      >
        <Flex>
          <Square size={'50px'} bg={propertyGroupToCSS[property_group_color]} />
          <Box ml="5px">
            <Heading size="sm">{name}</Heading>
            <Text>£{price}</Text>
          </Box>
        </Flex>
      </Box>
    </Link>
  );
};
