import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Table,
  Tbody,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import { BoardSpace, GameProperty } from '@prisma/client';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import BoardSpaceForm from './BoardSpaceForm';

export default function BoardSpacesEditor({
  boardSpaces,
  gameId,
  properties,
}: {
  boardSpaces: BoardSpace[];
  properties: GameProperty[];
  gameId: string;
}) {
  const [selectedSpace, setSelectedSpace] = useState<BoardSpace | null>(null);
  const router = useRouter();
  return (
    <>
      <Table>
        <Thead>
          <Tr>
            <Th>Position</Th>
            <Th>Space Type</Th>
            <Th>Property at Space</Th>
            <Th>Card Type</Th>
          </Tr>
        </Thead>
        <Tbody>
          {boardSpaces
            .slice()
            .sort((a, b) => a.board_position - b.board_position)
            .map((space, i) => (
              <Tr
                key={space.board_position}
                _hover={{ bg: 'gray.50' }}
                cursor="pointer"
                onClick={() => setSelectedSpace(space)}
              >
                <Th>{space.board_position}</Th>
                <Th>{space.space_type}</Th>
                <Th>
                  {properties.find(p => p.id === space.property_id)?.name}
                </Th>
                <Th>{space.take_card}</Th>
              </Tr>
            ))}
        </Tbody>
      </Table>
      <Modal isOpen={!!selectedSpace} onClose={() => setSelectedSpace(null)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {selectedSpace &&
              `Editing position ${selectedSpace.board_position}`}
          </ModalHeader>
          <ModalBody>
            {selectedSpace && (
              <BoardSpaceForm
                onComplete={space => {
                  setSelectedSpace(null);
                  setTimeout(() => {
                    router.reload();
                  }, 100);
                }}
                gameId={gameId}
                properties={properties}
                boardSpace={selectedSpace}
              />
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
