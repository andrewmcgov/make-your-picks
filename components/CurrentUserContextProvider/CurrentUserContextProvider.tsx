import React, {createContext, useContext} from 'react';
import {useQuery} from 'react-query';

import {CacheKey, ClientUserResponse} from '../../types';
import {query} from '../../utilities/api';

interface Props {
  children: JSX.Element;
}

export const CurrentUserContext = createContext(null);

export function useCurrentUser() {
  return useContext(CurrentUserContext);
}

export function CurrentUserContextProvider({children}: Props) {
  const {data} = useQuery<ClientUserResponse>(
    CacheKey.CurrentUser,
    async () => {
      const res = await fetch(`http://localhost:3000/api/currentUser`);
      const data = await res.json();
      return data;
    }
  );

  return (
    <CurrentUserContext.Provider value={data?.currentUser || null}>
      {children}
    </CurrentUserContext.Provider>
  );
}
