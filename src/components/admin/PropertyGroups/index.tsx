import { propertyGroupToCSS } from '@/util/property-colors';
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
      <Flex overflow={'auto'} gap="10px" py="15px" flexGrow={'0'}>
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
  hotel_cost,
  house_cost,
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
        borderTop="solid"
        borderTopWidth={'20px'}
        flexShrink="0"
        borderTopColor={propertyGroupToCSS[color]}
      >
        <Flex align="center">
          <Heading flex="1" size="sm">
            {color}
          </Heading>
          {(hotel_cost !== null || house_cost !== null) && (
            <Box ml="25px">
              Hotel Price: £{hotel_cost}
              <br />
              House Price: £{house_cost}
            </Box>
          )}
        </Flex>
        <Flex wrap={'wrap'} gap="10px">
          {Properties &&
            Properties.map(p => (
              <GameProperties.PropertyItem key={p.id} {...p} />
            ))}
        </Flex>
        {typeof Properties === 'object' && Properties.length === 0 ? (
          <Text>No Properties in this group</Text>
        ) : (
          <span />
        )}
      </LinkBox>
    </Link>
  );
};
