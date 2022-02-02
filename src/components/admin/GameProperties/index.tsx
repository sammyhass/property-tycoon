import { Box, Button, Flex, Heading, Link, Square } from '@chakra-ui/react';
import { game_property } from '@prisma/client';

export default function GameProperties({
  gameId,
  properties,
}: {
  properties: game_property[];
  gameId: string;
}) {
  return (
    <Box p="10px" boxShadow={'xl'} borderRadius={'8px'}>
      <Heading size="md">Game Properties</Heading>
      <Flex overflow={'auto'}>
        {properties.map(property => (
          <GameProperties.PropertyItem key={property.id} {...property} />
        ))}
      </Flex>
      {properties.length === 0 && <Box>No Properties created yet</Box>}
      <Link href={`/admin/games/${gameId}/property/new`}>
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
}: game_property) {
  return (
    <Link href={`/admin/games/${game_id}/property/${id}`}>
      <Box
        p="10px"
        borderRadius={'8px'}
        _hover={{
          background: '#eee',
        }}
      >
        <Flex>
					<Square size={'50px'} bg={property_group_color} />
          <Heading size="sm">{name}</Heading>
          <Box ml={'auto'}>{price}</Box>
        </Flex>
      </Box>
    </Link>
  );
};
