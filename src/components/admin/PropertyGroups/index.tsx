import { Box, Button, Flex, Heading, LinkBox, Text } from '@chakra-ui/react';
import { GameProperty, PropertyGroup } from '@prisma/client';
import Link from 'next/link';
import React from 'react';
import GameProperties from '../GameProperties';

export default function PropertyGroups({
  groups,
  gameId,
}: {
  groups: PropertyGroup[];
  gameId: string;
}) {
  return (
    <Box p="10px" boxShadow={'xl'} borderRadius={'8px'}>
      <Link href={`/admin/games/${gameId}/property-groups`} passHref>
        <Heading
          cursor="pointer"
          size="md"
          _hover={{
            textDecor: 'underline',
          }}
        >
          Property Groups
        </Heading>
      </Link>
      {groups.length === 0 && <Box>No Property Groups created yet</Box>}
      <Flex overflow={'auto'} gap="10px" my="10px">
        {groups.map(group => (
          <PropertyGroups.GroupItem key={group.color} {...group} />
        ))}
      </Flex>
      <Link href={`/admin/games/${gameId}/property-groups/new`} passHref>
        <Button>New Property Group</Button>
      </Link>
    </Box>
  );
}

PropertyGroups.GroupItem = function GroupItem({
  game_id,
  color,
  Properties,
}: PropertyGroup & {
  Properties?: GameProperty[];
}) {
  return (
    <Link href={`/admin/games/${game_id}/property-groups/${color}`} passHref>
      <LinkBox
        borderRadius={'8px'}
        px="20px"
        cursor={'pointer'}
        py="10px"
        border={'1px solid #eee'}
        boxShadow={'xl'}
        borderTop="solid"
        borderTopWidth={'20px'}
        borderTopColor={color}
      >
        <Flex>
          <Heading size="sm">{color}</Heading>
        </Flex>
        {Properties &&
          Properties.map(p => (
            <GameProperties.PropertyItem key={p.id} {...p} />
          ))}
        {typeof Properties === 'object' && Properties.length === 0 ? (
          <Text>No Properties in this group</Text>
        ) : (
          <span />
        )}
      </LinkBox>
    </Link>
  );
};
