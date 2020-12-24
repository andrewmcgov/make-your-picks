import React, {useState} from 'react';
import Link from 'next/link';
import moment from 'moment';
import {classNames} from 'utilities/classNames';
import {Card, useCurrentUser} from 'components';
import {GameWithTeams} from 'types';
import {Pick, ClosedPick} from './components';

import styles from './GameCard.module.scss';

interface Props {
  game: GameWithTeams;
}

export function GameCard({game}: Props) {
  const user = useCurrentUser();

  const {home, away, start} = game;

  const gameStarted = Date.parse((start as unknown) as string) < Date.now();

  const loginMessage =
    user || gameStarted ? null : (
      <p className={styles.LoginMessage}>
        To make your pick for this game,{' '}
        <a className={styles.SignInLink}>
          <Link href="/account">login here.</Link>
        </a>
      </p>
    );

  const pickMarkup = user && !gameStarted ? <Pick game={game} /> : null;
  const closedPick = gameStarted ? <ClosedPick game={game} /> : null;

  return (
    <Card flush>
      <div className={styles.Matchup}>
        <span className={classNames(styles.Away, `NFL-${game.away.abr}`)}>
          {away.city}
        </span>
        <span className={classNames(styles.Home, `NFL-${game.home.abr}`)}>
          {home.city}
        </span>
      </div>
      <div className={styles.Content}>
        <p className={styles.Date}>{moment(start).calendar()}</p>
        {loginMessage}
        {pickMarkup}
        {closedPick}
      </div>
    </Card>
  );
}
