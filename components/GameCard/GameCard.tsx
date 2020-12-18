import React, {useState, useEffect} from 'react';
import {useMutation} from 'react-query';

import {Card, useCurrentUser} from '../../components';
import {GameWithTeams} from '../../types';

import styles from './GameCard.module.scss';

interface Props {
  game: GameWithTeams;
}

export function GameCard({game}: Props) {
  const user = useCurrentUser();
  const [pick, setPick] = useState<number>(
    (game.Pick && game.Pick[0] && game.Pick[0].teamId) || ''
  );
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState(false);

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
        setError(true);
      }
      return data;
    },
    {
      onSuccess: () => {
        // cache.invalidateQueries('currentUser');
      },
    }
  );

  function handleSavePick(pick) {
    setSaved(false);
    setError(false);
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
        {saved && <p className={styles.Success}>Pick saved!</p>}
        {error && <p className={styles.Success}>Error saving pick!</p>}
      </div>
    </>
  ) : null;

  return (
    <Card>
      <div className={styles.Matchup}>
        <span>{away.city}</span>
        <span>@</span>
        <span>{home.city}</span>
      </div>
      <p className={styles.Date}>{new Date(start).toLocaleString()}</p>
      {pickMarkup}
    </Card>
  );
}
