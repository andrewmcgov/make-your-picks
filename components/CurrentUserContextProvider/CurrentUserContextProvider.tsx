import React, {createContext, useContext} from 'react';
import {useQuery} from 'react-query';

import {ClientUserResponse, ClientUser} from '../../types';

interface Props {
  children: JSX.Element;
}

export const CurrentUserContext = createContext<ClientUser>(null);

export function useCurrentUser() {
  return useContext(CurrentUserContext);
}

export function CurrentUserContextProvider({children}: Props) {
  const {data} = useQuery<ClientUserResponse>('currentUser', async () => {
    const res = await fetch(`/api/currentUser`);
    const data = await res.json();
    return data;
  });

  return (
    <CurrentUserContext.Provider value={data?.currentUser || null}>
      {children}
    </CurrentUserContext.Provider>
  );
}
