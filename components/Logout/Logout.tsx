import React from 'react';
import {useMutation, useQueryCache} from 'react-query';

import {Button} from '../Button';

export function Logout() {
  const cache = useQueryCache();
  const [logout, {isLoading}] = useMutation(
    async () => {
      const res = await fetch(`/api/logout`, {
        method: 'POST',
      });
      const data = await res.json();
      return data;
    },
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
