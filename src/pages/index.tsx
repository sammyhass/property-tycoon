import { Box, Flex } from '@chakra-ui/react';
import type { NextPage } from 'next';
import Board from '../components/Board';

const Home: NextPage = () => {
  return (
    <Box bg="black" h="100%">
      <Flex justify={'center'} align={'center'} minH="90vh">
        <Board />
      </Flex>
    </Box>
  );
};

export default Home;
