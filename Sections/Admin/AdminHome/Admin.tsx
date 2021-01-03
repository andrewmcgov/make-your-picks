import React from 'react';
import Head from 'next/head';
import {Page, useCurrentUser} from 'components';
import {GameList, UpdateLeaderBoardCard} from './components';
import {GameForm} from '../components';

export function Admin() {
  const currentUser = useCurrentUser();

  if (!currentUser) {
    return null;
  }

  return (
    <Page title="Admin">
      <Head>
        <title>Admin | MAKE YOUR PICKS!</title>
      </Head>
      <GameForm />
      <GameList />
      <UpdateLeaderBoardCard />
    </Page>
  );
}
