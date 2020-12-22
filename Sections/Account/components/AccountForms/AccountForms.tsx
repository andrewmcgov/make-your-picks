import React from 'react';
import {useMutation, useQueryCache} from 'react-query';
import {TextField, Button, Card} from 'components';
import styles from './AccountForms.module.scss';

export function AccountForms() {
  const [creating, setCreating] = React.useState(false);
  const [email, setEmail] = React.useState('');
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [repeatPassword, setRepeatPassword] = React.useState('');
  const [activationKey, setActivationKey] = React.useState('');
  const [errorMessage, setErrorMessage] = React.useState('');

  const cache = useQueryCache();

  const [login, {isLoading: loginLoading}] = useMutation(
    async () => {
      const res = await fetch(`/api/login`, {
        method: 'POST',
        body: JSON.stringify({email, password}),
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

  const [creatUser, {isLoading: creatUserLoading}] = useMutation(
    async () => {
      const res = await fetch(`/api/createUser`, {
        method: 'POST',
        body: JSON.stringify({
          email,
          username,
          password,
          repeatPassword,
          activationKey,
        }),
      });
      const data = await res.json();

      if (data.message) {
        setErrorMessage(data.message);
      } else {
        setErrorMessage('');
      }

      return data;
    },
    {
      onSuccess: () => {
        cache.invalidateQueries('currentUser');
      },
    }
  );

  function handleSubmit() {
    creating ? creatUser() : login();
  }

  return (
    <Card>
      {creating ? (
        <>
          <h2>Create Account</h2>
          <p>
            I have not made the password reset flow yet, so please choose a
            unique password that you will remember.
          </p>
          {errorMessage && <p className={styles.Error}>{errorMessage}</p>}
          <TextField value={email} label="Email" onChange={setEmail} />
          <TextField value={username} label="Username" onChange={setUsername} />
          <TextField
            value={password}
            label="Password"
            onChange={setPassword}
            type="password"
          />
          <TextField
            value={repeatPassword}
            label="Repeat password"
            onChange={setRepeatPassword}
            type="password"
          />
          <TextField
            value={activationKey}
            label="Activation key"
            onChange={setActivationKey}
          />
        </>
      ) : (
        <>
          <h2>Login</h2>
          {errorMessage && <p className={styles.Error}>{errorMessage}</p>}
          <TextField value={email} label="Email" onChange={setEmail} />
          <TextField
            value={password}
            label="Password"
            onChange={setPassword}
            type="password"
          />
        </>
      )}
      <div className={styles.ButtonWrapper}>
        <Button
          primary
          row
          onClick={handleSubmit}
          disabled={loginLoading || creatUserLoading}
        >
          {creating ? 'Create account' : 'Login'}
        </Button>
      </div>
      {creating ? (
        <p className={styles.Message}>
          Already have an account?{' '}
          <Button plain onClick={() => setCreating(!creating)}>
            Login!
          </Button>
        </p>
      ) : (
        <p className={styles.Message}>
          {"Don't have an account? "}
          <Button plain onClick={() => setCreating(!creating)}>
            Create one!
          </Button>
        </p>
      )}
    </Card>
  );
}
