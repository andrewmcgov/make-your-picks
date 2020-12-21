import React from 'react';

import {Header} from '../Header';
import {MobileNav} from '../MobileNav';
import styles from '../../styles/Layout.module.scss';

interface Props {
  children: JSX.Element;
}

export function Layout({children}: Props) {
  return (
    <>
      <Header />
      <div className={styles.LayoutContainer}>{children}</div>
      <MobileNav />
    </>
  );
}
