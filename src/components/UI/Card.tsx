import { Alert, AlertIcon, Box, Flex, Heading, Text } from '@chakra-ui/react';
import { faInfo } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
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
    <Box bg="#eee" borderRadius={'6px'} overflow="hidden">
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
      <Flex flexDirection={'column'} p="20px" h="90%">
        <Box flex="1" flexGrow={1}>
          <Heading size="lg">{title}</Heading>
          <Text>{description}</Text>
        </Box>
        <Alert w={'100%'} status="info" borderRadius={'8px'}>
          <AlertIcon>
            <FontAwesomeIcon icon={faInfo} />
          </AlertIcon>
          {isEarningAction(action_type)
            ? `Earn £${cost} from
              ${
                action_type === card_action_type.EARN_FROM_BANK
                  ? 'the bank'
                  : 'a player of your choice'
              }
            `
            : isPayingAction(action_type)
            ? `Pay £${cost} to
              ${
                action_type === card_action_type.PAY_ALL_PLAYERS
                  ? 'all players'
                  : action_type === card_action_type.PAY_BANK
                  ? 'the bank'
                  : 'a player of your choice'
              }
            `
            : action_type === 'GO_TO_GO'
            ? `Go Straight to Go`
            : action_type === 'GO_TO_PROPERTY'
            ? `Go Straight to a Property`
            : action_type === 'GO_TO_JAIL'
            ? `Go Straight to Jail, do not pass Go, do not collect £200`
            : null}
        </Alert>
      </Flex>
    </Box>
  );
}
