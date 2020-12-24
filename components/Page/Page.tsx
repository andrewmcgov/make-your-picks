import React from 'react';

import styles from './Page.module.scss';
interface Props {
  title?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}

export function Page({title, action, children}: Props) {
  const titleMarkup = title ? <h1>{title}</h1> : null;
  return (
    <>
      <div className={styles.Header}>
        {titleMarkup}
        {action ? action : null}
      </div>
      <main>{children}</main>
    </>
  );
}
