import { prismaClient } from '@/lib/prisma';
import { Prisma, PrismaClient } from '@prisma/client';
import { GetServerSideProps } from 'next';
import React from 'react';

export const getPropertyGroups = async (pc: PrismaClient, gameId: string) => {
  return await pc.property_group.findMany({
    where: {
      game_id: gameId,
    },
  });
};

type PropertyGroupsT = Prisma.PromiseReturnType<typeof getPropertyGroups>;

interface PropertyGroupsProps {
  gameId: string;
  groups: PropertyGroupsT;
}

export default function PropertyGroupsPage() {
  return <div>Property Groups Page</div>;
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const game_id = query.game_id as string;

  const groups = await getPropertyGroups(prismaClient, game_id);

  return {
    props: {
      gameId: query.game_id as string,
      groups,
    },
  };
};
