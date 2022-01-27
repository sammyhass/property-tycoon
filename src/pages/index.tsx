import { Box, Flex } from '@chakra-ui/react';
import type { GetStaticProps, NextPage } from 'next';
import Board from '../components/Board';
import { getBoard } from '../lib/getBoard';

const Home: NextPage = () => {
  return (
    <Box bg="black" h="100%">
      <Flex justify={'center'} align={'center'} minH="90vh">
        <Board />
      </Flex>
    </Box>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const settings = await getBoard();
  return {
    props: {
      spaces: settings,
    },
  };
};

export default Home;
