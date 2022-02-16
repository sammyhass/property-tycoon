import AdminLayout from '@/components/UI/admin/AdminLayout';
import { prismaClient } from '@/lib/prisma';
import { Box, Heading } from '@chakra-ui/react';
import { PropertyGroup, PropertyGroupColor } from '@prisma/client';
import { GetServerSideProps } from 'next';
import React from 'react';

interface PropertyGroupPageProps {
  gameId: string;
  propertyGroup: PropertyGroup | null;
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
    },
  });

  return {
    props: {
      gameId,
      propertyGroup,
    },
  };
};
