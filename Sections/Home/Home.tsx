import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import {useQuery} from 'react-query';
import {GameCard, Page, SkeletonCard, Banner, BannerStatus} from 'components';
import {GamesResponse} from 'types';
import {useWeekSelect} from 'utilities/useWeekSelect';

import styles from './Home.module.scss';

export function Home() {
  const {week, weekSelect} = useWeekSelect();

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

  const selectMarkup = <div className={styles.WeekSelect}>{weekSelect}</div>;

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
      </Head>

      <Page title={'Home'} action={selectMarkup}>
        <Banner
          title="Championship Weekend is here."
          status={BannerStatus.Info}
        >
          <p className={styles.Message}>
            Each game is worth 4 points this week. Check out the{' '}
            <Link href="/leaderboard">
              <a>Leaderboard page</a>
            </Link>{' '}
            to see the latest rankings.
          </p>
        </Banner>
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
