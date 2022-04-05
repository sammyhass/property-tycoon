import PropertyGroups from '@/components/admin/PropertyGroups';
import AdminLayout from '@/components/UI/admin/AdminLayout';
import { prismaClient } from '@/lib/prisma';
import {
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Grid,
  Heading,
} from '@chakra-ui/react';
import { Prisma, PrismaClient } from '@prisma/client';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import React from 'react';

export const getPropertyGroups = async (pc: PrismaClient, gameId: string) => {
  return await pc.propertyGroup.findMany({
    where: {
      game_id: gameId,
    },
    include: {
      Properties: true,
    },
  });
};

type PropertyGroupsT = Prisma.PromiseReturnType<typeof getPropertyGroups>;

interface PropertyGroupsProps {
  gameId: string;
  groups: PropertyGroupsT;
}

export default function PropertyGroupsPage({
  gameId,
  groups,
}: PropertyGroupsProps) {
  return (
    <AdminLayout>
      <Breadcrumb>
        <BreadcrumbItem>
          <Link href="/admin/games">Game Boards</Link>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <Link href={`/admin/games/${gameId}`}>Game</Link>
        </BreadcrumbItem>
        <BreadcrumbItem isCurrentPage>
          <Link href={`/admin/games/${gameId}/property-groups`}>
            Property Groups
          </Link>
        </BreadcrumbItem>
      </Breadcrumb>
      <Heading>Property Groups</Heading>
      <Link href={`/admin/games/${gameId}/property-groups/new`} passHref>
        <Button my="10px">New Group</Button>
      </Link>
      <Grid
        templateColumns={'repeat(auto-fill, minmax(350px, 1fr))'}
        gap="15px"
      >
        {groups.map(g => (
          <PropertyGroups.GroupItem
            {...g}
            Properties={g.Properties ?? []}
            key={g.color}
          />
        ))}
      </Grid>
    </AdminLayout>
  );
}

export const getServerSideProps: GetServerSideProps<
  PropertyGroupsProps
> = async ({ query }) => {
  const game_id = query.game_id as string;

  const groups = await getPropertyGroups(prismaClient, game_id);

  return {
    props: {
      gameId: query.game_id as string,
      groups,
    },
  };
};
