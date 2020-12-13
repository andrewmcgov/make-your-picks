import React from 'react';

import styles from './TextField.module.scss';

interface Props {
  value: string;
  onChange: (event: string) => void;
  label: string;
  type?: string;
}

export function TextField({value, onChange, label, type}: Props) {
  return (
    <div className={styles.TextField}>
      <label className={styles.Label}>{label}</label>
      <input
        className={styles.Input}
        type={type || 'text'}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}
