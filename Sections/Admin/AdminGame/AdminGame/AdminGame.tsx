import React, {useState} from 'react';
import {useRouter} from 'next/router';
import Head from 'next/head';
import {useQuery, useMutation} from 'react-query';
import {Page, Card, Button} from 'components';
import {GameResponse} from 'types';
import {GameForm} from '../../components';

export function AdminGame() {
  const router = useRouter();
  const id = router.query.id;
  const [showDeleteButton, setShowDeleteButton] = useState(false);

  const {data} = useQuery<GameResponse>(['game', id], async () => {
    const res = await fetch(`/api/game`, {
      method: 'POST',
      body: JSON.stringify({id: id}),
    });
    const data = await res.json();
    return data;
  });

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

  function handleDeleteGame() {
    deleteGame();
  }

  const game = data?.game;

  const title = data?.game
    ? `${game.away.nickName} @ ${game.home.nickName}`
    : 'Loading game..';

  return (
    <Page title={title}>
      <Head>
        <title>Admin Game | MAKE YOUR PICKS!</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {game && <GameForm game={game} />}
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
