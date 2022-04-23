import { useGameContext } from '@/hooks/useGameContext';
import { usePlayer } from '@/hooks/usePlayer';
import { Box, Heading } from '@chakra-ui/react';

export default function RolledDoubles() {
  const { currentPlayer } = useGameContext();
  const { doublesInARow, sendToJail } = usePlayer(
    currentPlayer?.token ?? undefined
  );

  return (
    <Box>
      <Heading>
        You rolled doubles! You can roll again at the end of your turn.
      </Heading>
      <Box>
        <Heading>
          Doubles in a row: {doublesInARow} (3 in a row and you go to jail)
        </Heading>
      </Box>
    </Box>
  );
}
