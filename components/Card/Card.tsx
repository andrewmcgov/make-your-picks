import React from 'react';

import styles from './Card.module.scss';

interface Props {
  children: React.ReactNode;
}

export function Card({children}: Props) {
  return <div className={styles.Card}>{children}</div>;
}
