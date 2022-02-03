import { card_type } from '@prisma/client';
import { GameCardProps } from './Card';

type CardTypeMap = Record<card_type, React.FC<GameCardProps<card_type>>>;

const cards: CardTypeMap = {
  OPPORTUNITY_KNOCKS: () => <>Opportunity Knocks</>,
  POT_LUCK: () => <>Opportunity Knocks 2</>,
};
