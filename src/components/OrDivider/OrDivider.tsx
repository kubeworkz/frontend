import classNames from 'classnames';
import React from 'react';
import styles from './OrDivider.module.css';

export const OrDivider = (props: React.HTMLProps<HTMLDivElement>) => (
  <div {...props} className={classNames(styles.root, props.className)}>
    OR
  </div>
);
