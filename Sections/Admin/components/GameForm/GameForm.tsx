import React, {useState} from 'react';
import {useQuery, useMutation} from 'react-query';
import {Team} from '@prisma/client';
import {DateTimePicker, MuiPickersUtilsProvider} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import {Card, Button} from 'components';
import {TeamsResponse, GameWithTeams} from 'types';
import {weeks} from 'data/weeks';
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

  const {isLoading} = useQuery('teams', async () => {
    const res = await fetch('/api/getTeams');
    const data = (await res.json()) as TeamsResponse;

    if (data.teams) {
      setTeams(data.teams);
    }
  });

  const [createGame, {isLoading: createLoading}] = useMutation(async () => {
    const res = await fetch(`/api/createGame`, {
      method: 'POST',
      body: JSON.stringify({home, away, start, week}),
    });
    const data = await res.json();
    if (data.success) {
      setSaved(true);
    }
    return data;
  });

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
      return (
        <option key={team.id} value={team.id}>
          {team.fullName}
        </option>
      );
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
          <div className={styles.WeekSelect}>
            <div>
              <label htmlFor="week-select">Week</label>
            </div>
            <select
              name="week"
              id="week-select"
              value={week}
              onChange={(e) => setWeek(e.target.value)}
            >
              {weeks.map((week) => (
                <option key={week} value={week}>
                  {week}
                </option>
              ))}
            </select>
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
