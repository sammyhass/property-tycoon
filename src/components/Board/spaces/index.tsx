import { TokenType } from '@/hooks/useGameContext';
import { formatPrice } from '@/util/formatPrice';
import { propertyGroupToCSS } from '@/util/property-colors';
import { Box, Text } from '@chakra-ui/react';
import {
  BoardSpace as BoardSpaceT,
  CardType,
  GameProperty,
} from '@prisma/client';
import React from 'react';
import BoardSpacePlayers from './players';
import styles from './spaces.module.css';

// Has player can be used to show the player's token on the board
type HasPlayerT = { hasPlayers?: TokenType[] };

type BoardSpaceProps = BoardSpaceT & {
  property: GameProperty | null;
} & HasPlayerT;

// Board Spaces on the board. There are different types of board spaces, so
// so we need to determine which type of board space we are rendering.
export default function BoardSpace(props: BoardSpaceProps) {
  switch (props.space_type) {
    case 'PROPERTY':
      return (
        <BoardSpace.Property
          property={props.property}
          hasPlayers={props.hasPlayers}
        />
      );
    case 'GO':
      return <BoardSpace.Go hasPlayers={props.hasPlayers} />;
    case 'TAKE_CARD':
      return (
        <BoardSpace.TakeCard
          hasPlayers={props.hasPlayers}
          cardType={props?.take_card ?? 'POT_LUCK'}
        />
      );
    case 'GO_TO_JAIL':
      return <BoardSpace.GoToJail hasPlayers={props.hasPlayers} />;
    case 'JUST_VISIT':
      return <BoardSpace.Jail />;
    case 'FREE_PARKING':
      return <BoardSpace.FreeParking />;
    default:
      return <BoardSpace.Empty />;
  }
}

BoardSpace.Property = ({
  property,
}: { property: GameProperty | null } & HasPlayerT) => (
  <div
    className={`${styles.boardSpace} ${styles.property}`}
    style={{
      background: propertyGroupToCSS[property?.property_group_color ?? 'NONE'],
    }}
  >
    <div className={styles.boardBackground} />
    <div className={styles.propertyContent}>
      <div className={`${styles.propertyText}`}>{property?.name}</div>
      <div className={styles.propertyPrice}>
        {formatPrice(property?.price ?? 0)}
      </div>
    </div>
  </div>
);

BoardSpace.Empty = (props: HasPlayerT) => (
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
BoardSpace.Special = ({
  title,
  imageComponent: ImageComponent,
  hasPlayers,
}: {
  title: string;
  imageComponent: React.FC;
} & HasPlayerT) => (
  <div className={`${styles.boardSpace} ${styles.special}`}>
    <div className={styles.specialText}>{title}</div>
    <ImageComponent />
  </div>
);

BoardSpace.Jail = (props: { jail?: HasPlayerT; visit?: HasPlayerT }) => (
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

BoardSpace.GoToJail = (props: HasPlayerT) => (
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

BoardSpace.Go = (props: HasPlayerT) => {
  return (
    <Box pos="relative">
      <BoardSpacePlayers players={props.hasPlayers ?? []} />
      <div className={`${styles.boardSpace} ${styles.square} ${styles.go}`}>
        <svg className="arrow" viewBox="0 0 14 70" fill="#AB3126" stroke="#000">
          <polygon points="0.861 12.096 7.133 1.054 13.214 11.969 9.32 11.969 9.32 56.581 12.467 59.728 12.467 68.746 6.87 63.66 1.582 69.057 1.471 59.688 4.817 56.564 4.817 12.061" />
        </svg>
        <div className={`${styles.rotate} ${styles.bottomLeft}`}>
          <div className={styles.goText}>Collect £200 salary as you pass</div>
          <div className={styles.goTextBig}>GO</div>
        </div>
      </div>
    </Box>
  );
};

BoardSpace.FreeParking = (props: HasPlayerT) => (
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

BoardSpace.TakeCard = ({
  cardType,
  hasPlayers = [],
}: { cardType: CardType } & HasPlayerT) => (
  <BoardSpace.Special
    title={cardType === 'POT_LUCK' ? 'Pot Luck' : 'Opportunity Knocks'}
    hasPlayers={hasPlayers}
    imageComponent={() => (
      <Text fontSize={'6xl'}>{cardType === 'POT_LUCK' ? '🎲' : '🔥'}</Text>
    )}
  />
);
