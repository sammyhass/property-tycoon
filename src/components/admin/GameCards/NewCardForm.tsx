import {
  Box,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  Heading,
  Input,
  Select,
  Textarea,
} from '@chakra-ui/react';
import { card_action_type, card_type, game_card } from '@prisma/client';
import React, { useMemo, useState } from 'react';
import GameCard from './Card';

export default function NewCardForm({
  initialValues,
  gameId,
}: {
  initialValues?: Partial<game_card>;
  gameId: string;
}) {
  const [cardType, setCardType] = useState<card_type>(
    initialValues?.type ?? card_type.OPPORTUNITY_KNOCKS
  );

  const [title, setTitle] = useState<string>(initialValues?.title ?? '');
  const [description, setDescription] = useState<string>(
    initialValues?.description ?? ''
  );

  const [actionType, setActionType] = useState<card_action_type>(
    initialValues?.action_type ?? card_action_type.GO_TO_GO
  );

  const [actionCost, setActionCost] = useState<number>(0);

  const isPayingAction = useMemo(
    () =>
      actionType === card_action_type.PAY_ALL_PLAYERS ||
      actionType === card_action_type.PAY_BANK ||
      actionType === card_action_type.PAY_PLAYER,
    [actionType]
  );

  const isEarningAction = useMemo(
    () =>
      actionType === card_action_type.EARN_FROM_BANK ||
      actionType === card_action_type.EARN_FROM_PLAYER,
    [actionType]
  );

  return (
    <Box>
      <Heading>New Card</Heading>
      <Grid
        templateColumns="6fr 2fr"
        sx={{
          '@media screen and (max-width: 768px)': {
            display: 'flex',
            flexDirection: 'column',
          },
        }}
        gap={4}
      >
        <form
          onSubmit={e => {
            e.preventDefault();
          }}
        >
          {' '}
          <Flex
            w="100%"
            shadow="xl"
            direction={'column'}
            p={5}
            borderRadius={'8px'}
            gap={'10px'}
          >
            <FormControl>
              <FormLabel htmlFor="card_type" m="0" p="0">
                Select a Card Type
              </FormLabel>
              <Select
                id="card_type"
                name="card_type"
                onChange={e => setCardType(e.target.value as card_type)}
                value={cardType}
              >
                {Object.entries(card_type).map(([v, k]) => (
                  <option key={v} value={v}>
                    {k}
                  </option>
                ))}
              </Select>
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="card_title" m="0" p="0">
                Card Title
              </FormLabel>
              <Input
                id="card_title"
                isInvalid={title.length === 0}
                name="card_title"
                value={title}
                onChange={e => setTitle(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="card_description" m="0" p="0">
                Card Description
              </FormLabel>
              <Textarea
                resize="none"
                id="card_description"
                name="card_description"
                value={description}
                onChange={e => setDescription(e.target.value)}
                isInvalid={description.length === 0}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="card_action_type" m="0" p="0">
                Select a Card Action Type
              </FormLabel>
              <Select
                id="card_action_type"
                name="card_action_type"
                onChange={e => {
                  setActionType(e.target.value as card_action_type);
                }}
                value={actionType}
              >
                {Object.entries(card_action_type).map(([v, k]) => (
                  <option key={v} value={v}>
                    {k}
                  </option>
                ))}
              </Select>
            </FormControl>
            {(isPayingAction || isEarningAction) && (
              <FormControl>
                <FormLabel htmlFor="card_action_amount" m="0" p="0">
                  Card Action Amount
                </FormLabel>
                <Input
                  id="card_action_amount"
                  name="card_action_amount"
                  type="number"
                  isInvalid={
                    ((isPayingAction || isEarningAction) && actionCost === 0) ||
                    isNaN(actionCost)
                  }
                  min={0}
                  placeholder={`Card Holder ${
                    isPayingAction ? 'Pays' : 'Earns'
                  } Amount (£)`}
                  value={actionCost}
                  onChange={e => {
                    setActionCost(parseInt(e.target.value));
                  }}
                />
              </FormControl>
            )}
          </Flex>
        </form>
        <GameCard
          action_type={actionType}
          cost={
            isPayingAction || isEarningAction
              ? isNaN(actionCost)
                ? 0
                : actionCost
              : null
          }
          description={description}
          title={title}
          type={cardType}
        />
      </Grid>
    </Box>
  );
}
