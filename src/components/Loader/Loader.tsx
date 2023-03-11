import React from 'react';

import { SvgIcon } from '../../components/SvgIcon/SvgIcon';

import styles from './Loader.module.css';

export const Loader = () => (
  <div className={styles.root}>
    <SvgIcon name="spinner-24" />
  </div>
);

export const CenteredLoader = () => (
  <div className={styles.centeredContainer}>
    <Loader />
  </div>
);
