import React from 'react';
import Head from 'next/head';

import {Login} from './components';
import styles from './Account.module.scss';

export function Account() {
  return (
    <>
      <Head>
        <title>Accout | MAKE YOUR PICKS!</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.Container}>
        <Login />
      </div>
    </>
  );
}
