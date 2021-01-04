import React from 'react';
import {classNames} from 'utilities/classNames';
import styles from './Banner.module.scss';

export enum BannerStatus {
  Info,
  Error,
  Success,
}

interface Props {
  title?: string;
  children?: React.ReactNode;
  status: BannerStatus;
}

export function Banner({title, children, status}: Props) {
  const classes = classNames(
    styles.Banner,
    status === BannerStatus.Error && styles.Error,
    status === BannerStatus.Info && styles.Info,
    status === BannerStatus.Success && styles.Success
  );

  return (
    <div className={classes}>
      {title && <h3>{title}</h3>}
      {children}
    </div>
  );
}
