import React from 'react';
import Link from 'next/link';

import {useCurrentUser} from '../CurrentUserContextProvider';
import styles from './Nav.module.scss';

export function Nav() {
  const user = useCurrentUser();

  return (
    <nav className={styles.Nav}>
      <Link href="/">
        <a className={styles.NavItem}>Home</a>
      </Link>
      <Link href="/account">
        <a className={styles.NavItem}>Account</a>
      </Link>

      {user?.id <= 2 && (
        <Link href="/admin">
          <a className={styles.NavItem}>Admin</a>
        </Link>
      )}
    </nav>
  );
}
