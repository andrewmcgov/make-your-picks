import React from 'react';

import {Nav} from '../Nav';
import styles from './Header.module.scss';

export function Header() {
  return (
    <header className={styles.Header}>
      <div className={styles.Container}>
        <h1 className={styles.Heading}>MAKE YOUR PICKS</h1>
        <Nav />
      </div>
    </header>
  );
}
