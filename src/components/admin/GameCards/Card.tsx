import { card_type, game_card, game_card_action } from '@prisma/client';
import React from 'react';

export type GameCardProps<T extends card_type> = Pick<
  game_card,
  'card_type' | 'text'
> & {
  game_card_action: game_card_action;
  card_type: T;
};

export default function GameCard<T extends card_type>({
  card_type: type,
  game_card_action: action,
  text,
}: GameCardProps<T>) {
  return <></>;
}
