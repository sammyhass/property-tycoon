import BoardSpace from '@/components/Game/Board/spaces';
import {
  Box,
  Button,
  Collapse,
  Flex,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import { faArrowDown, faArrowUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { BoardSpace as BoardSpaceT, GameProperty } from '@prisma/client';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import BoardSpaceForm from './BoardSpaceForm';

export default function BoardSpacesEditor({
  boardSpaces,
  gameId,
  properties,
}: {
  boardSpaces: BoardSpaceT[];
  properties: GameProperty[];
  gameId: string;
}) {
  const [expanded, setExpanded] = useState<boolean>(true);
  const [selectedSpace, setSelectedSpace] = useState<BoardSpaceT | null>(null);
  const router = useRouter();
  return (
    <Box pos="relative">
      <Button
        onClick={() => setExpanded(!expanded)}
        variant="outline"
        bg="#fff"
        backdropFilter="opacity(0.5)"
        colorScheme="purple"
        my="5px"
        aria-label={`${expanded ? 'Hide' : 'Show'} Board Spaces`}
        leftIcon={
          <FontAwesomeIcon icon={!expanded ? faArrowDown : faArrowUp} />
        }
      >
        {expanded ? 'Hide' : 'Show'} Board Spaces
      </Button>
      <Collapse in={expanded} startingHeight={'50px'}>
        <Flex wrap="wrap">
          {boardSpaces
            .slice()
            .sort((a, b) => a.board_position - b.board_position)
            .map(space => (
              <Box
                key={space.board_position}
                _hover={{ bg: !space.locked ? 'gray.50' : '' }}
                p="10px"
                cursor={space.locked ? 'not-allowed' : 'pointer'}
                onClick={() => !space.locked && setSelectedSpace(space)}
              >
                <BoardSpace
                  property={
                    properties.find(p => p.id === space.property_id) ?? null
                  }
                  {...space}
                />
              </Box>
            ))}
        </Flex>
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
      </Collapse>
    </Box>
  );
}
