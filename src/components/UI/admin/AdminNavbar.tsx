import { Flex, Heading, Spacer } from '@chakra-ui/react';
import React from 'react';

export default function AdminNavbar() {
  return (
    <Flex w="100%" bg={'darkviolet'} p={'20px'}>
      <Heading color="white">Property Tycoon Admin</Heading>
      <Spacer />
    </Flex>
  );
}
