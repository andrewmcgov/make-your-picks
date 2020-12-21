import React from 'react';

import {classNames} from '../../utilities/classNames';
import styles from './Card.module.scss';

interface Props {
  children: React.ReactNode;
  flush?: boolean;
}

export function Card({children, flush}: Props) {
  const classes = classNames(styles.Card, flush && styles.Flush);
  return <div className={classes}>{children}</div>;
}
