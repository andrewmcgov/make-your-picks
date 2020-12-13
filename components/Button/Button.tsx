import React from 'react';

import {classNames} from '../../utilities/classNames';
import styles from './Button.module.scss';

interface Props {
  children?: JSX.Element | string;
  primary?: boolean;
  secondary?: boolean;
  onClick?: () => void;
}

export function Button({children, onClick, primary, secondary}: Props) {
  const classes = classNames(
    styles.Button,
    primary && styles.Primary,
    secondary && styles.Secondary
  );
  return (
    <button className={classes} onClick={onClick}>
      {children}
    </button>
  );
}
