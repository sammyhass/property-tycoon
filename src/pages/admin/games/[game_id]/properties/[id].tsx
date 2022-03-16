import AdminLayout from '@/components/UI/admin/AdminLayout';
import { enforceAuth } from '@/lib/checkAuth';
import { prismaClient } from '@/lib/prisma';
import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Heading,
} from '@chakra-ui/react';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { GameProperty } from '@prisma/client';
import axios from 'axios';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';

interface PropertiesPageProps {
  property: GameProperty & { Game: { name: string; id: string } };
}

export default function PropertyPage({ property }: PropertiesPageProps) {
  const router = useRouter();

  const handleDeleteProperty = async () => {
    const { status } = await axios.delete(
      `/api/game/${property.Game.id}/game_properties/${property.id}`
    );

    if (status === 200) {
      router.push(`/admin/games/${property.Game.id}/properties`);
    }
  };

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
      <Button
        mt="10px"
        colorScheme={'red'}
        leftIcon={<FontAwesomeIcon icon={faTrash} />}
        onClick={() => handleDeleteProperty()}
      >
        Delete
      </Button>
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
