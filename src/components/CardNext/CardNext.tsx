import classNames from 'classnames';
import React from 'react';
import { IconName, SvgIcon } from '../SvgIcon/SvgIcon';

import styles from './CardNext.module.css';

export type CardNextProps = {
  header: React.ReactNode;
  children: React.ReactNode;
  icon: IconName;
  appearance?: 'primary';
};

export const CardNext = ({
  header,
  children,
  icon,
  appearance,
}: CardNextProps) => (
  <div
    className={classNames(styles.root, {
      [styles.cardNextPrimary]: appearance === 'primary',
    })}
  >
    <div className={styles.cardNextHeader}>
      <SvgIcon className={styles.cardNextIcon} name={icon} size={20} />
      {header}
    </div>
    <div className={styles.cardNextBody}>{children}</div>
  </div>
);
