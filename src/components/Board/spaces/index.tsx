import { formatPrice } from '@/util/formatPrice';
import { propertyGroupToCSS } from '@/util/property-colors';
import { Box, Text } from '@chakra-ui/react';
import {
  BoardSpace as BoardSpaceT,
  CardType,
  GameProperty,
} from '@prisma/client';
import React from 'react';
import styles from './spaces.module.css';

type BoardSpaceProps = BoardSpaceT & { property: GameProperty | null };

export default function BoardSpace(props: BoardSpaceProps) {
  switch (props.space_type) {
    case 'PROPERTY':
      return <BoardSpace.Property property={props.property} />;
    case 'GO':
      return <BoardSpace.Go />;
    case 'TAKE_CARD':
      return <BoardSpace.TakeCard cardType={props?.take_card ?? 'POT_LUCK'} />;
    case 'GO_TO_JAIL':
      return <BoardSpace.GoToJail />;
    case 'JUST_VISIT':
      return <BoardSpace.Jail />;
    case 'FREE_PARKING':
      return <BoardSpace.FreeParking />;
    default:
      return <BoardSpace.Empty />;
  }
}

BoardSpace.Property = ({ property }: { property: GameProperty | null }) => (
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

BoardSpace.Empty = () => (
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
}: {
  title: string;
  imageComponent: React.FC;
}) => (
  <div className={`${styles.boardSpace} ${styles.special}`}>
    <div className={styles.specialText}>{title}</div>
    <ImageComponent />
  </div>
);

BoardSpace.Jail = () => (
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

BoardSpace.GoToJail = () => (
  <div className={`${styles.boardSpace} ${styles.square} ${styles.goToJail}`}>
    <div className="rotate bottomRight">
      Go to
      <Box>
        <Text fontSize={'6xl'}>🤦</Text>
      </Box>
      Jail
    </div>
  </div>
);

BoardSpace.Go = () => {
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

BoardSpace.FreeParking = () => (
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

BoardSpace.TakeCard = ({ cardType }: { cardType: CardType }) => (
  <BoardSpace.Special
    title={cardType === 'POT_LUCK' ? 'Pot Luck' : 'Opportunity Knocks'}
    imageComponent={() => (
      <Text fontSize={'6xl'}>{cardType === 'POT_LUCK' ? '🎲' : '🔥'}</Text>
    )}
  />
);
