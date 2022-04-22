import { Box, Heading } from '@chakra-ui/react';
import React, { useMemo } from 'react';
import HUD from '../HUD';
import Buy from './Buy';
import BuyHouse from './BuyHouse';
import FreeParking from './FreeParking';
import GetOutJail from './GetOutJail';
import Go from './Go';
import GoToJail from './GoToJail';
import PayRent from './PayRent';
import Roll from './Roll';
import TakeCard from './TakeCard';
import Tax from './Tax';
import Trade from './Trade';

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
  | 'GO' // Land on a Go space
  | 'TRADE'; // Trade with another player

export interface ActionModalProps {
  action: ActionType | null;
}

const actionModalComponents: Record<ActionType, React.FC<ActionModalProps>> = {
  BUY: Buy,
  PAY_RENT: PayRent,
  GET_OUT_OF_JAIL: GetOutJail,
  TRADE: Trade,
  ROLL: Roll,
  GO_TO_JAIL: GoToJail,
  TAKE_POT_LUCK: () => <TakeCard cardType={'POT_LUCK'} />,
  TAKE_OPPORTUNITY_KNOCKS: () => <TakeCard cardType="OPPORTUNITY_KNOCKS" />,

  FREE_PARKING: FreeParking,
  GO: Go,
  TAX: Tax,
  BUY_HOUSE: BuyHouse,
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
    <Box bg="white" minW="400px" minH="100vh">
      <HUD />
      <Box px="10px">
        <Heading>
          {props.action
            ?.split('_')
            .map(w => w[0].toUpperCase() + w.slice(1).toLowerCase())
            .join(' ')}
        </Heading>
        <Box minH="70%">
          {ActionComponent && <ActionComponent {...props} />}
        </Box>
      </Box>
    </Box>
  );
}
