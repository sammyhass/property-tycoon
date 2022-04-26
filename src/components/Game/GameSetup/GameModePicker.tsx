import { GameModeT, useGameContext } from '@/hooks/useGameContext';
import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  Heading,
  Slider,
  SliderFilledTrack,
  SliderProps,
  SliderThumb,
  SliderTrack,
  Text,
  Tooltip,
} from '@chakra-ui/react';

export type GameModeOnChange<T extends GameModeT> = (
  value: T,
  payload: T extends 'timed' ? number : null
) => void;

export default function GameModePicker() {
  const { handleChangeGameMode, mode, timeLimit } = useGameContext();

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
          selected={mode === 'normal'}
          description="The game is played until there is only one player left and all 
          other players have retired from the game due to bankruptcy"
          onClick={() => {
            handleChangeGameMode('normal', null);
          }}
        />
        <GameModeBox
          mode="timed"
          selected={mode === 'timed'}
          description="A time limit is agreed at the outset by all 
          players. When the time limit is reached, and the players have all taken the same number of 
          turns, the game ends. Each player then calculated the value of their game assets. The player 
          with the greatest value of game assets is declared the winner. "
          onClick={() => handleChangeGameMode('timed', 60)}
        />
      </ButtonGroup>
      {mode === 'timed' && (
        <Box w="80%" my="10px" mx="auto">
          <Heading size="md" mb="10px">
            How long should the game last?
          </Heading>
          <GameTimeInput
            value={timeLimit || 60}
            defaultValue={60}
            onChange={value => handleChangeGameMode('timed', value)}
          />
        </Box>
      )}
    </Box>
  );
}

const GameModeBox = ({
  mode,
  description,
  selected,
  onClick,
}: {
  mode: GameModeT;
  description: string;
  selected: boolean;
  onClick: (mode: GameModeT) => void;
}) => {
  return (
    <Tooltip
      label={description}
      borderRadius="8px"
      shadow={'lg'}
      hasArrow
      placement="top"
    >
      <Box
        as={Button}
        size="lg"
        onClick={onClick ? () => onClick(mode) : undefined}
        colorScheme={selected ? 'purple' : 'gray'}
        flexShrink={0}
        py="10px"
        h={'fit-content'}
        flexDir={'column'}
      >
        <Text fontSize={'4xl'}>{mode === 'normal' ? '🤑' : '🕒'}</Text>
        <Heading size="md">
          {mode[0].toUpperCase().concat(mode.slice(1).toLowerCase())}
        </Heading>
      </Box>
    </Tooltip>
  );
};

const GameTimeInput = (props: SliderProps) => {
  return (
    <Flex gap="40px" align={'center'}>
      <Flex
        bg="green.500"
        py="5px"
        color="white"
        w="140px"
        justify="center"
        align={'center'}
        borderRadius={'8px'}
        direction="column"
      >
        <Heading>{props.value}</Heading>
        <Text>minutes</Text>
      </Flex>
      <Slider min={5} max={120} {...props} h="fit-content">
        <SliderTrack h="20px" borderRadius={'8px'}>
          <SliderFilledTrack bg="green.500" />
        </SliderTrack>
        <SliderThumb h="40px" w="40px" bg="green.500" />
      </Slider>
    </Flex>
  );
};
