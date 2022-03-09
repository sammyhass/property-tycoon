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
    <Box bg="#333" minH="100vh" pb="50px">
      {children}
    </Box>
  );
}
