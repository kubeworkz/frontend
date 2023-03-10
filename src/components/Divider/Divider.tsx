import classNames from 'classnames';
import React from 'react';

import styles from './Divider.module.css';

export type DividerProps = {
  className?: string;
  width?: 'short' | 'full';
};
export const Divider = ({ className, width }: DividerProps) => (
  <div className={classNames(styles.root, className, {
    [styles.short]: width === 'short',
  })}
  />
);
