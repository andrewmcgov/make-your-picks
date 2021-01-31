import React from 'react';
import {useQuery} from 'react-query';
import {SkeletonCard} from 'components';
import {LeaderboardEntryResponse} from 'types';
import styles from './Leaderboard.module.scss';

export function Leaderboard() {
  const {data, isLoading} = useQuery<LeaderboardEntryResponse>(
    ['leaderboard'],
    async () => {
      const res = await fetch(`/api/leaderboard`, {
        method: 'POST',
      });
      const data = await res.json();
      return data;
    }
  );

  return (
    <div className={styles.Leaderboard}>
      {isLoading && <SkeletonCard />}
      {!isLoading && (
        <>
          <p>
            <strong>Points per game</strong>
          </p>
          <p>Wildcard: 2, Divisional: 2, Conference: 4, Superbowl: 5</p>
          <table className={styles.Table}>
            <thead>
              <tr>
                <th>User</th>
                <th>WC</th>
                <th>DIV</th>
                <th>CC</th>
                <th>SB</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {data.entries.map((entry) => (
                <tr>
                  <td>{entry.user.username}</td>
                  <td>{entry.wildcard}</td>
                  <td>{entry.division}</td>
                  <td>{entry.conference}</td>
                  <td>{entry.superbowl}</td>
                  <td>{entry.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}
