import React, {useEffect, useState} from 'react';
import {useRouter} from 'next/router';
import Head from 'next/head';
import {useQuery, useMutation} from 'react-query';
import {Page, Card, Button, RadioButton} from 'components';
import {GameResponse} from 'types';
import {GameForm} from '../../components';
import styles from './AdminGame.module.scss';

export function AdminGame() {
  const router = useRouter();
  const id = router.query.id;
  const [showDeleteButton, setShowDeleteButton] = useState(false);
  const [winner, setWinner] = useState<number>();

  const {data, isLoading: gameLoading} = useQuery<GameResponse>(
    ['game', id],
    async () => {
      const res = await fetch(`/api/game`, {
        method: 'POST',
        body: JSON.stringify({id: id}),
      });
      const data = await res.json();
      return data;
    }
  );

  const [deleteGame, {isLoading: deleteLoading}] = useMutation(async () => {
    const res = await fetch(`/api/deleteGame`, {
      method: 'POST',
      body: JSON.stringify({id}),
    });
    const data = await res.json();
    if (data.success) {
      router.push('/admin');
    } else {
      console.error('error deleting game');
    }
    return data;
  });

  const [closeGame, {isLoading: closeLoading}] = useMutation(async () => {
    const res = await fetch(`/api/closeGame`, {
      method: 'POST',
      body: JSON.stringify({gameId: game.id, winnerId: winner}),
    });
    const data = await res.json();
    if (data.success) {
      router.push('/admin');
    } else {
      console.error('error closing game');
    }
    return data;
  });

  function handleDeleteGame() {
    deleteGame();
  }

  function handleCloseGame() {
    closeGame();
  }

  const game = data?.game;

  useEffect(() => {
    if (game?.winnerId) {
      setWinner(game.winnerId);
    }
  }, [game]);

  if (!game) {
    return <p>Game not found!</p>;
  }

  const {home, away, homeId, awayId} = game;

  const title = data?.game
    ? `${game.away.nickName} @ ${game.home.nickName}`
    : 'Loading game..';

  return (
    <Page title={title}>
      <Head>
        <title>Admin Game | MAKE YOUR PICKS!</title>
      </Head>
      {game && <GameForm game={game} />}
      <Card>
        <h3>Close game</h3>
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
      <Card>
        <h3>Delete game</h3>

        <Button
          onClick={() => setShowDeleteButton(!showDeleteButton)}
          disabled={deleteLoading}
        >
          Delete game
        </Button>
        {showDeleteButton && (
          <Button
            primary
            row
            disabled={deleteLoading}
            onClick={handleDeleteGame}
          >
            Delete!
          </Button>
        )}
      </Card>
    </Page>
  );
}
