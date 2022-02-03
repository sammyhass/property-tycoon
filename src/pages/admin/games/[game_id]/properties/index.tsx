import AdminLayout from '@/components/UI/admin/AdminLayout';
import { enforceAuth } from '@/lib/checkAuth';
import { prismaClient } from '@/lib/prisma';
import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Flex,
  Heading,
  Spacer,
  Text,
} from '@chakra-ui/react';
import { game, game_property } from '@prisma/client';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import React from 'react';

export default function GamePropertiesPage({
  game,
}: {
  gameId: string;
  game: (game & { game_properties: game_property[] }) | null;
}) {
  return (
    <AdminLayout>
      <Breadcrumb>
        <BreadcrumbItem>
          <Link href="/admin/games">Game Boards</Link>
        </BreadcrumbItem>

        <BreadcrumbItem>
          <Link href={`/admin/games/${game?.id}`}>{game?.name}</Link>
        </BreadcrumbItem>

        <BreadcrumbItem>
          <Link href={`/admin/games/${game?.id}/properties`}>Properties</Link>
        </BreadcrumbItem>
      </Breadcrumb>
      <Flex align="center">
        <Heading p="0" m="0">
          Game Properties
        </Heading>
        <Spacer />
        <Link href={`/admin/games/${game?.id}/properties/new`}>
          <Button colorScheme={'green'}>Add New Property</Button>
        </Link>
      </Flex>

      {(!game || game?.game_properties.length === 0) && (
        <Box
          w="100%"
          mt="10px"
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

export const getServerSideProps: GetServerSideProps = enforceAuth(
  user =>
    async ({ query }) => {
      const game_id = query.game_id as string;

      const game = await prismaClient.game.findFirst({
        where: {
          id: game_id,
          user_id: user.id,
        },
        include: {
          game_properties: true,
        },
      });

      return {
        props: {
          game,
        },
      };
    }
);
