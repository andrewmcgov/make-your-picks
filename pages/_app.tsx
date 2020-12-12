import '../styles/globals.css';
import type {AppProps} from 'next/app';
import {ReactQueryDevtools} from 'react-query-devtools';

import {CurrentUserContextProvider} from '../components';

function MyApp({Component, pageProps}: AppProps) {
  return (
    <>
      <ReactQueryDevtools />
      <CurrentUserContextProvider>
        <Component {...pageProps} />
      </CurrentUserContextProvider>
    </>
  );
}

export default MyApp;
