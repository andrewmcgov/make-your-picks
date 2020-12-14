import React from 'react';

import {classNames} from '../../utilities/classNames';
import styles from './Button.module.scss';

interface Props {
  children?: JSX.Element | string;
  primary?: boolean;
  secondary?: boolean;
  plain?: boolean;
  onClick?: (event?: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  row?: boolean;
  disabled?: boolean;
}

export function Button({
  children,
  onClick,
  primary,
  secondary,
  row,
  plain,
  disabled,
}: Props) {
  const classes = classNames(
    styles.Button,
    primary && styles.Primary,
    secondary && styles.Secondary,
    row && styles.Row,
    plain && styles.Plain,
    disabled && styles.Disabled
  );
  return (
    <button className={classes} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}
