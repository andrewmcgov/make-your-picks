import React from 'react';

import styles from './Footer.module.scss';

export function Footer() {
  return (
    <div className={styles.Footer}>
      <p className={styles.Tagline}>
        Made with ☕️ by{' '}
        <a
          href="https://twitter.com/andrew_mcgov"
          target="_blank"
          rel="noopener"
        >
          Andrew McGoveran
        </a>
        . View source code on{' '}
        <a
          href="https://github.com/andrewmcgov/make-your-picks"
          target="_blank"
          rel="noopener"
        >
          Github
        </a>
        .
      </p>
    </div>
  );
}
