import React, {useState} from 'react';
import Head from 'next/head';
import {useQuery} from 'react-query';
import {weekOptions} from 'data/weeks';
import {GameCard, Page, SkeletonCard, Select} from 'components';
import {GamesResponse} from 'types';

import styles from './Home.module.scss';

export function Home() {
  const [week, setWeek] = useState('16');

  const {data, isLoading} = useQuery<GamesResponse>(
    ['games', week],
    async () => {
      const res = await fetch(`/api/games`, {
        method: 'POST',
        body: JSON.stringify({week: week}),
      });
      const data = await res.json();
      return data;
    }
  );

  const selectMarkup = (
    <div className={styles.WeekSelect}>
      <Select
        name="week"
        id="week-select"
        value={week}
        onChange={setWeek}
        options={weekOptions}
      />
    </div>
  );

  const loadingMarkup = isLoading ? (
    <div className={styles.GameGrid}>
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
    </div>
  ) : null;

  const gamesMarkup = data?.games.map((game) => {
    return <GameCard key={game.id} game={game} />;
  });

  return (
    <>
      <Head>
        <title>MAKE YOUR PICKS!</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Page title={'Home'} action={selectMarkup}>
        {loadingMarkup}
        <div className={styles.GameGrid}>{gamesMarkup}</div>
        {data?.games.length < 1 && (
          <p className={styles.NoGamesFound}>
            No games added for this week! Try another week.
          </p>
        )}
      </Page>
    </>
  );
}
