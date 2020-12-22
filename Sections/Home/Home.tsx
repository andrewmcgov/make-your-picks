import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import {useQuery} from 'react-query';

import {useCurrentUser, GameCard} from 'components';
import {GamesResponse} from 'types';

import {Page} from 'components';
import styles from './Home.module.scss';

export function Home() {
  const user = useCurrentUser();

  const {data, isLoading} = useQuery<GamesResponse>('games', async () => {
    const res = await fetch(`/api/games`);
    const data = await res.json();
    return data;
  });

  if (!data?.games || isLoading) {
    return <p>Loading games...</p>;
  }

  const gamesMarkup = data?.games.map((game) => {
    return <GameCard key={game.id} game={game} />;
  });

  return (
    <>
      <Head>
        <title>MAKE YOUR PICKS!</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Page title={'Home'}>
        <div className={styles.GameGrid}>{gamesMarkup}</div>
      </Page>
    </>
  );
}
