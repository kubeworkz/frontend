import React, { PropsWithChildren } from 'react';

import styles from './MenuGroup.module.css';

export const MenuGroup = ({ children }: PropsWithChildren<{}>) => (
  <div className={styles.root}>
    {children}
  </div>
);
