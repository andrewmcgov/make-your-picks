import React from 'react';

import {Header} from '../Header';
import {MobileNav} from '../MobileNav';
import {Footer} from '../Footer';
import styles from './Layout.module.scss';

interface Props {
  children: JSX.Element;
}

export function Layout({children}: Props) {
  return (
    <div className={styles.LayoutWrapper}>
      <div>
        <Header />
        <div className={styles.LayoutContainer}>{children}</div>
        <MobileNav />
      </div>
      <Footer />
    </div>
  );
}
