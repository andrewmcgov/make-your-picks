import React from 'react';
import {useRouter} from 'next/router';
import Head from 'next/head';
import {useQuery} from 'react-query';
import {Page, Card, SkeletonCard} from 'components';
import {GameResponse} from 'types';
import {GameForm} from '../../components';
import {CloseGameCard} from './components';
import {DeleteGameCard} from './components/DeleteGameCard';

export function AdminGame() {
  const router = useRouter();
  const id = router.query.id;

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

  const game = data?.game;

  const loadingMarkup = gameLoading ? (
    <>
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
    </>
  ) : null;

  const notFoundMarkup =
    !game && !gameLoading ? (
      <Card>
        <p>Could not find game with id: {id}</p>
      </Card>
    ) : null;

  const title = game
    ? `${game.away.nickName} @ ${game.home.nickName}`
    : 'Loading game..';

  return (
    <Page title={title}>
      <Head>
        <title>Admin Game | MAKE YOUR PICKS!</title>
      </Head>
      {loadingMarkup}
      {notFoundMarkup}
      {game && (
        <>
          <GameForm game={game} />
          <CloseGameCard game={game} />
          <DeleteGameCard id={game.id} />
        </>
      )}
    </Page>
  );
}
