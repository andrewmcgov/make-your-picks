import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

import {useCurrentUser} from '../../components';

import {Page} from '../../components';

export function Home() {
  const user = useCurrentUser();

  const loginLink = user ? null : (
    <p>
      To make your picks, sign in <Link href="/account">here.</Link>
    </p>
  );

  return (
    <>
      <Head>
        <title>MAKE YOUR PICKS!</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Page title={'Home'}>{loginLink}</Page>
    </>
  );
}
