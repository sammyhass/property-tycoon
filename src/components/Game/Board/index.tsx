import { GameContextT, TokenType } from '@/hooks/useGameContext';
import { Flex } from '@chakra-ui/react';
import BoardSpace from './spaces';

// Gameboard with players on the board
export interface GameBoardProps {
  settings: GameContextT['gameSettings'];
  positions: { [key in keyof GameContextT['state']]: number };
}

export default function GameBoard({ positions, settings }: GameBoardProps) {
  return (
    <Flex wrap="wrap" transformOrigin="0 0">
      {(settings?.BoardSpaces ?? [])
        .sort((a, b) => a.board_position - b.board_position)
        .map(space => (
          <BoardSpace
            hasPlayers={Object.keys(positions ?? {})
              .filter(
                key => positions[key as TokenType] === space.board_position
              )
              .map(v => v as TokenType)}
            key={space.board_position}
            property={
              settings?.Properties.find(p => p.id === space.property_id) ?? null
            }
            {...space}
          />
        ))}
    </Flex>
  );
}
