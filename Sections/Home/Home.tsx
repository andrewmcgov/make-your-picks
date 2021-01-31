import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import {useQuery} from 'react-query';
import {GameCard, Page, SkeletonCard, Banner, BannerStatus} from 'components';
import {GamesResponse} from 'types';
import {useWeekSelect} from 'utilities/useWeekSelect';
import {classNames} from 'utilities/classNames';
import {SuperBowlTieBreaker} from './components';

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

  const isSuperBowl = week === 'SB';

  const gamesMarkup = data?.games.map((game) => {
    return isSuperBowl ? (
      <div className={styles.SuperBowlGame}>
        <GameCard key={game.id} game={game} />
      </div>
    ) : (
      <GameCard key={game.id} game={game} />
    );
  });

  const tieBreakerMarkup =
    isSuperBowl && !isLoading ? (
      <SuperBowlTieBreaker
        tieBreakers={data?.tieBreakers || []}
        userTieBreaker={data?.userTieBreaker}
      />
    ) : null;

  return (
    <>
      <Head>
        <title>MAKE YOUR PICKS!</title>
      </Head>

      <Page title={'Home'} action={selectMarkup}>
        <Banner title="It's time for the superbowl!" status={BannerStatus.Info}>
          <p className={styles.Message}>
            The Superbowl is worth 5 points. As a tie breaker, please enter your
            prediction for how many total points will be scored in the superbowl
            below. Check out the{' '}
            <Link href="/leaderboard">
              <a>Leaderboard page</a>
            </Link>{' '}
            to see the latest rankings.
          </p>
        </Banner>
        {loadingMarkup}
        <div
          className={classNames(
            styles.GameGrid,
            isSuperBowl && styles.SuperBowlGrid
          )}
        >
          {gamesMarkup}
          {tieBreakerMarkup}
        </div>
        {data?.games.length < 1 && (
          <p className={styles.NoGamesFound}>
            No games added for this week! Try another week.
          </p>
        )}
      </Page>
    </>
  );
}
