import { TOKENS_MAP, TokenType } from '@/hooks/useGameContext';
import { Box } from '@chakra-ui/react';
import React from 'react';

export default function PlayerToken({ token }: { token: TokenType }) {
  return (
    <Box
      fontSize={'1.5rem'}
      bg="white"
      mx="5px"
      p="4px"
      boxShadow={'md'}
      borderRadius={'50%'}
      minWidth={'30px'}
      minHeight={'30px'}
      display={'flex'}
      alignItems={'center'}
      justifyContent={'center'}
    >
      {TOKENS_MAP[token]}
    </Box>
  );
}
