import { Box, Flex, Heading, Text } from '@chakra-ui/react';
import { card_action_type, game_card } from '@prisma/client';
import React from 'react';

type GameCardProps = Pick<
  game_card,
  'action_type' | 'cost' | 'description' | 'title' | 'type'
>;

const isPayingAction = (actionType: card_action_type) =>
  actionType === card_action_type.PAY_ALL_PLAYERS ||
  actionType === card_action_type.PAY_BANK ||
  actionType === card_action_type.PAY_PLAYER;

const isEarningAction = (actionType: card_action_type) =>
  actionType === card_action_type.EARN_FROM_BANK ||
  actionType === card_action_type.EARN_FROM_PLAYER;

export default function GameCard({
  action_type,
  cost = 0,
  description,
  title,
  type,
}: GameCardProps) {
  return (
    <Box
      bg="#eee"
      borderRadius={'6px'}
      overflow="hidden"
      minH={'350px'}
      minW={'350px'}
    >
      <Box
        p="10px"
        color={'white'}
        transition={'all 0.2s ease-in-out'}
        bg={`
        ${type === 'OPPORTUNITY_KNOCKS' ? '#f0f' : '#f00'}
      `}
      >
        <Heading size="md" textAlign={'center'}>
          {type === 'OPPORTUNITY_KNOCKS' ? 'Opportunity Knocks' : 'Pot Luck'}
        </Heading>
      </Box>
      <Box pos="relative" display={'flex'} flexDirection={'column'} p="20px">
        <Box flex="1" flexGrow={1}>
          <Heading size="lg">{title}</Heading>
          <Text>{description}</Text>
        </Box>
        <Flex h="50px" w={'100%'}>
          <Heading size="sm">
            {isEarningAction(action_type)
              ? ` Earn £${cost} from
              ${
                action_type === card_action_type.EARN_FROM_BANK
                  ? 'the bank'
                  : 'a player of your choice'
              }
            `
              : isPayingAction(action_type)
              ? ` Pay £${cost} to
              ${
                action_type === card_action_type.PAY_ALL_PLAYERS
                  ? 'all players'
                  : action_type === card_action_type.PAY_BANK
                  ? 'the bank'
                  : 'a player of your choice'
              }
            `
              : ``}
          </Heading>
        </Flex>
      </Box>
    </Box>
  );
}
