import React, {useState} from 'react';
import {useMutation} from 'react-query';
import {Card, Button} from 'components';

export function UpdateLeaderBoardCard() {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  const [closeGame, {isLoading}] = useMutation(async () => {
    const res = await fetch(`/api/updateLeaderboard`, {
      method: 'POST',
    });

    const data = await res.json();
    if (data.success) {
      setSuccess(true);
    } else {
      setError(true);
    }
    return data;
  });

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
