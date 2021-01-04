import React, {useState} from 'react';
import Link from 'next/link';
import moment from 'moment';
import {classNames} from 'utilities/classNames';
import {Card, useCurrentUser} from 'components';
import {GameWithTeamsAndPicksAndUserPick} from 'types';
import {Pick, ClosedPick} from './components';

import styles from './GameCard.module.scss';

interface Props {
  game: GameWithTeamsAndPicksAndUserPick;
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

  console.log(
    `Total picks for ${away.abr} @ ${home.abr}: ${game.picks?.length || 0}`
  );

  return (
    <Card flush>
      <div className={styles.Matchup}>
        <div className={classNames(styles.Team, `NFL-${game.away.abr}`)}>
          <span>{away.city}</span>
          {game.awayScore !== undefined ? <span>{game.awayScore}</span> : null}
        </div>
        <div className={classNames(styles.Team, `NFL-${game.home.abr}`)}>
          <span>{home.city}</span>
          {game.homeScore !== undefined ? <span>{game.homeScore}</span> : null}
        </div>
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
