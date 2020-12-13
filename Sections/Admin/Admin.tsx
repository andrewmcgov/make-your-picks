import React from 'react';

import {Page, useCurrentUser} from '../../components';
import {GameForm} from './components';

export function Admin() {
  const currentUser = useCurrentUser();

  if (!currentUser) {
    return null;
  }

  return (
    <Page title="Admin">
      <GameForm />
    </Page>
  );
}
