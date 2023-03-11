import React from 'react';

import { ErrorProps, Error } from '../../components/Error/Error';

import styles from './PageError.module.css';

export const PageError = (props: ErrorProps) => (
  <div className={styles.root}>
    <Error {...props} />
  </div>
);
