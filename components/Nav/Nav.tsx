import React from 'react';
import Link from 'next/link';

import styles from './Nav.module.scss';

export function Nav() {
  return (
    <nav className={styles.Nav}>
      <Link href="/">
        <a className={styles.NavItem}>Home</a>
      </Link>
      <Link href="/picks">
        <a className={styles.NavItem}>Picks</a>
      </Link>
      <Link href="/account">
        <a className={styles.NavItem}>Account</a>
      </Link>
    </nav>
  );
}
