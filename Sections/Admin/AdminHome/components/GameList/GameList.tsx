import React from 'react';
import {useQuery} from 'react-query';
import moment from 'moment';
import Link from 'next/link';

import {GamesResponse} from 'types';
import {Card} from 'components';
import {useWeekSelect} from 'utilities/useWeekSelect';
import {classNames} from 'utilities/classNames';
import {customFetch} from 'utilities/api';

import styles from './GameList.module.scss';

export function GameList() {
  const {week, weekSelect} = useWeekSelect();

  const {data} = useQuery<GamesResponse>(['admin_games', week], () =>
    customFetch({
      url: '/api/games',
      body: JSON.stringify({adminPage: true, week}),
    })
  );

  const gameRows = data?.games.map((game) => (
    <li key={game.id}>
      <Link href={`/admin/game/${game.id}`}>
        <a>
          <div className={styles.GameRow}>
            <span>{game.week}</span>
            <span
              className={classNames(
                game.winnerId === game.awayId && styles.Winner,
                game.winnerId === game.homeId && styles.Loser
              )}
            >
              {game.away.fullName}
            </span>
            <span
              className={classNames(
                game.winnerId === game.homeId && styles.Winner,
                game.winnerId === game.awayId && styles.Loser
              )}
            >
              {game.home.fullName}
            </span>
            <span>{moment(game.start).calendar()}</span>
          </div>
        </a>
      </Link>
    </li>
  ));

  return (
    <div className={styles.Wrapper}>
      <Card>
        <div className={styles.Header}>
          <h3>Game list</h3>
          <div>{weekSelect}</div>
        </div>
        <ul className={styles.List}>{gameRows}</ul>
      </Card>
    </div>
  );
}
