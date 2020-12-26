import React, {useState} from 'react';
import {useQuery, useMutation, useQueryCache} from 'react-query';
import {Team} from '@prisma/client';
import {DateTimePicker, MuiPickersUtilsProvider} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import {Card, Button, Select} from 'components';
import {TeamsResponse, GameWithTeams} from 'types';
import {weekOptions} from 'data/weeks';
import styles from './GameForm.module.scss';

interface Props {
  game?: GameWithTeams;
}

export function GameForm({game}: Props) {
  const [teams, setTeams] = useState<Team[]>([]);
  const [home, setHome] = useState(game?.home.id || '');
  const [away, setAway] = useState(game?.away.id || '');
  const [week, setWeek] = useState(game?.week || '16');
  const [start, setStart] = useState(
    game?.start ? new Date(game.start) : new Date()
  );
  const [saved, setSaved] = useState(false);
  const cache = useQueryCache();

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
        body: JSON.stringify({home, away, start, week}),
      });
      const data = await res.json();
      if (data.success) {
        setSaved(true);
      }
      return data;
    },
    {
      onSuccess: () => {
        cache.invalidateQueries('admin_games');
      },
    }
  );

  const [editGame, {isLoading: editLoading}] = useMutation(async () => {
    const res = await fetch(`/api/editGame`, {
      method: 'POST',
      body: JSON.stringify({home, away, start, week, id: game?.id}),
    });
    const data = await res.json();
    if (data.success) {
      setSaved(true);
    }
    return data;
  });

  function handleCreatGame(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.preventDefault();

    if (game) {
      editGame();
    } else {
      createGame();
    }
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

  const teamOptions = teams
    .sort((a, b) => {
      if (a.fullName < b.fullName) {
        return -1;
      }
      if (a.fullName > b.fullName) {
        return 1;
      }

      return 0;
    })
    .map((team) => {
      return {
        label: team.fullName,
        value: team.id,
      };
    });

  return (
    <Card>
      <h3>{game ? 'Edit game' : 'Add game'}</h3>

      <form>
        <div className={styles.Container}>
          <div className={styles.TeamSelect}>
            <div>
              <label htmlFor="away-select">Away</label>
            </div>
            <Select
              name="away"
              id="away-select"
              value={away}
              onChange={setAway}
              options={teamOptions}
            />
          </div>
          <div className={styles.TeamSelect}>
            <div>
              <label htmlFor="home-select">Home</label>
            </div>
            <Select
              name="home"
              id="home-select"
              value={home}
              onChange={setHome}
              options={teamOptions}
            />
          </div>
          <div className={styles.DateTimePicker}>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <DateTimePicker value={start} onChange={setStart} />
            </MuiPickersUtilsProvider>
          </div>
          <div className={styles.WeekSelect}>
            <div>
              <label htmlFor="week-select">Week</label>
            </div>
            <Select
              name="week"
              id="week-select"
              value={week}
              onChange={setWeek}
              options={weekOptions}
            />
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
