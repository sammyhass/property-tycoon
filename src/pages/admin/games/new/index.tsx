import NewGameForm from '@/components/admin/Games/NewGameForm';
import AdminLayout from '@/components/UI/admin/AdminLayout';
import { Box, Heading } from '@chakra-ui/react';
import React from 'react';

export default function AdminNewGame() {
  return (
    <AdminLayout>
      <Box
        m={'auto'}
        boxShadow={'xl'}
        borderRadius={'8px'}
        p="20px"
        border={'1px solid #eee'}
        marginTop="150px"
        w="80%"
        mx={'auto'}
      >
        <Heading>Create a New Game Board</Heading>
        <Box>
          <Box>
            <NewGameForm />
          </Box>
        </Box>
      </Box>
    </AdminLayout>
  );
}
