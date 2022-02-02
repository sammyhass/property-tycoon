import NewPropertyForm from '@/components/admin/GameProperties/NewPropertyForm';
import AdminLayout from '@/components/UI/admin/AdminLayout';
import { prismaClient } from '@/lib/prisma';
import { Box, Heading } from '@chakra-ui/react';
import { property_group } from '@prisma/client';
import { GetServerSideProps } from 'next';
import React from 'react';
import { getPropertyGroups } from '../property-groups';

interface NewPropertyPageProps {
  gameId: string;
  groups: property_group[];
}
export default function NewPropertyPage({
  gameId,
  groups,
}: NewPropertyPageProps) {
  return (
    <AdminLayout>
      <Box
        w="600px"
        maxW={'100%'}
        mx="auto"
        mt="70px"
        boxShadow={'xl'}
        border="1px solid #eee"
        p="15px"
        borderRadius={'8px'}
      >
        <Heading>Create a New Property</Heading>
        <NewPropertyForm gameId={gameId} existingGroups={groups} />
      </Box>
    </AdminLayout>
  );
}

export const getServerSideProps: GetServerSideProps<
  NewPropertyPageProps
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
