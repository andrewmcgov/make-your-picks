import React, {useState} from 'react';
import Link from 'next/link';
import {useCurrentUser, RadioButton, Spinner} from 'components';
import {useMutation} from 'react-query';

import styles from './Pick.module.scss';
import {GameWithTeams} from 'types';

interface Props {
  game: GameWithTeams;
}

export function Pick({game}: Props) {
  const originalPick = (game.Pick && game.Pick[0] && game.Pick[0].teamId) || '';
  const user = useCurrentUser();
  const [pick, setPick] = useState<number>(originalPick);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const {id, awayId, homeId, home, away, start} = game;
  const gameStarted = Date.parse((start as unknown) as string) < Date.now();

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
    }
  );

  function handleSavePick(pick: number) {
    setSaved(false);
    setError('');
    setPick(pick);
    savePick({pick});
  }

  return (
    <>
      <div className={styles.Pick}>
        <RadioButton
          id={`away-${id}`}
          name={`pick-${id}`}
          label={away.nickName}
          value={awayId}
          checked={pick === awayId}
          onChange={() => handleSavePick(awayId)}
          disabled={isLoading}
          loading={isLoading}
        />
        <RadioButton
          id={`home-${id}`}
          name={`pick-${id}`}
          label={home.nickName}
          value={homeId}
          checked={pick === homeId}
          onChange={() => handleSavePick(homeId)}
          disabled={isLoading}
          loading={isLoading}
        />
      </div>
      {error && <p className={styles.Error}>{error}</p>}
    </>
  );
}
