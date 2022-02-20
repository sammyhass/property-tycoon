import {
  Alert,
  AlertIcon,
  Box,
  ChakraProps,
  Flex,
  Heading,
  Text,
} from '@chakra-ui/react';
import { faInfo } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CardAction, CardActionType } from '@prisma/client';
import React from 'react';

type GameCardProps = Pick<
  CardAction,
  'action_type' | 'cost' | 'description' | 'title' | 'type' | 'property_id'
> & {
  propertyName?: string;
  onClick?: () => void;
};

const isPayingAction = (actionType: CardActionType) =>
  actionType === CardActionType.PAY_ALL_PLAYERS ||
  actionType === CardActionType.PAY_BANK ||
  actionType === CardActionType.PAY_PLAYER;

const isEarningAction = (actionType: CardActionType) =>
  actionType === CardActionType.EARN_FROM_BANK ||
  actionType === CardActionType.EARN_FROM_PLAYER;

export default function GameCard({
  action_type,
  cost = 0,
  description,
  title,
  property_id,
  propertyName,
  type,
  onClick,
  ...chakraProps
}: GameCardProps & ChakraProps) {
  return (
    <Box
      bg="#eee"
      borderRadius={'6px'}
      overflow="hidden"
      {...chakraProps}
      onClick={() => onClick && onClick()}
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
      <Flex flexDirection={'column'} p="20px">
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
                action_type === CardActionType.EARN_FROM_BANK
                  ? 'the bank'
                  : 'a player of your choice'
              }
            `
            : isPayingAction(action_type)
            ? `Pay £${cost} to
              ${
                action_type === CardActionType.PAY_ALL_PLAYERS
                  ? 'all players'
                  : action_type === CardActionType.PAY_BANK
                  ? 'the bank'
                  : 'a player of your choice'
              }
            `
            : action_type === CardActionType.GO_TO_GO
            ? `Go Straight to Go`
            : action_type === CardActionType.GO_TO_PROPERTY
            ? `Go Straight to ${propertyName}, if you pass Go, collect £200`
            : action_type === CardActionType.GO_TO_JAIL
            ? `Go Straight to Jail, do not pass Go, do not collect £200`
            : null}
        </Alert>
      </Flex>
    </Box>
  );
}
