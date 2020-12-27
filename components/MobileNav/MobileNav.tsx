import React, {useState} from 'react';
import Link from 'next/link';
import {FiMenu, FiX} from 'react-icons/fi';
import {useCurrentUser} from '../CurrentUserContextProvider';
import {classNames} from 'utilities/classNames';
import styles from './MobileNav.module.scss';

export function useMobileNav() {
  const [open, setOpen] = useState(false);
  const user = useCurrentUser();

  function closeNav() {
    setOpen(false);
  }

  const navClasses = classNames(styles.MobileNav, open && styles.MobileNavOpen);

  return {
    mobileNavTrigger: (
      <button
        className={classNames(styles.Trigger, open && styles.TriggerOpen)}
        onClick={() => setOpen(!open)}
      >
        {open ? <FiX size="25px" /> : <FiMenu size="25px" />}
      </button>
    ),
    mobileNav: (
      <div className={navClasses}>
        <Link href="/">
          <a className={styles.NavItem} onClick={closeNav}>
            Home
          </a>
        </Link>
        <Link href="/account">
          <a className={styles.NavItem} onClick={closeNav}>
            Account {user?.username ? `(${user?.username})` : ''}
          </a>
        </Link>
        {user?.id <= 2 && (
          <Link href="/admin">
            <a className={styles.NavItem} onClick={closeNav}>
              Admin
            </a>
          </Link>
        )}
      </div>
    ),
  };
}
