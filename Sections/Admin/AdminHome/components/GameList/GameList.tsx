import React from 'react';
import {useQuery} from 'react-query';
import moment from 'moment';
import Link from 'next/link';

import {GamesResponse} from '../../../../../types';
import {Card} from '../../../../../components';

import styles from './GameList.module.scss';

export function GameList() {
  const {data, isLoading} = useQuery<GamesResponse>('admin_games', async () => {
    const res = await fetch(`/api/games`, {
      method: 'POST',
      body: JSON.stringify({adminPage: true}),
    });
    const data = await res.json();
    return data;
  });

  const gameRows = data?.games.map((game) => (
    <React.Fragment key={game.id}>
      <Link href={`/admin/game/${game.id}`}>
        <a>
          <div className={styles.GameRow}>
            <div>{game.week}</div>
            <div>{game.away.fullName}</div>
            <div>{game.home.fullName}</div>
            <div>{moment(game.start).calendar()}</div>
          </div>
        </a>
      </Link>
    </React.Fragment>
  ));

  return (
    <div className={styles.Wrapper}>
      <Card>
        <h3>Game list</h3>
        {gameRows}
      </Card>
    </div>
  );
}
