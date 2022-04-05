import { API_URL } from '@/env/env';
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  Heading,
  Input,
  Select,
  Textarea,
} from '@chakra-ui/react';
import {
  CardAction,
  CardActionType,
  CardType,
  GameProperty,
} from '@prisma/client';
import axios from 'axios';
import { useRouter } from 'next/router';
import React, { FormEvent, useCallback, useMemo, useState } from 'react';
import GameCard from '../../Game/Board/cards/Card';

export default function NewCardForm({
  initialValues,
  gameId,
  properties = [],
}: {
  initialValues?: Partial<CardAction>;
  properties?: GameProperty[];
  gameId: string;
}) {
  const [cardType, setCardType] = useState<CardType>(
    initialValues?.type ?? CardType.OPPORTUNITY_KNOCKS
  );

  const [description, setDescription] = useState<string>(
    initialValues?.description ?? ''
  );

  const [actionType, setActionType] = useState<CardActionType>(
    initialValues?.action_type ?? CardActionType.GO_TO_GO
  );

  const [actionProperty, setActionProperty] = useState<string | undefined>(
    properties[0]?.id ?? undefined
  );

  const [actionCost, setActionCost] = useState<number>(0);

  const isPayingAction = useMemo(
    () =>
      actionType === CardActionType.PAY_ALL_PLAYERS ||
      actionType === CardActionType.PAY_BANK ||
      actionType === CardActionType.PAY_PLAYER ||
      actionType === CardActionType.PAY_FREE_PARKING,
    [actionType]
  );

  const isEarningAction = useMemo(
    () =>
      actionType === CardActionType.EARN_FROM_BANK ||
      actionType === CardActionType.EARN_FROM_PLAYER,
    [actionType]
  );

  const router = useRouter();

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();

      const { data, status } = await axios.post(
        `${API_URL}/game/${gameId}/game_cards`,
        {
          property_id: actionProperty,
          cost: actionCost,
          description: description,
          type: cardType,
          action_type: actionType,
        }
      );

      router.push(`/admin/games/${gameId}/cards`);
    },
    [
      actionCost,
      actionProperty,
      actionType,
      cardType,
      description,
      router,
      gameId,
    ]
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
        <form onSubmit={handleSubmit}>
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
            {actionType === 'GO_TO_PROPERTY' && (
              <FormControl>
                <FormLabel htmlFor="card_action_property" m="0" p="0">
                  Select a Property
                </FormLabel>
                <Select
                  disabled={properties.length === 0}
                  id="card_action_property"
                  name="card_action_property"
                  onChange={e => {
                    setActionProperty(e.target.value);
                  }}
                  value={actionProperty}
                >
                  {properties.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </Select>
              </FormControl>
            )}

            <Button type="submit">Create Card</Button>
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
            property_id={
              actionType === 'GO_TO_PROPERTY' ? actionProperty ?? null : null
            }
            propertyName={properties.find(p => p.id === actionProperty)?.name}
            description={
              description.length > 0 ? description : 'No description provided'
            }
            type={cardType}
          />
        </Box>
      </Grid>
    </Box>
  );
}
