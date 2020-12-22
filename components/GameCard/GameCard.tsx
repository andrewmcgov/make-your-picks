import React, {useState} from 'react';
import Link from 'next/link';
import {useMutation} from 'react-query';
import moment from 'moment';

import {classNames} from 'utilities/classNames';
import {Card, useCurrentUser} from 'components';
import {GameWithTeams} from 'types';

import styles from './GameCard.module.scss';

interface Props {
  game: GameWithTeams;
}

export function GameCard({game}: Props) {
  const originalPick = (game.Pick && game.Pick[0] && game.Pick[0].teamId) || '';
  const user = useCurrentUser();
  const [pick, setPick] = useState<number>(originalPick);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const {id, awayId, homeId, home, away, start} = game;

  const [savePick, {isLoading}] = useMutation<any, unknown, {pick: number}>(
    async (variables) => {
      const res = await fetch(`/api/savePick`, {
        method: 'POST',
        body: JSON.stringify({gameId: id, teamId: variables.pick}),
      });
      const data = await res.json();
      if (data.success) {
        setSaved(true);
      } else {
        setError(data.message || 'Error saving pick');
        setPick(originalPick);
      }
      return data;
    },
    {
      onSuccess: () => {
        // cache.invalidateQueries('currentUser');
      },
    }
  );

  function handleSavePick(pick: number) {
    setSaved(false);
    setError('');
    setPick(pick);
    savePick({pick});
  }

  const pickMarkup = user ? (
    <>
      <div className={styles.Pick}>
        <div className={styles.Option}>
          <input
            type="radio"
            id={`away-${id}`}
            name={`pick-${id}`}
            value={awayId}
            checked={pick === awayId}
            onChange={() => handleSavePick(awayId)}
            disabled={isLoading}
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
            onChange={() => handleSavePick(homeId)}
            disabled={isLoading}
          />
          <label htmlFor={`home-${id}`}>{game.home.abr.toUpperCase()}</label>
        </div>
      </div>
      {saved && <p className={styles.Success}>Pick saved!</p>}
      {error && <p className={styles.Error}>{error}</p>}
    </>
  ) : (
    <p className={styles.LoginMessage}>
      To make your pick for this game,{' '}
      <a className={styles.SignInLink}>
        <Link href="/account">login here.</Link>
      </a>
    </p>
  );

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
      <p className={styles.Date}>{moment(game.start).calendar()}</p>
      {pickMarkup}
    </Card>
  );
}
