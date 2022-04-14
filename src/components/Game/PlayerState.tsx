import { TOKENS_MAP, TokenType, useGameContext } from '@/hooks/useGameContext';
import { usePlayer } from '@/hooks/usePlayer';
import { formatPrice } from '@/util/formatPrice';
import { Badge, Box, ChakraProps, Flex, Heading } from '@chakra-ui/react';
import { GameProperty, PropertyGroupColor } from '@prisma/client';
import React, { useMemo, useRef } from 'react';
import PropertyGroupStack from './Board/PropertyStack';

// Renders relevent information for a particular player (e.g, properties owned, money, etc)
export default function PlayerState({
  token,
  ...props
}: { token: TokenType } & ChakraProps) {
  const { gameSettings } = useGameContext();

  const { isTurn, ...player } = usePlayer(token);

  const propertiesOwned = useMemo(() => {
    return gameSettings?.Properties.filter(property =>
      player?.propertiesOwned?.includes(property.id)
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

  return (
    <Box
      ref={ref}
      bg="whiteAlpha.900"
      backdropFilter={'blur(4px)'}
      h="100%"
      boxShadow="xl"
      borderRadius={'8px'}
      p="10px"
      {...props}
    >
      <Flex minW="400px" align={'center'}>
        <Flex align={'center'} flex="1">
          <Heading size={'xl'}>{TOKENS_MAP[token]}</Heading>
          <Heading size="md">{player.name}</Heading>
        </Flex>
        <Flex w="fit-content" gap="5px" h="fit-content">
          <Badge colorScheme={'green'} fontSize="md" ml="5px">
            💰 {formatPrice(player.money ?? 0)}
          </Badge>
          {player.inJail && (
            <Badge colorScheme={'red'} fontSize="md">
              In Jail
            </Badge>
          )}
          {isTurn && (
            <Badge colorScheme={'blue'} fontSize="md">
              Your Turn
            </Badge>
          )}
        </Flex>
      </Flex>
      {/* Properties List */}
      <Flex overflowX={'auto'} w="500px" maxW="100%" mt="10px">
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
