import { useGameContext } from '@/hooks/useGameContext';
import { formatPrice } from '@/util/formatPrice';
import { Box, Button, Flex, Heading } from '@chakra-ui/react';
import React, { useCallback, useState } from 'react';

export default function ActionModalGo() {
  const { payBank, currentPlayer, hideActionModal } = useGameContext();

  const [loading, setLoading] = useState(false);

  const collect = useCallback(() => {
    setLoading(true);
    if (!currentPlayer) return;
    payBank(currentPlayer.token, -200);

    setTimeout(() => {
      setLoading(false);

      hideActionModal();
    }, 500);
  }, [currentPlayer, payBank, hideActionModal]);

  if (!currentPlayer) return <></>;

  return (
    <Flex direction={'column'} gap="5px" align={'center'}>
      <Heading size="4xl">🎉</Heading>
      <Heading size="md">You landed on Go!</Heading>
      <Box>Collect {formatPrice(200)} from the bank!</Box>
      <Button
        w="100%"
        colorScheme={'green'}
        isLoading={loading}
        onClick={collect}
      >
        Collect £200
      </Button>
    </Flex>
  );
}
