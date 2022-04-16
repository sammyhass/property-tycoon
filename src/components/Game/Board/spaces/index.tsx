import { TokenType, useGameContext } from '@/hooks/useGameContext';
import { formatPrice } from '@/util/formatPrice';
import { propertyGroupToCSS } from '@/util/property-colors';
import { Box, ChakraProps, Flex, Text } from '@chakra-ui/react';
import { faFaucet, faTrain } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  BoardSpace as BoardSpaceT,
  CardType,
  GameProperty,
} from '@prisma/client';
import React, { useMemo } from 'react';
import BoardSpaceHouses from './BoardSpaceHouses';
import BoardSpacePlayers from './players';
import styles from './spaces.module.scss';

// Board Space Aspect ratio as defined in the css file. Useful to use when we need our spaces to show larger or smaller
export const BOARD_SPACE_ASPECT_RATIO = 11 / 7;

// Has player can be used to show the player's token on the board
type HasPlayerT = { hasPlayers?: TokenType[] };

type BoardSpaceProps = BoardSpaceT & {
  property: GameProperty | null;

  // Whether or not to rotate this board space 90 degrees
};

export default function BoardSpace(props: BoardSpaceProps & HasPlayerT) {
  return (
    <Box pos={'relative'}>
      <BoardSpacePlayers players={props.hasPlayers ?? []} />
      <BoardSpaceInner {...props} />
    </Box>
  );
}
// Board Spaces on the board. There are different types of board spaces, so
// so we need to determine which type of board space we are rendering.
const BoardSpaceInner = (props: BoardSpaceProps) => {
  switch (props.space_type) {
    case 'PROPERTY':
      return <BoardSpaceProperty property={props.property} />;
    case 'GO':
      return <BoardSpaceGo />;
    case 'TAKE_CARD':
      return <BoardSpaceTakeCard cardType={props?.take_card ?? 'POT_LUCK'} />;
    case 'GO_TO_JAIL':
      return <BoardSpaceGoToJail />;
    case 'JUST_VISIT':
      return <BoardSpaceJail />;
    case 'FREE_PARKING':
      return <BoardSpaceFreeParking />;
    case 'TAX':
      return <BoardSpaceTax taxCost={props.tax_cost ?? 0} />;
    default:
      return <BoardSpaceEmpty />;
  }
};

export const BoardSpaceProperty = ({
  property,
  ...props
}: { property: GameProperty | null; nHouses?: number } & HasPlayerT &
  ChakraProps) => {
  const { isOwned, state } = useGameContext();

  const owner = useMemo(() => {
    if (!property) return null;
    return isOwned(property?.id);
  }, [isOwned, property, state]);

  const nHouses = useMemo(
    () =>
      property
        ? owner?.ownerState?.propertiesOwned[property.property_group_color]?.[
            property.id
          ]?.houses ?? 0
        : 0,
    [owner, property]
  );

  return (
    <Box
      className={`${styles.boardSpace} ${styles.property}`}
      style={{
        background:
          propertyGroupToCSS[property?.property_group_color ?? 'NONE'],
      }}
      {...props}
    >
      {nHouses > 0 && (
        <Box top="5px" pos="absolute">
          <BoardSpaceHouses nHouses={nHouses} />
        </Box>
      )}
      <div className={styles.boardBackground} />
      <div className={styles.propertyContent}>
        <Flex w="100%" justify="center" align="center">
          {property?.property_group_color === 'STATION' ? (
            <FontAwesomeIcon icon={faTrain} size="2x" />
          ) : property?.property_group_color === 'UTILITIES' ? (
            <Flex w="100%" justify="center" align="center">
              <FontAwesomeIcon icon={faFaucet} size="2x" />
            </Flex>
          ) : (
            <></>
          )}
        </Flex>

        <div className={`${styles.propertyText}`}>{property?.name}</div>
        <div className={styles.propertyPrice}>
          {formatPrice(property?.price ?? 0)}
        </div>
      </div>
    </Box>
  );
};

export const BoardSpaceEmpty = (props: HasPlayerT) => (
  <div className={styles.boardSpace}>
    <div className={styles.boardBackground} />
    <div>
      <Text fontSize="sm" p="0" m="0">
        Empty
      </Text>
    </div>
  </div>
);

/**
 * 'Special' board spaces such as tax/card pickup/properties whose group isn't a color (e.g. Stations/Utilities)
 */
export const BoardSpaceSpecial = ({
  title,
  imageComponent: ImageComponent,
}: {
  title: string;
  imageComponent: React.FC;
} & HasPlayerT) => (
  <div className={`${styles.boardSpace} ${styles.special}`}>
    <div className={styles.specialText}>{title}</div>
    <ImageComponent />
  </div>
);

export const BoardSpaceJail = (props: {
  jail?: HasPlayerT;
  visit?: HasPlayerT;
}) => (
  <div className={`${styles.boardSpace} ${styles.square} ${styles.inJail}`}>
    <div className={styles.just}>Just</div>
    <div className={styles.visiting}>Visiting</div>
    <div className={styles.inner}>
      <div>
        In
        <Box>
          <Text fontSize="6xl">⛓️</Text>
        </Box>
        Jail
      </div>
    </div>
  </div>
);

export const BoardSpaceGoToJail = (props: HasPlayerT) => (
  <div className={`${styles.boardSpace} ${styles.square} ${styles.goToJail}`}>
    <div className={`${styles.rotate} ${styles.bottomRight}`}>
      Go to
      <Box>
        <Text fontSize={'6xl'}>🤦</Text>
      </Box>
      Jail
    </div>
  </div>
);

export const BoardSpaceGo = (props: HasPlayerT) => {
  return (
    <div className={`${styles.boardSpace} ${styles.square} ${styles.go}`}>
      <svg className="arrow" viewBox="0 0 14 70" fill="#AB3126" stroke="#000">
        <polygon points="0.861 12.096 7.133 1.054 13.214 11.969 9.32 11.969 9.32 56.581 12.467 59.728 12.467 68.746 6.87 63.66 1.582 69.057 1.471 59.688 4.817 56.564 4.817 12.061" />
      </svg>
      <div className={`${styles.rotate} ${styles.bottomLeft}`}>
        <div className={styles.goText}>Collect £200 salary as you pass</div>
        <div className={styles.goTextBig}>GO</div>
      </div>
    </div>
  );
};

export const BoardSpaceFreeParking = () => (
  <div
    className={`${styles.boardSpace} ${styles.square} ${styles.freeParking}`}
  >
    <div className={`${styles.rotate} ${styles.topRight}`}>
      Free
      <Box>
        <Text fontSize={'6xl'}>🎁</Text>
      </Box>
      Parking
    </div>
  </div>
);

export const BoardSpaceTakeCard = ({ cardType }: { cardType: CardType }) => (
  <BoardSpaceSpecial
    title={cardType === 'POT_LUCK' ? 'Pot Luck' : 'Opportunity Knocks'}
    imageComponent={() => (
      <Text fontSize={'6xl'}>{cardType === 'POT_LUCK' ? '🎲' : '🔥'}</Text>
    )}
  />
);

export const BoardSpaceTax = ({ taxCost }: { taxCost: number }) => (
  <BoardSpaceSpecial
    title={`£${taxCost} Tax`}
    imageComponent={() => <Text fontSize={'6xl'}>💸</Text>}
  />
);
