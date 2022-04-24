import { GameModeT } from '@/hooks/useGameContext';
import { Box, Button, ButtonGroup, Heading, Text } from '@chakra-ui/react';

export default function GameModePicker({
  value,
  onChange,
}: {
  value: GameModeT;
  onChange: (value: GameModeT) => void;
}) {
  return (
    <Box
      bg="white"
      border={'2px solid'}
      borderColor="purple.200"
      mt="20px"
      p="10px"
      borderRadius={'8px'}
    >
      <Heading size="md" mb="10px">
        Game Mode
      </Heading>
      <ButtonGroup
        gap="5px"
        w="100%"
        display={'grid'}
        gridTemplateColumns="1fr 1fr"
      >
        <GameModeBox
          mode="normal"
          selected={value === 'normal'}
          onClick={onChange}
        />
        <GameModeBox
          mode="timed"
          selected={value === 'timed'}
          onClick={onChange}
        />
      </ButtonGroup>
    </Box>
  );
}

const GameModeBox = ({
  mode,
  selected,
  onClick,
}: {
  mode: GameModeT;
  selected: boolean;
  onClick: (mode: GameModeT) => void;
}) => {
  return (
    <Box
      as={Button}
      size="lg"
      onClick={onClick ? () => onClick(mode) : undefined}
      colorScheme={selected ? 'purple' : 'gray'}
      flexShrink={0}
      gap="5px"
      justifyItems={'center'}
      p="40px 20px"
      flexDir={'column'}
    >
      <Text fontSize={'4xl'}>{mode === 'normal' ? '💯' : '🕒'}</Text>
      {mode[0].toUpperCase().concat(mode.slice(1).toLowerCase())}
    </Box>
  );
};
