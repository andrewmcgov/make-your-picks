import React, {useState} from 'react';
import {useQuery, useMutation} from 'react-query';
import {Team} from '@prisma/client';

import {Card} from '../../../../components';
import {TeamsResponse} from '../../../../types';

import styles from './GameForm.module.scss';

export function GameForm() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [home, setHome] = useState('');
  const [away, setAway] = useState('');

  const {data, isLoading, error} = useQuery('teams', async () => {
    const res = await fetch('http://localhost:3000/api/getTeams');
    const data = (await res.json()) as TeamsResponse;

    if (data.teams) {
      setTeams(data.teams);
    }
  });

  if (isLoading || teams.length === 0) {
    <p>Loading teams...</p>;
  }

  const teamOptions = teams.map((team) => {
    return (
      <option key={team.id} value={team.id}>
        {team.fullName}
      </option>
    );
  });

  return (
    <Card>
      <h3>Add Game</h3>

      <div className={styles.TeamSelect}>
        <div>
          <label htmlFor="home-select">Home</label>
        </div>
        <select
          name="home"
          id="home-select"
          value={home}
          onChange={(e) => setHome(e.target.value)}
        >
          {teamOptions}
        </select>
      </div>

      <div className={styles.TeamSelect}>
        <div>
          <label htmlFor="away-select">Away</label>
        </div>
        <select
          name="away"
          id="away-select"
          value={away}
          onChange={(e) => setAway(e.target.value)}
        >
          {teamOptions}
        </select>
      </div>
    </Card>
  );
}
