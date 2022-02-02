import AdminLayout from '@/components/UI/admin/AdminLayout';
import { useGameContext } from '@/hooks/useGameContext';
import { Box, Flex } from '@chakra-ui/react';
import type { NextPage } from 'next';
import Board from '../components/UI/Board/Board';

const Home: NextPage = () => {
  const { boardSize, cellSize } = useGameContext();

  return (
    <AdminLayout>
      <Box bg="black" h="100%">
        <Flex justify={'center'} align={'center'} minH="90vh">
          <Board boardSize={boardSize} cellSize={cellSize} />
        </Flex>
      </Box>
    </AdminLayout>
  );
};

export default Home;
