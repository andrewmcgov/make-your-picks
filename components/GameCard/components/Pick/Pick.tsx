import React, {useState} from 'react';
import {RadioButton} from 'components';
import {useMutation} from 'react-query';
import {FiUnlock} from 'react-icons/fi';
import styles from './Pick.module.scss';
import {GameWithTeamsAndPicksAndUserPick} from 'types';
import {customFetch} from 'utilities/api';

interface Props {
  game: GameWithTeamsAndPicksAndUserPick;
}

export function Pick({game}: Props) {
  const originalPick = game.userPick?.teamId || '';
  const [pick, setPick] = useState(originalPick);
  const [error, setError] = useState('');
  const {id, awayId, homeId, home, away, start} = game;

  const [savePick, {isLoading}] = useMutation<any, unknown, {pick: number}>(
    (variables) =>
      customFetch({
        url: `/api/savePick`,
        body: JSON.stringify({gameId: id, teamId: variables.pick}),
      }),
    {
      onSuccess: (data) => {
        if (!data.success) {
          setError(data.message || 'Error saving pick');
          setPick(originalPick);
        }
      },
    }
  );

  function handleSavePick(pick: number) {
    setError('');
    setPick(pick);
    savePick({pick});
  }

  return (
    <>
      <div className={styles.Icon}>
        <FiUnlock />
      </div>
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
          row
        />
      </div>
      {error && <p className={styles.Error}>{error}</p>}
    </>
  );
}
