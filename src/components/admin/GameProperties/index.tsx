import { BoardSpaceProperty } from '@/components/Game/Board/spaces';
import { Box, Button, Flex, Heading } from '@chakra-ui/react';
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
      <Flex overflow={'auto'} my="10px" gap="5px">
        {properties
          .sort((a, b) =>
            a.property_group_color.localeCompare(b.property_group_color)
          )
          .map(property => (
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

GameProperties.PropertyItem = function PropertyItem(props: GameProperty) {
  return (
    <Link
      href={`/admin/games/${props.game_id}/properties/${props.id}`}
      passHref
    >
      <BoardSpaceProperty property={props} cursor="pointer" />
    </Link>
  );
};
