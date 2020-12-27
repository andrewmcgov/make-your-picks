import React from 'react';
import Link from 'next/link';
import {useMobileNav} from '../MobileNav';
import {Nav} from '../Nav';
import styles from './Header.module.scss';

export function Header() {
  const {mobileNavTrigger, mobileNav} = useMobileNav();

  return (
    <>
      <header className={styles.Header}>
        <div className={styles.Container}>
          <Link href="/">
            <a>
              <h1 className={styles.Heading}>MAKE YOUR PICKS</h1>
            </a>
          </Link>
          <Nav />
          {mobileNavTrigger}
        </div>
      </header>
      {mobileNav}
    </>
  );
}
