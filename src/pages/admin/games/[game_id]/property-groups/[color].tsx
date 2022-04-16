import { BoardSpaceProperty } from '@/components/Game/Board/spaces';
import AdminLayout from '@/components/UI/admin/AdminLayout';
import GameNotFound from '@/components/UI/GameNotFound';
import { prismaClient } from '@/lib/prisma';
import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  Flex,
  Heading,
} from '@chakra-ui/react';
import {
  GameProperty,
  PropertyGroup,
  PropertyGroupColor,
} from '@prisma/client';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import React from 'react';

interface PropertyGroupPageProps {
  gameId: string;
  propertyGroup:
    | (PropertyGroup & { Properties: GameProperty[]; Game: { name?: string } })
    | null;
}

export default function PropertyGroupPage({
  gameId,
  propertyGroup,
}: PropertyGroupPageProps) {
  if (!propertyGroup) {
    return <Box />;
  }
  return (
    <AdminLayout>
      <Box>
        <Breadcrumb>
          <BreadcrumbItem>
            <Link href="/admin/games">Game Boards</Link>
          </BreadcrumbItem>

          <BreadcrumbItem>
            <Link href={`/admin/games/${gameId}`}>
              {propertyGroup.Game?.name}
            </Link>
          </BreadcrumbItem>

          <BreadcrumbItem>
            <Link href={`/admin/games/${gameId}/property-groups`}>
              Property Groups
            </Link>
          </BreadcrumbItem>

          <BreadcrumbItem isCurrentPage>
            <Link
              href={`/admin/games/${gameId}/property-groups/${propertyGroup.color}`}
            >
              {propertyGroup.color}
            </Link>
          </BreadcrumbItem>
        </Breadcrumb>
      </Box>
      <Box mt="70px" mx={'auto'} w="800px" maxW={'100%'}>
        <Heading
          textDecorationColor={propertyGroup.color}
          textDecorationStyle={'solid'}
          textDecorationThickness={'4px'}
          textDecorationLine={'underline'}
        >
          {propertyGroup?.color[0].toUpperCase() +
            propertyGroup?.color.slice(1)}
        </Heading>
        <Flex my="10px" gap="10px">
          {propertyGroup.Properties.map(property => (
            <BoardSpaceProperty property={property} key={property.id} />
          ))}
        </Flex>
        {propertyGroup.Properties.length === 0 && (
          <GameNotFound
            message="No properties in this group"
            title="Nothing to show"
          />
        )}
      </Box>
    </AdminLayout>
  );
}

export const getServerSideProps: GetServerSideProps<
  PropertyGroupPageProps
> = async ({ query }) => {
  const gameId = query.game_id as string;
  const color = query.color as string;

  if (!Object.keys(PropertyGroupColor).includes(color)) {
    return {
      redirect: {
        permanent: false,
        destination: '/admin/games/[game_id]/property-groups',
      },
      props: {
        gameId,
        propertyGroup: null,
      },
    };
  }

  const propertyGroup = await prismaClient.propertyGroup.findFirst({
    where: {
      AND: [{ game_id: gameId }, { color: color as PropertyGroupColor }],
    },
    include: {
      Properties: true,
      Game: {
        select: {
          name: true,
        },
      },
    },
  });

  return {
    props: {
      gameId,
      propertyGroup,
    },
  };
};
