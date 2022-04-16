import { Box, Heading } from '@chakra-ui/react';
import React, { useMemo } from 'react';
import HUD from '../HUD';
import {
  ActionModalBuy,
  ActionModalBuyHouse,
  ActionModalFreeParking,
  ActionModalGetOutJail,
  ActionModalGo,
  ActionModalGoToJail,
  ActionModalPayRent,
  ActionModalRoll,
  ActionModalTakeCard,
  ActionModalTax,
} from './Content';

// Different types of action modal we can use for our modal.
export type ActionType =
  | 'BUY' // Buying a property
  | 'PAY_RENT' // Pay rent
  | 'ROLL' // Roll dice
  // Taking Cards
  | 'TAKE_POT_LUCK'
  | 'TAKE_OPPORTUNITY_KNOCKS'
  // ---
  | 'GO_TO_JAIL' // Player is sent to jail
  | 'GET_OUT_OF_JAIL' // Player attempts to get out of jail (shows instead)
  | 'FREE_PARKING' // Land on a Free Parking space
  | 'TAX' // Pay tax
  | 'BUY_HOUSE' // Buy a house
  | 'GO'; // Land on a Go space

export interface ActionModalProps {
  action: ActionType | null;
}

const actionModalComponents: Record<ActionType, React.FC<ActionModalProps>> = {
  BUY: ActionModalBuy,
  PAY_RENT: ActionModalPayRent,
  GET_OUT_OF_JAIL: ActionModalGetOutJail,
  ROLL: ActionModalRoll,
  GO_TO_JAIL: ActionModalGoToJail,
  TAKE_POT_LUCK: () => <ActionModalTakeCard cardType={'POT_LUCK'} />,
  TAKE_OPPORTUNITY_KNOCKS: () => (
    <ActionModalTakeCard cardType="OPPORTUNITY_KNOCKS" />
  ),
  FREE_PARKING: ActionModalFreeParking,
  GO: ActionModalGo,
  TAX: ActionModalTax,
  BUY_HOUSE: ActionModalBuyHouse,
};

export default function ActionSidebar(props: ActionModalProps) {
  const ActionComponent = useMemo(
    () =>
      props.action
        ? (actionModalComponents[props.action] as React.FC<ActionModalProps>)
        : null,
    [props.action]
  );

  return (
    <Box minW={'400px'} bg="white" px="20px" h="100vh">
      <Heading>
        {props.action
          ?.split('_')
          .map(w => w[0].toUpperCase() + w.slice(1).toLowerCase())
          .join(' ')}
      </Heading>
      <Box minH="70%">{ActionComponent && <ActionComponent {...props} />}</Box>
      <HUD />
    </Box>
  );
}
