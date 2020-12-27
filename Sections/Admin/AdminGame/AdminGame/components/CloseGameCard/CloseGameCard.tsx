import React, {useState} from 'react';
import {useRouter} from 'next/router';
import {useMutation} from 'react-query';
import {GameWithTeams} from 'types';
import {Card, Button, RadioButton, TextField} from 'components';

import styles from './CloseGameCard.module.scss';

interface Props {
  game: GameWithTeams;
}

export function CloseGameCard({game}: Props) {
  const router = useRouter();
  const [winner, setWinner] = useState<number>(game.winnerId);
  const [homeScore, setHomeScore] = useState(
    game.homeScore ? String(game.homeScore) : ''
  );
  const [awayScore, setAwayScore] = useState(
    game.awayScore ? String(game.awayScore) : ''
  );
  const {id, awayId, homeId, home, away} = game;

  const [closeGame, {isLoading: closeLoading}] = useMutation(async () => {
    const res = await fetch(`/api/closeGame`, {
      method: 'POST',
      body: JSON.stringify({
        gameId: game.id,
        winnerId: winner,
        homeScore,
        awayScore,
      }),
    });
    const data = await res.json();
    if (data.success) {
      router.push('/admin');
    } else {
      console.error('error closing game');
    }
    return data;
  });

  function handleCloseGame() {
    closeGame();
  }

  return (
    <Card>
      <h3>Close game</h3>
      <div className={styles.ScoreInputs}>
        <TextField
          value={awayScore}
          onChange={setAwayScore}
          label={`${away.nickName} score`}
        />
        <TextField
          value={homeScore}
          onChange={setHomeScore}
          label={`${home.nickName} score`}
        />
      </div>
      <div className={styles.WinnerSelect}>
        <div className={styles.WinnerRadio}>
          <RadioButton
            id={`away-${id}`}
            name={`winner-${id}`}
            label={away.nickName}
            value={awayId}
            checked={winner === awayId}
            onChange={() => setWinner(awayId)}
            disabled={false}
            loading={false}
          />
        </div>
        <div className={styles.WinnerRadio}>
          <RadioButton
            id={`home-${id}`}
            name={`winner-${id}`}
            label={home.nickName}
            value={homeId}
            checked={winner === homeId}
            onChange={() => setWinner(homeId)}
            disabled={false}
            loading={false}
            row
          />
        </div>
        <div className={styles.Button}>
          <Button
            primary
            row
            disabled={closeLoading || !winner}
            onClick={handleCloseGame}
          >
            Close game
          </Button>
        </div>
      </div>
    </Card>
  );
}
