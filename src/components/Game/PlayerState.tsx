import { TOKENS_MAP, TokenType, useGameContext } from '@/hooks/useGameContext';
import { usePlayer } from '@/hooks/usePlayer';
import { useTrade } from '@/hooks/useTrade';
import { formatPrice } from '@/util/formatPrice';
import {
  Badge,
  Box,
  Button,
  ChakraProps,
  Collapse,
  Flex,
  Heading,
} from '@chakra-ui/react';
import { faHandshake } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { GameProperty, PropertyGroupColor } from '@prisma/client';
import React, { useMemo, useRef } from 'react';
import PropertyGroupStack from './Board/PropertyStack';

// Renders relevent information for a particular player (e.g, properties owned, money, etc)
export default function PlayerState({
  token,
  inactive = false,

  ...props
}: { token: TokenType; inactive?: boolean } & ChakraProps) {
  const { gameSettings, showActionModal, canEndTurn } = useGameContext();
  const { initializeTrade } = useTrade();

  const { isTurn, isBot, ...player } = usePlayer(token);

  const propertiesOwned = useMemo(() => {
    return gameSettings?.Properties.filter(property => {
      return (
        player.propertiesOwned?.[property.property_group_color] &&
        player.propertiesOwned?.[property.property_group_color]?.[property.id]
      );
    }).reduce((acc, property) => {
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
          {player.isBankrupt && (
            <Badge colorScheme={'red'} fontSize="md" ml="5px">
              💀 BANKRUPT
            </Badge>
          )}
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

          {isBot && (
            <Badge colorScheme={'purple'} fontSize="md">
              🤖 Bot
            </Badge>
          )}
        </Flex>
      </Flex>
      <Collapse in={!inactive && canEndTurn}>
        <Button
          mt="10px"
          size="sm"
          leftIcon={<FontAwesomeIcon icon={faHandshake} />}
          colorScheme={'blue'}
          onClick={() => initializeTrade(isTurn ? undefined : token)}
        >
          Propose Trade
          {isTurn ? '' : ` with ${TOKENS_MAP[token]}`}
        </Button>
      </Collapse>
      {/* Properties List */}
      <Flex overflowX={'auto'} w="500px" maxW="100%" mt="10px">
        {Object.entries(propertiesOwned ?? {}).map(([color, properties]) => (
          <PropertyGroupStack
            key={color}
            group={color as PropertyGroupColor}
            properties={properties}
          />
        ))}
        {player.hasGetOutOfJailFreeCard && (
          <Box
            w="fit-content"
            p="15px"
            borderRadius={'8px'}
            shadow={'md'}
            bg={'green.100'}
          >
            <Heading size="md">🆓 Get Out of Jail Free Card</Heading>
          </Box>
        )}
      </Flex>
    </Box>
  );
}
