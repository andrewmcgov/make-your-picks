import React, {useState} from 'react';
import {useMutation} from 'react-query';
import {Card, Button} from 'components';
import {customFetch} from 'utilities/api';

export function UpdateLeaderBoardCard() {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  const [closeGame, {isLoading}] = useMutation(
    () => customFetch({url: `/api/updateLeaderboard`}),
    {
      onSuccess: (data) => {
        if (data.success) {
          setSuccess(true);
        } else {
          setError(true);
        }
      },
    }
  );

  function handleUpdateLeaderboard() {
    setSuccess(false);
    setError(false);

    closeGame();
  }

  return (
    <Card>
      <h3>Update Leaderboard</h3>

      <Button onClick={handleUpdateLeaderboard} disabled={isLoading} primary>
        Update
      </Button>

      {success && <p>Leaderboard updated!</p>}
      {error && <p>Error updating leaderboard!</p>}
    </Card>
  );
}
