import { TOKENS_MAP, TokenType, useGameContext } from '@/hooks/useGameContext';
import { usePlayer } from '@/hooks/usePlayer';
import { useTrade } from '@/hooks/useTrade';
import { formatPrice } from '@/util/formatPrice';
import { propertyGroupToCSS } from '@/util/property-colors';
import {
  Alert,
  AlertDescription,
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Grid,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Radio,
  RadioGroup,
  Select,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Stack,
  Tag,
  TagLabel,
  TagLeftIcon,
  Text,
} from '@chakra-ui/react';
import {
  faHandshake,
  faPlus,
  faTimes,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useMemo, useState } from 'react';
import { BoardSpaceProperty } from '../Board/spaces';

export default function TradeContent() {
  const { players, currentPlayer, gameSettings } = useGameContext();

  const [showPropertySelectorForPlayer, setShowPropertySelectorForPlayer] =
    useState<TokenType | undefined>();

  const [botAcceptsTrade, setBotAcceptsTrade] = useState(false);

  const {
    cancelTrade,
    moneyToTrade,
    performTrade,
    propertiesToReceive,
    propertiesToTrade,
    addPropertyToReceive,
    addPropertyToTrade,
    currentPlayerIsGivingMoney,
    setCurrentPlayerIsGivingMoney,
    setPlayerToTradeWith,
    setMoneyToTrade,
    removePropertyToTrade,
    removePropertyToReceive,
    tradingWithPlayer,
  } = useTrade();

  const currentPlayerInfo = usePlayer(currentPlayer?.token);

  const tradingPlayerInfo = usePlayer(tradingWithPlayer);

  useEffect(() => {
    if (!tradingWithPlayer) {
      setPlayerToTradeWith(
        players.find(player => player.token !== currentPlayer?.token)?.token
      );
    }
  }, []);

  const currentPlayerProperties = useMemo(() => {
    if (!currentPlayerInfo) return [];
    return currentPlayerInfo.getOwnedProperties();
  }, [currentPlayerInfo.getOwnedProperties]);

  const tradingPlayerProperties = useMemo(() => {
    if (!tradingPlayerInfo) return [];
    return tradingPlayerInfo.getOwnedProperties();
  }, [tradingPlayerInfo.getOwnedProperties, tradingWithPlayer]);

  const currentPlayerSelectedProperties = useMemo(() => {
    if (!tradingWithPlayer) return [];
    return currentPlayerProperties.filter(property =>
      propertiesToTrade.includes(property.id)
    );
  }, [tradingPlayerProperties, propertiesToTrade]);

  const tradingPlayerSelectedProperties = useMemo(() => {
    if (!tradingWithPlayer) return [];
    return tradingPlayerProperties.filter(property =>
      propertiesToReceive.includes(property.id)
    );
  }, [currentPlayerProperties, propertiesToReceive]);

  const canAfford = useMemo(() => {
    if (!currentPlayerInfo) return false;
    if (currentPlayerIsGivingMoney) {
      return (currentPlayerInfo.money ?? 0) >= moneyToTrade;
    } else {
      return (tradingPlayerInfo?.money ?? 0) >= moneyToTrade;
    }
  }, [
    currentPlayerInfo,
    currentPlayerIsGivingMoney,
    moneyToTrade,
    tradingPlayerInfo,
  ]);

  return (
    <>
      <Box px="5px">
        <Divider my="10px" />
        <FormControl>
          <FormLabel htmlFor="playerToTradeWith">
            Select a player to trade with
          </FormLabel>
          <Select
            id="playerToTradeWith"
            value={tradingWithPlayer}
            onChange={e => setPlayerToTradeWith(e.target.value as TokenType)}
          >
            {players
              .filter(player => player.token !== currentPlayer?.token)
              .map(player => (
                <option key={player.token} value={player.token}>
                  {TOKENS_MAP[player.token]} {player.name}
                </option>
              ))}
          </Select>
        </FormControl>
        <Divider my="10px" />
        <Heading size="md">Your Trade Offer</Heading>
        <FormControl>
          <FormLabel>
            Do you want to give or receive money to {tradingPlayerInfo?.name}?
          </FormLabel>
          <RadioGroup
            defaultValue={currentPlayerIsGivingMoney ? 'give' : 'receive'}
            value={currentPlayerIsGivingMoney ? 'give' : 'receive'}
            onChange={v => {
              setCurrentPlayerIsGivingMoney(v === 'give');
              setMoneyToTrade(0);
            }}
          >
            <Stack direction={'row'} spacing="10px" justify={'space-evenly'}>
              {' '}
              <Radio id="receive" name="receive" value={'receive'}>
                Receive Money
              </Radio>
              <Radio id="give" name="give" value={'give'} defaultValue={'give'}>
                Give Money
              </Radio>
            </Stack>
          </RadioGroup>
        </FormControl>
        <Divider my="10px" />
        <FormControl isInvalid={!canAfford}>
          <FormLabel my="0" p="0" htmlFor="moneyToTrade">
            How much money do you want to{' '}
            {currentPlayerIsGivingMoney ? 'give to' : 'accept from'}{' '}
            {tradingPlayerInfo?.name}?
          </FormLabel>
          <FormHelperText pb="5px" pt="0" mt="0">
            {currentPlayerIsGivingMoney
              ? `You have ${formatPrice(currentPlayerInfo?.money ?? 0)}`
              : `${tradingPlayerInfo?.name} has ${formatPrice(
                  tradingPlayerInfo?.money ?? 0
                )}`}
            <Divider my="5px" />
            <b>
              Use the slider to set the amount of money you want to{' '}
              {currentPlayerIsGivingMoney ? 'give' : 'accept'}
            </b>
          </FormHelperText>
          <Flex justify={'center'} align="center">
            <Slider
              defaultValue={0}
              maxW={'80%'}
              mx="auto"
              min={0}
              max={
                currentPlayerIsGivingMoney
                  ? currentPlayerInfo?.money
                  : tradingPlayerInfo?.money
              }
              value={moneyToTrade}
              onChange={setMoneyToTrade}
            >
              <SliderTrack h="10px" borderRadius={'8px'}>
                <SliderFilledTrack />
              </SliderTrack>
              <SliderThumb
                p="10px"
                fontSize="sm"
                fontWeight={'bold'}
                boxSize="fit-content"
              >
                {formatPrice(moneyToTrade)}
              </SliderThumb>
            </Slider>
          </Flex>
          {!canAfford ? (
            <Alert size="sm" borderRadius={'8px'} my="10px" status="error">
              <AlertDescription>
                {currentPlayerIsGivingMoney
                  ? "You don't have enough money"
                  : "They don't have enough money"}
              </AlertDescription>
            </Alert>
          ) : null}
        </FormControl>
        <Divider my="10px" />
        <FormControl>
          <FormLabel>Properties to Trade</FormLabel>
          <Grid templateColumns={'1fr 1fr'} gap={'10px'}>
            {[currentPlayer?.token, tradingWithPlayer].map((token, i) => (
              <Box key={token ?? `_${i}`} p="5px">
                <Box>
                  <Text fontWeight={'bold'}>
                    {TOKENS_MAP[token ?? 'boot']}
                    {currentPlayer?.token === token
                      ? 'Your'
                      : `${tradingPlayerInfo?.name}'s`}{' '}
                    Properties
                  </Text>
                  <Button
                    mt="10px"
                    variant={'link'}
                    leftIcon={<FontAwesomeIcon icon={faPlus} />}
                    onClick={() => {
                      setShowPropertySelectorForPlayer(token);
                    }}
                  >
                    Add Property
                  </Button>
                </Box>
                <Divider mb="20px" />
                <Flex gap="5px" flexWrap={'wrap'}>
                  {(token === currentPlayer?.token
                    ? currentPlayerSelectedProperties
                    : tradingPlayerSelectedProperties
                  ).map((property, i) => (
                    <>
                      <Tag
                        shadow={'sm'}
                        cursor={'pointer'}
                        variant={'subtle'}
                        color="white"
                        key={property.id}
                        onClick={() => {
                          currentPlayer?.token === token
                            ? removePropertyToTrade(property.id)
                            : removePropertyToReceive(property.id);
                        }}
                        bg={
                          propertyGroupToCSS[
                            property.property_group_color ?? 'PURPLE'
                          ]
                        }
                      >
                        <TagLeftIcon size="sm">
                          {' '}
                          <FontAwesomeIcon icon={faTimes} />
                        </TagLeftIcon>
                        <TagLabel textShadow={'lg'}>{property.name}</TagLabel>
                      </Tag>
                    </>
                  ))}
                </Flex>
              </Box>
            ))}
          </Grid>
        </FormControl>
        <Stack mt="10px">
          <Button
            onClick={performTrade}
            colorScheme="green"
            leftIcon={<FontAwesomeIcon icon={faHandshake} />}
            isDisabled={
              !canAfford ||
              !tradingWithPlayer ||
              (tradingPlayerInfo.isBot && !botAcceptsTrade)
            }
          >
            Perform Trade
          </Button>
          <Button
            onClick={cancelTrade}
            colorScheme="red"
            leftIcon={<FontAwesomeIcon icon={faTimes} />}
          >
            Cancel Trade
          </Button>
        </Stack>
      </Box>
      <Modal
        isOpen={showPropertySelectorForPlayer !== undefined}
        onClose={() => setShowPropertySelectorForPlayer(undefined)}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            Select from{' '}
            {showPropertySelectorForPlayer === currentPlayer?.token
              ? 'your'
              : `${tradingPlayerInfo?.name}'s`}{' '}
            Properties
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex>
              {(showPropertySelectorForPlayer === currentPlayer?.token
                ? currentPlayerProperties
                : tradingPlayerProperties
              )?.map(p => (
                <Box
                  key={p.id}
                  pos="relative"
                  cursor={'pointer'}
                  p="10px"
                  borderRadius={'8px'}
                  _hover={{
                    bg: 'gray.100',
                  }}
                  onClick={() => {
                    showPropertySelectorForPlayer === currentPlayer?.token
                      ? addPropertyToTrade(p.id)
                      : addPropertyToReceive(p.id);
                    setShowPropertySelectorForPlayer(undefined);
                  }}
                >
                  <BoardSpaceProperty property={p} />
                </Box>
              ))}
            </Flex>
            {(currentPlayer?.token === showPropertySelectorForPlayer &&
              currentPlayerProperties?.length === 0) ||
              (tradingPlayerInfo?.token === showPropertySelectorForPlayer &&
                tradingPlayerProperties?.length === 0 && (
                  <Alert
                    size="sm"
                    borderRadius={'8px'}
                    my="10px"
                    status="error"
                  >
                    <AlertDescription>
                      {showPropertySelectorForPlayer === currentPlayer?.token
                        ? 'You have no properties'
                        : `${tradingPlayerInfo?.name} has no properties`}
                    </AlertDescription>
                  </Alert>
                ))}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
