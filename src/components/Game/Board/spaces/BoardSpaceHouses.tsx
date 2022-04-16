import { Flex } from '@chakra-ui/react';

export default function BoardSpaceHouses({ nHouses }: { nHouses: number }) {
  return (
    <Flex gap="3px" mb="4px">
      {nHouses > 4 ? (
        <Hotel />
      ) : (
        new Array(nHouses).fill(0).map((_, i) => <House key={i} />)
      )}
    </Flex>
  );
}

export function House() {
  return (
    <Flex
      borderRadius="2px"
      justify={'center'}
      align="center"
      bg="green"
      h="30px"
      w="15px"
      pos="relative"
    >
      🏠
    </Flex>
  );
}

export function Hotel() {
  return (
    <Flex
      justify={'center'}
      align="center"
      borderRadius="2px"
      bg="red"
      h="30px"
      w="35px"
      pos="relative"
    >
      🏨
    </Flex>
  );
}
