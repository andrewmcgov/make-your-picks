import React, {useState} from 'react';
import {useQuery, useMutation} from 'react-query';
import {Team} from '@prisma/client';
import {DateTimePicker, MuiPickersUtilsProvider} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';

import {Card, Button} from '../../../../components';
import {TeamsResponse} from '../../../../types';

import styles from './GameForm.module.scss';

export function GameForm() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [home, setHome] = useState('');
  const [away, setAway] = useState('');
  const [start, setStart] = useState(new Date());
  const [saved, setSaved] = useState(false);

  const {isLoading} = useQuery('teams', async () => {
    const res = await fetch('/api/getTeams');
    const data = (await res.json()) as TeamsResponse;

    if (data.teams) {
      setTeams(data.teams);
    }
  });

  const [createGame, {isLoading: createLoading}] = useMutation(
    async () => {
      const res = await fetch(`/api/createGame`, {
        method: 'POST',
        body: JSON.stringify({home, away, start}),
      });
      const data = await res.json();
      if (data.success) {
        setSaved(true);
      }
      return data;
    },
    {
      onSuccess: () => {
        // cache.invalidateQueries('currentUser');
      },
    }
  );

  function handleCreatGame(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.preventDefault();
    createGame();
  }

  function resetForm(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.preventDefault();
    setHome('');
    setAway('');
    setStart(new Date());
    setSaved(false);
  }

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

      <form>
        <div className={styles.Container}>
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
          <div className={styles.DateTimePicker}>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <DateTimePicker value={start} onChange={setStart} />
            </MuiPickersUtilsProvider>
          </div>
        </div>
        <Button onClick={resetForm} secondary>
          Reset
        </Button>
        <Button primary onClick={handleCreatGame} disabled={createLoading} row>
          Save!
        </Button>
        {saved && <p>Saved!</p>}
      </form>
    </Card>
  );
}
