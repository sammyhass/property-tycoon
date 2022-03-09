import AdminLayout from '@/components/UI/admin/AdminLayout';
import { Box, Button, ButtonGroup, Heading } from '@chakra-ui/react';
import type { NextPage } from 'next';
import Link from 'next/link';

const Home: NextPage = () => {
  return (
    <AdminLayout>
      <Heading>Welcome to Property Tycoon!</Heading>
      <Box bg="#eee" p="20px" borderRadius={'8px'} boxShadow="sm">
        <ButtonGroup spacing={'10px'}>
          <Link passHref href="/play">
            <Button size="lg" colorScheme={'green'}>
              Play
            </Button>
          </Link>
          <Link passHref href="/admin/games">
            <Button size="lg" colorScheme={'teal'}>
              Manage your Games
            </Button>
          </Link>
          <Link passHref href="#">
            <Button size="lg" colorScheme={'purple'}>
              Explore Boards
            </Button>
          </Link>
        </ButtonGroup>
      </Box>
    </AdminLayout>
  );
};

export default Home;
