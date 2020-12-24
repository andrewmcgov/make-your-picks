import React from 'react';
import {FiAlertCircle, FiLock} from 'react-icons/fi';
import styles from './ClosedPick.module.scss';
import {GameWithTeams} from 'types';

interface Props {
  game: GameWithTeams;
}

export function ClosedPick({game}: Props) {
  const pick = (game.Pick && game.Pick[0]) || undefined;

  console.log(pick);

  return (
    <div className={styles.ClosedPick}>
      {pick ? (
        <div>
          <FiLock size="16px" />
          <p>
            Your pick: <span>{pick.team.nickName}</span>
          </p>
        </div>
      ) : (
        <div>
          <FiAlertCircle size="16px" />
          <p>Picks for this game are closed</p>
        </div>
      )}
    </div>
  );
}
