import React, {useState} from 'react';
import Link from 'next/link';

import {Card} from '../Card';
import {classNames} from '../../utilities/classNames';
import styles from './MobileNav.module.scss';

export function MobileNav() {
  const [open, setOpen] = useState(false);

  function closeNav() {
    setOpen(false);
  }

  const navClasses = classNames(styles.MobileNav, open && styles.MobileNavOpen);

  return (
    <>
      <button
        className={classNames(styles.Trigger, open && styles.TriggerOpen)}
        onClick={() => setOpen(!open)}
      >
        <span className={open ? styles.Top : undefined}>|</span>
        <span className={open ? styles.Middle : undefined}>|</span>
        <span className={open ? styles.Outside : undefined}>|</span>
      </button>

      <div className={navClasses}>
        <Card>
          <div className={styles.InnerNav}>
            <Link href="/">
              <a className={styles.NavItem} onClick={closeNav}>
                Home
              </a>
            </Link>
            <Link href="/picks">
              <a className={styles.NavItem} onClick={closeNav}>
                Picks
              </a>
            </Link>
            <Link href="/account">
              <a className={styles.NavItem} onClick={closeNav}>
                Account
              </a>
            </Link>
            <Link href="/admin">
              <a className={styles.NavItem} onClick={closeNav}>
                Admin
              </a>
            </Link>
          </div>
        </Card>
      </div>
    </>
  );
}
