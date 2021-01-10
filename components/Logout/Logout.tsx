import React from 'react';
import {useMutation, useQueryCache} from 'react-query';
import {Button} from '../Button';
import {customFetch} from 'utilities/api';

export function Logout() {
  const cache = useQueryCache();
  const [logout, {isLoading}] = useMutation(
    () => customFetch({url: '/api/logout'}),
    {
      onSuccess: () => {
        cache.invalidateQueries('currentUser');
      },
    }
  );

  function handleLogout() {
    logout();
  }

  return (
    <Button primary onClick={handleLogout} disabled={isLoading}>
      Logout
    </Button>
  );
}
