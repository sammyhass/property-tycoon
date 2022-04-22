import { useGameContext } from '@/hooks/useGameContext';
import { Button, Flex, Heading, Text } from '@chakra-ui/react';
import React from 'react';

export default function GoToJailContent() {
  const { sendToJail, currentPlayer, hideActionModal, gameSettings } =
    useGameContext();

  const handleGoToJail = () => {
    if (!currentPlayer) return;
    sendToJail(currentPlayer?.token);

    setTimeout(() => {
      hideActionModal();
    }, 1000);
  };

  return (
    <Flex direction={'column'} justify={'center'} align="center">
      <Heading size="md">Go To Jail</Heading>
      <Text>You have been sent to jail</Text>
      <Button onClick={() => handleGoToJail()}>Go To Jail</Button>
    </Flex>
  );
}
