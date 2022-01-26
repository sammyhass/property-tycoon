import { AspectRatio, Text } from '@chakra-ui/react';
import React from 'react';

const BASE_SIZE = 120;
interface BoardSpaceProps {
  // big only on corners
  big?: boolean;
}

export default function BoardSpace({ big = false }: BoardSpaceProps) {
  return (
    <AspectRatio ratio={big ? 1 : 2} h={`${BASE_SIZE}px`} w={'auto'}>
      <Text>Board</Text>
    </AspectRatio>
  );
}
