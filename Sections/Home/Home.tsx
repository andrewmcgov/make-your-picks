import React from 'react';
import Head from 'next/head';
import {useQuery} from 'react-query';
import Confetti from 'react-confetti';
import useWindowSize from 'react-use/lib/useWindowSize';
import {
  GameCard,
  Page,
  SkeletonCard,
  Banner,
  BannerStatus,
  Leaderboard,
} from 'components';
import {GamesResponse} from 'types';
import {useWeekSelect} from 'utilities/useWeekSelect';
import {classNames} from 'utilities/classNames';
import {gameStarted} from 'utilities/gameStarted';
import {SuperBowlTieBreaker} from './components';

import styles from './Home.module.scss';

export function Home() {
  const {week, weekSelect} = useWeekSelect();
  const {width, height} = useWindowSize();

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
  const superBowl = isSuperBowl && data?.games[0];
  const superBowlStarted = superBowl ? gameStarted(superBowl) : false;
  const superBowlFinished =
    superBowl && (superBowl.awayScore || superBowl.homeScore);

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
    isSuperBowl && !superBowlStarted && !isLoading ? (
      <SuperBowlTieBreaker userTieBreaker={data?.userTieBreaker} />
    ) : null;

  return (
    <>
      <Head>
        <title>MAKE YOUR PICKS!</title>
      </Head>
      {typeof window !== 'undefined' && superBowlFinished ? (
        <Confetti
          width={width}
          height={document.documentElement.scrollHeight}
        />
      ) : null}

      <Page title={'Home'} action={selectMarkup}>
        <Banner title="It's time for the superbowl!" status={BannerStatus.Info}>
          <p className={styles.Message}>
            The Superbowl is worth 5 points. As a tie breaker, please enter your
            prediction for how many total points will be scored in the superbowl
            below.
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
        <div className={styles.Leaderboard}>
          <div>
            <Leaderboard />
          </div>
        </div>
      </Page>
    </>
  );
}
