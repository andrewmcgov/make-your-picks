import '../styles/globals.scss';
import '../styles/normalize.css';
import type {AppProps} from 'next/app';
import Head from 'next/head';
import {QueryCache, ReactQueryCacheProvider} from 'react-query';
import {ReactQueryDevtools} from 'react-query-devtools';
import {CurrentUserContextProvider, Layout} from 'components';

const queryCache = new QueryCache();

function MyApp({Component, pageProps}: AppProps) {
  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="manifest" href="/site.webmanifest" />
      </Head>
      <ReactQueryCacheProvider queryCache={queryCache}>
        <ReactQueryDevtools />
        <CurrentUserContextProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </CurrentUserContextProvider>
      </ReactQueryCacheProvider>
    </>
  );
}

export default MyApp;
