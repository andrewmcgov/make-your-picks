import '../styles/globals.scss';
import '../styles/normalize.css';
import type {AppProps} from 'next/app';
import {ReactQueryDevtools} from 'react-query-devtools';

import {CurrentUserContextProvider, Layout} from '../components';

function MyApp({Component, pageProps}: AppProps) {
  return (
    <>
      <ReactQueryDevtools />
      <CurrentUserContextProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </CurrentUserContextProvider>
    </>
  );
}

export default MyApp;
