import React, {useState} from 'react';
import {useMutation} from 'react-query';
import {Card, TextField, Button, Spinner} from 'components';
import {TieBreakerWithUser} from 'types';

import styles from './SuperBowlTieBreaker.module.scss';

interface Props {
  tieBreakers: TieBreakerWithUser[];
  userTieBreaker?: TieBreakerWithUser;
}

export function SuperBowlTieBreaker({tieBreakers, userTieBreaker}: Props) {
  const originalTotal =
    userTieBreaker?.value !== undefined ? String(userTieBreaker?.value) : '';
  const [total, setTotal] = useState(originalTotal);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(originalTotal !== '');

  const [saveTieBreaker, {isLoading}] = useMutation<
    any,
    unknown,
    {value: string}
  >(async (variables) => {
    try {
      const res = await fetch(`/api/createTieBreaker`, {
        method: 'POST',
        body: JSON.stringify({value: variables.value}),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.message || 'Error saving pick');
        setTotal(originalTotal);
        return;
      }

      setSaved(true);
      setError('');
      return data;
    } catch (err) {
      setError('Internal server error');
    }
  });

  function handleChange(total: string) {
    setTotal(total.replace(/\D/g, ''));
    setSaved(false);
  }

  function handleSaveTieBreaker() {
    setSaved(false);
    setError('');
    saveTieBreaker({value: total});
  }

  return (
    <Card flush>
      <div className={styles.TieBreaker}>
        <h3>Tiebreaker</h3>
        <p>
          Enter your guess for total number of points scored in the superbowl
          below 👇
        </p>

        <TextField
          value={total}
          onChange={handleChange}
          label="Total superbowl points"
        />

        <Button secondary disabled={isLoading} onClick={handleSaveTieBreaker}>
          {isLoading ? (
            <div className={styles.Spinner}>
              <Spinner />
            </div>
          ) : (
            'Save'
          )}
        </Button>
        {saved && <span className={styles.Success}>Tiebreaker saved.</span>}
        {error && <span className={styles.Error}>{error}</span>}
      </div>
    </Card>
  );
}
