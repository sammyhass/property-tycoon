import { TOKENS_MAP, TokenType, useGameContext } from '@/hooks/useGameContext';
import { formatPrice } from '@/util/formatPrice';
import { Box, Flex, Heading, Text } from '@chakra-ui/react';
import { GameProperty, PropertyGroupColor } from '@prisma/client';
import React, { useEffect, useMemo, useRef } from 'react';
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

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isTurn) {
      if (!ref.current) return;
      ref.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [isTurn]);

  return (
    <Box
      ref={ref}
      bg="white"
      borderRadius={'8px'}
      transform={!isTurn ? 'scale(0.96)' : 'scale(1)'}
      flexShrink={0}
      minW="300px"
      my="5px"
      transition="transform 0.2s ease-in-out"
      overflow="hidden"
      p="5px"
    >
      <Heading>
        {isTurn ? 'Now Playing: ' : ''}
        {TOKENS_MAP[token]}
      </Heading>
      {player?.inJail && (
        <Text color={'red'} fontSize="lg" fontWeight={'bold'}>
          In Jail
        </Text>
      )}
      <Text fontSize={'lg'}>Money: {formatPrice(player?.money ?? 0)}</Text>

      {/* Properties List */}
      <Flex gap="5px" wrap={'wrap'} w="100%" maxW="100%">
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
