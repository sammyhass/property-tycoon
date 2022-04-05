import { TOKENS_MAP, TokenType } from '@/hooks/useGameContext';
import { Box, Text } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import React from 'react';

export default function PlayerToken({ token }: { token: TokenType }) {
  return (
    <Box
      as={motion.div}
      layoutId={`player-${token}`}
      fontSize={'1.5rem'}
      bg="white"
      mx="5px"
      boxShadow={'md'}
      borderRadius={'50%'}
      shadow="lg"
      minWidth={'40px'}
      minHeight={'40px'}
      display={'flex'}
      alignItems={'center'}
      children={<Text>{TOKENS_MAP[token]}</Text>}
      justifyContent={'center'}
    />
  );
}
