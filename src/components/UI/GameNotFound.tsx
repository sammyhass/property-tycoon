import { Box, Heading, Text } from '@chakra-ui/react';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

export default function GameNotFound({
  title = 'Game not found',
  message = 'Check the sharecode and try again.',
}: {
  title?: string;
  message?: string;
}) {
  return (
    <Box
      bg="white"
      my="50px"
      w={'90%'}
      mx="auto"
      borderRadius={'8px'}
      p="10px"
      shadow="md"
    >
      <Heading>
        <FontAwesomeIcon
          icon={faExclamationCircle}
          color="red"
          style={{ margin: '0 2px' }}
        />
        {title}
      </Heading>
      <Text
        size="sm"
        display={'block'}
        p="10px"
        mt="10px"
        borderRadius={'10px'}
      >
        {message}
      </Text>
    </Box>
  );
}
