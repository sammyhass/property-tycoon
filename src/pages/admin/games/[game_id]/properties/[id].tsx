import AdminLayout from '@/components/UI/admin/AdminLayout';
import { enforceAuth } from '@/lib/checkAuth';
import { prismaClient } from '@/lib/prisma';
import { Box, Breadcrumb, BreadcrumbItem, Heading } from '@chakra-ui/react';
import { game_property } from '@prisma/client';
import { GetServerSideProps } from 'next';
import Link from 'next/link';

interface PropertiesPageProps {
  property: game_property & { game: { name: string; id: string } };
}

export default function PropertyPage({ property }: PropertiesPageProps) {
  return (
    <AdminLayout>
      <Breadcrumb>
        <BreadcrumbItem>
          <Link href="/admin/games">Game Boards</Link>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <Link href={`/admin/games/${property.game.id}`}>
            {property.game.name}
          </Link>
        </BreadcrumbItem>
        <BreadcrumbItem isCurrentPage>
          <Link href={`/admin/games/${property.game.id}/properties`}>
            Properties
          </Link>
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
      const property = await prismaClient.game_property.findFirst({
        where: {
          id: params?.id as string,
          game_id: params?.game_id as string,
        },
        include: {
          board_space: true,
          property_group: true,
          game: {
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
            name: property?.game?.name,
            id: property?.game?.id,
          },
        },
      };
    }
);
