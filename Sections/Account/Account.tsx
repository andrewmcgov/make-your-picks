import React from 'react';
import Head from 'next/head';
import {useCurrentUser, Page, Logout} from 'components';

import {AccountForms} from './components';
import styles from './Account.module.scss';

export function Account() {
  const user = useCurrentUser();

  return (
    <>
      <Head>
        <title>Accout | MAKE YOUR PICKS!</title>
      </Head>
      {user ? (
        <Page title="Account">
          <p>
            You are logged in as <strong>{user.username}</strong>.
          </p>
          <Logout />
        </Page>
      ) : (
        <div className={styles.Container}>
          <AccountForms />
        </div>
      )}
    </>
  );
}
