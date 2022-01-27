import { Box, Flex } from '@chakra-ui/react';
import type { GetStaticProps, NextPage } from 'next';
import Board from '../components/Board';
import { supabase } from '../lib/supabase';
import { definitions } from '../types/db-types';

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
  const { body } = await supabase
    .from<definitions['board_space']>('board_space')
    .select('*');
  return {
    props: {
      spaces: body,
    },
  };
};

export default Home;
