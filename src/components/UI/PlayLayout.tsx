import { Box } from '@chakra-ui/react';
import React from 'react';

/**
 * Component to wrap around play page for layout.
 */
export default function PlayGameLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Box w="100vw" h="100vh" overflow={'hidden'} bg="green.400">
      {children}
    </Box>
  );
}
