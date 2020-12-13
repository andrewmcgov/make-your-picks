import React from 'react';
import {TextField, Button} from '../../../../components';

import styles from './Login.module.scss';

export function Login() {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  function handleLogin() {
    console.log('loggin in');
  }

  return (
    <div>
      <h2>Login</h2>
      <TextField value={email} label="Email" onChange={setEmail} />
      <TextField
        value={password}
        label="Password"
        onChange={setPassword}
        type="password"
      />

      <div className={styles.ButtonWrapper}>
        <Button primary onClick={handleLogin}>
          Login
        </Button>
      </div>
    </div>
  );
}
