import GameProperties from '@/components/admin/GameProperties';
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
import { Game, GameProperty } from '@prisma/client';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import React from 'react';

export default function GamePropertiesPage({
  game,
}: {
  gameId: string;
  game: (Game & { Properties: GameProperty[] }) | null;
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
        <Link href={`/admin/games/${game?.id}/properties/new`} passHref>
          <Button colorScheme={'green'}>Add New Property</Button>
        </Link>
      </Flex>

      {(!game || game?.Properties.length === 0) && (
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
      <GameProperties
        gameId={game?.id ?? ''}
        properties={
          game?.Properties.sort((a, b) =>
            a.property_group_color.localeCompare(b.property_group_color)
          ) ?? []
        }
      />
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
          Properties: true,
        },
      });

      return {
        props: {
          game,
        },
      };
    }
);
