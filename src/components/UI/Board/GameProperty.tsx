import { Box } from '@chakra-ui/react';
import { GameProperty } from '@prisma/client';
import React from 'react';

type GamePropertyProps = GameProperty;

// TODO: Add rent on the property
export default function GameProperty({
  game_id,
  id,
  name,
  price,
  property_group_color,
}: GamePropertyProps) {
  return <Box></Box>;
}
