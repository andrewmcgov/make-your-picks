import React, {createContext, useContext} from 'react';
import {useQuery} from 'react-query';
import {ClientUserResponse, ClientUser} from 'types';
import {customFetch} from 'utilities/api';

interface Props {
  children: JSX.Element;
}

export const CurrentUserContext = createContext<ClientUser>(null);

export function useCurrentUser() {
  return useContext(CurrentUserContext);
}

export function CurrentUserContextProvider({children}: Props) {
  const {data} = useQuery<ClientUserResponse>('currentUser', () =>
    customFetch({url: `/api/currentUser`})
  );

  return (
    <CurrentUserContext.Provider value={data?.currentUser || null}>
      {children}
    </CurrentUserContext.Provider>
  );
}
