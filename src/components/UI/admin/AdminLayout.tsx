import { Box } from '@chakra-ui/react';
import Head from 'next/head';
import React from 'react';
import Navbar from './Navbar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Head>
        <title>Property Tycoon</title>
      </Head>
      <Box maxW="100vw" overflowX="hidden">
        <Navbar />
        <Box w="90%" mt="70px" mx="auto" mb="150px">
          {children}
        </Box>
      </Box>
    </>
  );
}
