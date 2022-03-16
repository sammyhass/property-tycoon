import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Heading,
} from '@chakra-ui/react';
import React from 'react';
import {
  ActionModalBuy,
  ActionModalFreeParking,
  ActionModalGoToJail,
  ActionModalPayRent,
  ActionModalRoll,
  ActionModalTakeCard,
  ActionModalTax,
} from './Content';

// Different types of action modal we can use for our modal.
export type ActionType =
  | 'BUY' // Buying a property
  | 'MORTGAGE'
  | 'PAY_RENT' // Pay rent
  | 'ROLL' // Roll dice
  // Taking Cards
  | 'TAKE_POT_LUCK'
  | 'TAKE_OPPORTUNITY_KNOCKS'
  // ---
  | 'GO_TO_JAIL' // Player is sent to jail
  | 'FREE_PARKING' // Land on a Free Parking space
  | 'GO' // Land on a Go space
  | 'TAX'; // Pay tax

export interface ActionModalProps {
  action: ActionType | null;
  onClose: () => void;
  isOpen: boolean;
}

const actionModalComponents: Record<ActionType, React.FC<ActionModalProps>> = {
  BUY: ActionModalBuy,
  MORTGAGE: () => <div>Mortgage</div>,
  PAY_RENT: ActionModalPayRent,
  ROLL: ActionModalRoll,
  GO_TO_JAIL: ActionModalGoToJail,
  TAKE_POT_LUCK: () => <ActionModalTakeCard cardType={'POT_LUCK'} />,
  TAKE_OPPORTUNITY_KNOCKS: () => (
    <ActionModalTakeCard cardType="OPPORTUNITY_KNOCKS" />
  ),
  FREE_PARKING: ActionModalFreeParking,
  GO: () => <div>GO!</div>,
  TAX: ActionModalTax,
};

export default function ActionModal(props: ActionModalProps) {
  const ActionComponent = props.action
    ? (actionModalComponents[props.action] as React.FC<ActionModalProps>)
    : null;

  return (
    <Drawer
      onClose={() => {}}
      isOpen={props.isOpen}
      size="md"
      placement="right"
    >
      <DrawerOverlay />
      <DrawerContent bg="whiteAlpha.600">
        <DrawerHeader>
          <Heading>
            {props.action
              ?.split('_')
              .map(w => w[0].toUpperCase() + w.slice(1).toLowerCase())
              .join(' ')}
          </Heading>
        </DrawerHeader>
        <DrawerBody>
          {ActionComponent && <ActionComponent {...props} />}
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}
