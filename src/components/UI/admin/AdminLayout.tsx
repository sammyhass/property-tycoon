import { Box } from '@chakra-ui/react';
import Head from 'next/head';
import React from 'react';
import AdminNavbar from './AdminNavbar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Head>
        <title>Property Tycoon Admin</title>
      </Head>
      <div>
        <AdminNavbar />
        <Box w="90%" mt="70px" mx="auto">
          {children}
        </Box>
      </div>
    </>
  );
}
