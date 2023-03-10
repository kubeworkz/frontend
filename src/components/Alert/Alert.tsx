import React, { HTMLAttributes } from 'react';
import { AppearanceProps, AppearanceStatus } from '#shared/types/Props';

import classNames from 'classnames';
import { SvgIcon, IconName } from '#shared/components/SvgIcon/SvgIcon';
import styles from './Alert.module.css';

export interface AlertProps extends
  AppearanceProps<AppearanceStatus>, HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  iconName?: IconName;
  onClose?: () => void;
}

export const Alert = ({
  children, appearance = 'default', onClose, className, iconName,
}: AlertProps) => (
  <div className={classNames(className, styles.root, styles[`${appearance}`])} role="alert">
    {iconName && (
      <div className={styles.icon}>
        <SvgIcon size={20} name={iconName} />
      </div>
    )}
    <div className={styles.body}>
      {children}
    </div>
    {onClose && (
      <button
        className={styles.close}
        type="button"
      >
        <SvgIcon name="clear-24" />
      </button>
    )}
  </div>
);
