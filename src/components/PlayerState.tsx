import { TOKENS_MAP, TokenType, useGameContext } from '@/hooks/useGameContext';
import { formatPrice } from '@/util/formatPrice';
import { Box, Flex, Heading, Text } from '@chakra-ui/react';
import { GameProperty, PropertyGroupColor } from '@prisma/client';
import React, { useMemo } from 'react';
import PropertyGroupStack from './Board/PropertyStack';

// Renders relevent information for a particular player (e.g, properties owned, money, etc)
export default function PlayerState({
  token,
  isTurn,
}: {
  token: TokenType;
  isTurn: boolean;
}) {
  const { state, gameSettings } = useGameContext();

  const player = state[token];

  const propertiesOwned = useMemo(() => {
    return gameSettings?.Properties.filter(property =>
      player?.propertiesOwned.includes(property.id)
    ).reduce((acc, property) => {
      const color = property.property_group_color;
      if (!acc[color]) {
        acc[color] = [];
      }
      acc[color].push(property);
      return acc;
    }, {} as { [key in PropertyGroupColor]: GameProperty[] });
  }, [gameSettings, player]);

  return (
    <Box
      bg="white"
      w="fit-content"
      p="10px"
      borderRadius={'8px'}
      transform={!isTurn ? 'scale(0.8)' : 'scale(1)'}
      transition="transform 0.2s ease-in-out"
      width={!isTurn ? '150px' : '100%'}
      overflow="hidden"
    >
      <Heading>
        {isTurn ? 'Now Playing: ' : ''}
        {TOKENS_MAP[token]}
      </Heading>
      <Text fontSize={'lg'}>Money: {formatPrice(player?.money ?? 0)}</Text>

      {/* Properties List */}
      <Flex>
        {Object.entries(propertiesOwned ?? {}).map(([color, properties]) => (
          <PropertyGroupStack
            key={color}
            group={color as PropertyGroupColor}
            properties={properties}
          />
        ))}
      </Flex>
    </Box>
  );
}
