import React from 'react';
import styles from './Spinner.module.scss';

export function Spinner() {
  return (
    <div className={styles.Spinner}>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
}
