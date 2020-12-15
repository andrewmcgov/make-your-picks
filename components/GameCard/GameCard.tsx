import React, {useState} from 'react';

import {Card} from '../../components';
import {GameWithTeams} from '../../types';

import styles from './GameCard.module.scss';

interface Props {
  game: GameWithTeams;
}

export function GameCard({game}: Props) {
  const [pick, setPick] = useState<number>();

  const {id, awayId, homeId, home, away, start} = game;

  return (
    <Card>
      <div className={styles.Matchup}>
        <span>{away.city}</span>
        <span>@</span>
        <span>{home.city}</span>
      </div>
      <p className={styles.Date}>{new Date(start).toLocaleString()}</p>
      <div className={styles.Pick}>
        <div className={styles.Option}>
          <input
            type="radio"
            id={`away-${id}`}
            name={`pick-${id}`}
            value={awayId}
            checked={pick === awayId}
            onChange={() => setPick(awayId)}
          />
          <label htmlFor={`away-${id}`}>{game.away.abr.toUpperCase()}</label>
        </div>

        <div className={styles.Option}>
          <input
            type="radio"
            id={`home-${id}`}
            name={`pick-${id}`}
            value={homeId}
            checked={pick === homeId}
            onChange={() => setPick(homeId)}
          />
          <label htmlFor={`home-${id}`}>{game.home.abr.toUpperCase()}</label>
        </div>
      </div>
    </Card>
  );
}
