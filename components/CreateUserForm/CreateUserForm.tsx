import React, {useState} from 'react';

export function CreateUserForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');

  async function handleSubmit() {
    const result = await fetch('/api/createUser', {
      method: 'POST',
      body: JSON.stringify({password, email, repeatPassword}),
    });
  }

  return (
    <div>
      <form>
        <label>
          Email
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          ></input>
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></input>
        </label>
        <label>
          Password
          <input
            type="repeatPassword"
            value={repeatPassword}
            onChange={(e) => setRepeatPassword(e.target.value)}
          ></input>
        </label>
      </form>
      <button onClick={handleSubmit}>Create user!</button>
    </div>
  );
}
