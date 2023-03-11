import React, { PropsWithChildren } from 'react';
import { toast } from 'react-toastify';

import { ToastContainer } from '../../components/Toast/ToastContainer';
import { ToastError } from '../../components/Toast/Toast';

import { FREE_TIER_LIMITS } from '../../config/config';
import logoDesktop from '/images/logo.svg';
import logoMobile from '/images/logo_mobile.svg';
import styles from './AuthLayout.module.css';

interface AuthProps {
  error?: string;
}

export const AuthLayout = ({ error, children }: PropsWithChildren<AuthProps>) => {
  React.useEffect(() => {
    if (error) {
      toast(<ToastError body={error} />);
    }
  }, []);

  return (
    <div className={styles.container}>
      <ToastContainer />
      <div className={styles.info}>
        <div className={styles.infoInner}>
          <div className={styles.logoDesktop}>
            <img src={logoDesktop} alt="Neon logo" />
          </div>
          <div className={styles.header}>
            Neon Technical Preview
          </div>
          <hr />
          <div className={styles.freeTier}>
            Free Tier includes:
            <ul>
              {FREE_TIER_LIMITS.map((limit) => (
                <li key={limit}>{limit}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className={styles.form}>
        <div className={styles.logoMobile}>
          <img src={logoMobile} alt="Neon logo" />
        </div>
        <div className={styles.form_inner}>
          {children}
        </div>
      </div>
    </div>
  );
};
