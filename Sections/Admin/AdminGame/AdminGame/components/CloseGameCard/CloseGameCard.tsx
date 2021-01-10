import React, {useState} from 'react';
import {useRouter} from 'next/router';
import {useMutation} from 'react-query';
import {GameWithTeamsAndPicksAndUserPick} from 'types';
import {Card, Button, RadioButton, TextField} from 'components';
import {customFetch} from 'utilities/api';

import styles from './CloseGameCard.module.scss';

interface Props {
  game: GameWithTeamsAndPicksAndUserPick;
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
  const [errorMessage, setErrorMessage] = useState('');
  const {id, awayId, homeId, home, away} = game;

  const [closeGame, {isLoading: closeLoading}] = useMutation(
    () =>
      customFetch({
        url: `/api/closeGame`,
        body: JSON.stringify({
          gameId: game.id,
          winnerId: winner,
          homeScore,
          awayScore,
        }),
      }),
    {
      onSuccess: (data) => {
        if (data.success) {
          router.push('/admin');
        } else {
          console.error('error closing game');
          setErrorMessage(data.message);
        }
      },
    }
  );

  function handleCloseGame() {
    setErrorMessage('');
    closeGame();
  }

  return (
    <Card>
      <h3>Close game</h3>
      {errorMessage && <p className={styles.ErrorMessage}>{errorMessage}</p>}
      <div className={styles.ScoreInputs}>
        <TextField
          type="tel"
          value={awayScore}
          onChange={setAwayScore}
          label={`${away.nickName} score`}
        />
        <TextField
          type="tel"
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
