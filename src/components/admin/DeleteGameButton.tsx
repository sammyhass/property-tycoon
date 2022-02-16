import { API_URL } from '@/env/env';
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
} from '@chakra-ui/react';
import { Game } from '@prisma/client';
import { useRouter } from 'next/router';
import React, { useState } from 'react';

export default function DeleteGameButton({
  name,
  id,
}: Pick<Game, 'name' | 'id'>) {
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);

  const handleClose = () => setIsOpen(false);
  const handleOpen = () => setIsOpen(true);

  const handleDelete = async () => {
    await fetch(`${API_URL}/game/${id}`, {
      method: 'DELETE',
    });
    router.push('/admin/games');
  };

  return (
    <>
      <Button onClick={handleOpen} colorScheme={'red'}>
        Delete Board
      </Button>
      <Modal isOpen={isOpen} onClose={handleClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete {name}</ModalHeader>
          <ModalBody>
            <Text>Are you sure you want to delete this board?</Text>
            <Button
              onClick={handleClose}
              colorScheme="green"
              mt="10px"
              mr="10px"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              colorScheme="red"
              mt="10px"
              mr="10px"
            >
              Delete
            </Button>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
