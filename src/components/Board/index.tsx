import { GameContextT } from '@/hooks/useGameContext';
import { Box } from '@chakra-ui/react';
import BoardSpace from './spaces';

export default function GameBoard({
  settings,
}: {
  settings: GameContextT['gameSettings'];
}) {
  return (
    <Box>
      {settings?.BoardSpaces.sort(
        (a, b) => a.board_position - b.board_position
      ).map(space => (
        <BoardSpace
          key={space.board_position}
          property={
            settings?.Properties.find(p => p.id === space.property_id) ?? null
          }
          {...space}
        />
      ))}
    </Box>
  );
}
