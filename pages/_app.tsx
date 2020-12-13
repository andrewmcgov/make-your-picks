import '../styles/globals.scss';
import '../styles/normalize.css';
import type {AppProps} from 'next/app';
import {
  useQuery,
  useMutation,
  useQueryCache,
  QueryCache,
  ReactQueryCacheProvider,
} from 'react-query';
import {ReactQueryDevtools} from 'react-query-devtools';

import {CurrentUserContextProvider, Layout} from '../components';

const queryCache = new QueryCache();

function MyApp({Component, pageProps}: AppProps) {
  return (
    <>
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
