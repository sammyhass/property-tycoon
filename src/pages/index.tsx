import AdminLayout from '@/components/UI/admin/AdminLayout';
import { Box, Flex } from '@chakra-ui/react';
import type { NextPage } from 'next';
import Board from '../components/UI/Board/Board';

const Home: NextPage = () => {
  return (
    <AdminLayout>
      <Box bg="black" h="100%">
        <Flex justify={'center'} align={'center'} minH="90vh">
          <Board />
        </Flex>
      </Box>
    </AdminLayout>
  );
};

export default Home;
