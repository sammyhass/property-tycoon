import { Box, Button, Flex, Heading, LinkBox } from '@chakra-ui/react';
import { property_group } from '@prisma/client';
import Link from 'next/link';
import React from 'react';

export default function PropertyGroups({
  groups,
  gameId,
}: {
  groups: property_group[];
  gameId: string;
}) {
  return (
    <Box p="10px" boxShadow={'xl'} borderRadius={'8px'}>
      <Heading size="md">Property Groups</Heading>
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
}: property_group) {
  return (
    <Link href={`/admin/games/${game_id}/property-groups/${color}`} passHref>
      <LinkBox bg={color} borderRadius={'8px'} p="20px">
        <Flex>
          <Heading size="sm" color={'whiteAlpha.900'}>
            {color}
          </Heading>
        </Flex>
      </LinkBox>
    </Link>
  );
};
