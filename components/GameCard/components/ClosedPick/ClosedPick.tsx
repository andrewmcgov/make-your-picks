import React from 'react';
import {FiAlertCircle, FiLock, FiCheckCircle, FiXCircle} from 'react-icons/fi';
import styles from './ClosedPick.module.scss';
import {GameWithTeams} from 'types';

interface Props {
  game: GameWithTeams;
}

export function ClosedPick({game}: Props) {
  const pick = (game.picks && game.picks[0]) || undefined;

  function getMarkup() {
    if (pick) {
      if (pick.closed) {
        if (pick.correct) {
          return (
            <div>
              <FiCheckCircle size="16px" />
              <p>
                Sick pick! The <span>{pick.team.nickName}</span> won.
              </p>
            </div>
          );
        } else {
          return (
            <div>
              <FiXCircle size="16px" />
              <p>
                Tough scene. The <span>{pick.team.nickName}</span> lost.
              </p>
            </div>
          );
        }
      } else {
        return (
          <div>
            <FiLock size="16px" />
            <p>
              Your pick: <span>{pick.team.nickName}</span>
            </p>
          </div>
        );
      }
    } else {
      return (
        <div>
          <FiAlertCircle size="16px" />
          <p>Picks for this game are closed</p>
        </div>
      );
    }
  }

  return <div className={styles.ClosedPick}>{getMarkup()}</div>;
}
