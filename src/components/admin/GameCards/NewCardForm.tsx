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
import { CardAction, CardActionType, CardType } from '@prisma/client';
import React, { useMemo, useState } from 'react';
import GameCard from '../../UI/Card';

export default function NewCardForm({
  initialValues,
  gameId,
}: {
  initialValues?: Partial<CardAction>;
  gameId: string;
}) {
  const [cardType, setCardType] = useState<CardType>(
    initialValues?.type ?? CardType.OPPORTUNITY_KNOCKS
  );

  const [title, setTitle] = useState<string>(initialValues?.title ?? '');
  const [description, setDescription] = useState<string>(
    initialValues?.description ?? ''
  );

  const [actionType, setActionType] = useState<CardActionType>(
    initialValues?.action_type ?? CardActionType.GO_TO_GO
  );

  const [actionCost, setActionCost] = useState<number>(0);

  const isPayingAction = useMemo(
    () =>
      actionType === CardActionType.PAY_ALL_PLAYERS ||
      actionType === CardActionType.PAY_BANK ||
      actionType === CardActionType.PAY_PLAYER,
    [actionType]
  );

  const isEarningAction = useMemo(
    () =>
      actionType === CardActionType.EARN_FROM_BANK ||
      actionType === CardActionType.EARN_FROM_PLAYER,
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
                onChange={e => setCardType(e.target.value as CardType)}
                value={cardType}
              >
                {Object.entries(CardType).map(([v, k]) => (
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
                  setActionType(e.target.value as CardActionType);
                }}
                value={actionType}
              >
                {Object.entries(CardActionType).map(([v, k]) => (
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
        <Box h={'400px'}>
          <GameCard
            action_type={actionType}
            cost={
              isPayingAction || isEarningAction
                ? isNaN(actionCost)
                  ? 0
                  : actionCost
                : null
            }
            description={
              description.length > 0 ? description : 'No description provided'
            }
            title={title ?? 'New Card'}
            type={cardType}
          />
        </Box>
      </Grid>
    </Box>
  );
}
