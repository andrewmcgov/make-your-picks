import React from 'react';
import {FiAlertCircle, FiLock, FiCheckCircle, FiXCircle} from 'react-icons/fi';
import styles from './ClosedPick.module.scss';
import {GameWithTeamsAndPicksAndUserPick} from 'types';
import {classNames} from 'utilities/classNames';
interface Props {
  game: GameWithTeamsAndPicksAndUserPick;
}

export function ClosedPick({game}: Props) {
  const pick = game.userPick || undefined;
  const allPicks = game.picks || [];

  const homePicks = allPicks.filter((pick) => pick.teamId === game.homeId);
  const awayPicks = allPicks.filter((pick) => pick.teamId === game.awayId);

  function getMarkup() {
    if (pick) {
      if (pick.closed) {
        if (pick.correct) {
          return (
            <div className={styles.PickWrapper}>
              <FiCheckCircle size="16px" />
              <p>
                Sick pick! The <span>{pick.team.nickName}</span> won.
              </p>
            </div>
          );
        } else {
          return (
            <div className={styles.PickWrapper}>
              <FiXCircle size="16px" />
              <p>
                Tough scene. The <span>{pick.team.nickName}</span> lost.
              </p>
            </div>
          );
        }
      } else {
        return (
          <div className={styles.PickWrapper}>
            <FiLock size="16px" />
            <p>
              Your pick: <span>{pick.team.nickName}</span>
            </p>
          </div>
        );
      }
    } else {
      return (
        <div className={styles.PickWrapper}>
          <FiAlertCircle size="16px" />
          <p>Picks for this game are closed</p>
        </div>
      );
    }
  }

  const allPicksMarkup = (
    <div className={styles.AllPicks}>
      <div className={styles.Away}>
        <ul>
          {awayPicks.map((currentPick) => (
            <li
              className={classNames(
                currentPick.userId === pick?.userId ? styles.Bold : null
              )}
            >
              {currentPick.user.username}
            </li>
          ))}
          {awayPicks.length === 0 ? <li>{`:'(`}</li> : null}
        </ul>
      </div>
      <div className={styles.Home}>
        <ul>
          {homePicks.map((currentPick) => (
            <li
              className={classNames(
                currentPick.userId === pick?.userId ? styles.Bold : null
              )}
            >
              {currentPick.user.username}
            </li>
          ))}
          {homePicks.length === 0 ? <li>{`:'(`}</li> : null}
        </ul>
      </div>
    </div>
  );

  return (
    <>
      {allPicksMarkup}
      <div className={styles.ClosedPick}>{getMarkup()}</div>
    </>
  );
}
