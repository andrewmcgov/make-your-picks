import React, {useState} from 'react';
import {useRouter} from 'next/router';
import {useMutation} from 'react-query';
import {Card, Button} from 'components';

interface Props {
  id: number;
}

export function DeleteGameCard({id}: Props) {
  const router = useRouter();
  const [showDeleteButton, setShowDeleteButton] = useState(false);

  const [deleteGame, {isLoading: deleteLoading}] = useMutation(async () => {
    const res = await fetch(`/api/deleteGame`, {
      method: 'POST',
      body: JSON.stringify({id}),
    });
    const data = await res.json();
    if (data.success) {
      router.push('/admin');
    } else {
      console.error('error deleting game');
    }
    return data;
  });

  function handleDeleteGame() {
    deleteGame();
  }

  return (
    <Card>
      <h3>Delete game</h3>

      <Button
        onClick={() => setShowDeleteButton(!showDeleteButton)}
        disabled={deleteLoading}
        destructive={!showDeleteButton}
        secondary={showDeleteButton}
      >
        {showDeleteButton ? 'Cancel' : 'Delete game'}
      </Button>
      {showDeleteButton && (
        <Button
          row
          destructive
          disabled={deleteLoading}
          onClick={handleDeleteGame}
        >
          Delete!
        </Button>
      )}
    </Card>
  );
}
