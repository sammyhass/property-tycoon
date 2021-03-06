import NewPropertyGroupForm from '@/components/admin/PropertyGroups/NewGroupForm';
import AdminLayout from '@/components/UI/admin/AdminLayout';
import { prismaClient } from '@/lib/prisma';
import { Box, Breadcrumb, BreadcrumbItem } from '@chakra-ui/react';
import { PropertyGroup } from '@prisma/client';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import React from 'react';

export default function NewPropertyGroupPage({
  gameId,
  propertyGroups,
}: {
  gameId: string;
  propertyGroups: PropertyGroup[];
}) {
  return (
    <AdminLayout>
      <Breadcrumb>
        <BreadcrumbItem>
          <Link href="/admin/games">Game Boards</Link>
        </BreadcrumbItem>

        <BreadcrumbItem>
          <Link href={`/admin/games/${gameId}`}>Game</Link>
        </BreadcrumbItem>

        <BreadcrumbItem>
          <Link href={`/admin/games/${gameId}/property-groups`}>
            Property Groups
          </Link>
        </BreadcrumbItem>

        <BreadcrumbItem isCurrentPage>
          <Link href={`/admin/games/${gameId}/property-groups/new`}>
            New Property Group
          </Link>
        </BreadcrumbItem>
      </Breadcrumb>
      <Box w="600px" mt="60px" mx="auto" maxW={'100%'}>
        <NewPropertyGroupForm gameId={gameId} existingGroups={propertyGroups} />
      </Box>
    </AdminLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const propertyGroups = await prismaClient.propertyGroup.findMany({
    where: {
      game_id: query.game_id as string,
    },
  });

  return {
    props: {
      gameId: query.game_id as string,
      propertyGroups,
    },
  };
};
