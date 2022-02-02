import NewPropertyGroupForm from '@/components/admin/PropertyGroups/NewGroupForm';
import AdminLayout from '@/components/UI/admin/AdminLayout';
import { prismaClient } from '@/lib/prisma';
import { Box } from '@chakra-ui/react';
import { property_group } from '@prisma/client';
import { GetServerSideProps } from 'next';
import React from 'react';

export default function NewPropertyGroupPage({
  gameId,
  propertyGroups,
}: {
  gameId: string;
  propertyGroups: property_group[];
}) {
  return (
    <AdminLayout>
      <Box w="600px" mt="60px" mx="auto" maxW={'100%'}>
        <NewPropertyGroupForm gameId={gameId} existingGroups={propertyGroups} />
      </Box>
    </AdminLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const propertyGroups = await prismaClient.property_group.findMany({
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
