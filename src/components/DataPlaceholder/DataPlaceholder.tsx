import React from 'react';
import { ErrorData } from '../../components/Error/Error';
import { SvgIcon, IconName } from '../../components/SvgIcon/SvgIcon';

import styles from './DataPlaceholder.module.css';

export interface DataPlaceholderProps extends ErrorData {
  iconName?: IconName; // should be size 56
}

export const DataPlaceholder = ({
  iconName = 'not-found_56',
  title = "There's no data yet",
  subtitle,
  actions,
}: DataPlaceholderProps) => (
  <div className={styles.root}>
    <div className={styles.icon}>
      <SvgIcon name={iconName} />
    </div>
    <div className={styles.title}>
      {title}
    </div>
    {subtitle
      && (
      <div className={styles.subtitle}>
        {subtitle}
      </div>
      )}

    {actions
        && (
        <div className={styles.actions}>
          {actions}
        </div>
        )}

  </div>
);

export const DataPlaceholderBadge = (props: DataPlaceholderProps) => (
  <div className={styles.container}>
    <DataPlaceholder {...props} />
  </div>
);
