import React from 'react';

import { Skeleton } from '#shared/components/Skeleton/Skeleton';

import styles from './EndpointsListItem.module.css';

export const EndpointsListItemPlaceholder = () => (
  <div className={styles.root}>
    <div>
      <Skeleton height={20} width={200} />
      <div style={{ height: 10 }} />
      <Skeleton height={20} width={240} />
    </div>
  </div>
);
