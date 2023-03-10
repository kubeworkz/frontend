import React from 'react';

import styles from './EmptySidebarLayout.module.css';

export type EmptySidebarLayoutProps = {
  icon: React.ReactNode;
  message: React.ReactNode;
};
export const EmptySidebarLayout = ({ icon, message }: EmptySidebarLayoutProps) => (
  <div className={styles.root}>
    {icon}
    <br />
    {message}
  </div>
);
