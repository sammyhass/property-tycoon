import AdminLayout from '@/components/UI/admin/AdminLayout';
import {
  Box,
  Button,
  Flex,
  Heading,
  Link,
  Spacer,
  Text,
} from '@chakra-ui/react';
import { game, game_property } from '@prisma/client';
import React from 'react';

export default function GamePropertiesPage({
  game,
}: {
  gameId: string;
  game: (game & { game_properties: game_property[] }) | null;
}) {
  return (
    <AdminLayout>
      <Flex aling="center">
        <Heading>Game Properties</Heading>
        <Spacer />
        <Link href={`/admin/games/${game?.id}/properties/new`}>
          <Button colorScheme={'green'}>Add New Property</Button>
        </Link>
      </Flex>

      {game?.game_properties.length === 0 && (
        <Box
          w="100%"
          display={'flex'}
          height="200px"
          alignItems={'center'}
          bg={'gray.100'}
          borderRadius={'8px'}
          justifyContent={'center'}
        >
          <Text m="0" p="0">
            No Properties Found
          </Text>
        </Box>
      )}
    </AdminLayout>
  );
}
