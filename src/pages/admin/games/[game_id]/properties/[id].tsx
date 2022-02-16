import AdminLayout from '@/components/UI/admin/AdminLayout';
import { enforceAuth } from '@/lib/checkAuth';
import { prismaClient } from '@/lib/prisma';
import { Box, Breadcrumb, BreadcrumbItem, Heading } from '@chakra-ui/react';
import { GameProperty } from '@prisma/client';
import { GetServerSideProps } from 'next';
import Link from 'next/link';

interface PropertiesPageProps {
  property: GameProperty & { Game: { name: string; id: string } };
}

export default function PropertyPage({ property }: PropertiesPageProps) {
  return (
    <AdminLayout>
      <Breadcrumb>
        <BreadcrumbItem>
          <Link href="/admin/games">Game Boards</Link>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <Link href={`/admin/games/${property.Game.id}`}>
            {property.Game.name}
          </Link>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <Link href={`/admin/games/${property.Game.id}/properties`}>
            Properties
          </Link>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <Link href="#">{property.name}</Link>
        </BreadcrumbItem>
      </Breadcrumb>
      <Heading>{property.name}</Heading>
      <Box>
        <pre>{JSON.stringify(property, null, 2)}</pre>
      </Box>
    </AdminLayout>
  );
}

export const getServerSideProps: GetServerSideProps = enforceAuth(
  user =>
    async ({ params }) => {
      const property = await prismaClient.gameProperty.findFirst({
        where: {
          id: params?.id as string,
          game_id: params?.game_id as string,
        },
        include: {
          BoardSpace: true,
          PropertyGroup: true,
          Game: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      return {
        props: {
          property,
          game: {
            name: property?.Game?.name,
            id: property?.Game?.id,
          },
        },
      };
    }
);
