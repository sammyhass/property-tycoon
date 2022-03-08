import { BoardSpace, GameProperty } from '@prisma/client';
import React from 'react';
import styles from './spaces.module.css';

type BoardSpaceProps = BoardSpace & { property: GameProperty | null };

export default function BoardSpace(props: BoardSpaceProps) {
  switch (props.space_type) {
    case 'PROPERTY':
      return <BoardSpace.Property {...props} />;
    default:
      return <div>{props.space_type}</div>;
  }
}

BoardSpace.Property = ({ property }: BoardSpaceProps) => (
  <div className={`${styles['board-space']} ${styles.property}"`}>
    <div className={styles['board-backround']}></div>
    <div className="property-content">
      <div className="property-text">BOARDWALK</div>
      <div className="property-price">£400</div>
    </div>
  </div>
);

BoardSpace.Empty = ({}: BoardSpaceProps) => {};

BoardSpace.Special = ({}: BoardSpaceProps) => {};

BoardSpace.Jail = ({}: BoardSpaceProps) => {};

BoardSpace.GoToJail = ({}: BoardSpaceProps) => {};

BoardSpace.Go = ({}: BoardSpaceProps) => {};

BoardSpace.FreeParking = ({}: BoardSpaceProps) => {};
