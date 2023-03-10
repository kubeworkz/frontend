import React from 'react';
import styles from './ClientLogo.module.css';

export const ClientLogo = ({ logo }: { logo?: string }) => {
  if (!logo) {
    return null;
  }

  return (
    <img
      className={styles.logo}
      src={logo}
      alt="Client logo"
    />
  );
};
