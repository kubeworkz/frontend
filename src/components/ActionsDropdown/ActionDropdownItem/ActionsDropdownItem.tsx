import React from 'react';

import { AnyLink, AnyLinkConfig } from '../../AnyLink/AnyLink';
import { AppearanceProps, AppearanceStatus } from '#shared/types/Props';
import classNames from 'classnames';
import { IconName, SvgIcon } from '../..//SvgIcon/SvgIcon';
import styles from './ActionsDropdownItem.module.css';

interface ActionsDropdownItemProps extends
  AppearanceProps<AppearanceStatus> {
  iconName?: IconName;
}

export const ActionsDropdownItem = ({
  appearance = 'default',
  children,
  iconName,
  ...props
}: AnyLinkConfig & ActionsDropdownItemProps) => (
  <div className={styles.item}>
    <AnyLink
      {...props}
      disabledClassName={styles.disabled}
      className={classNames(styles.inner, styles[appearance], props.className)}
    >
      {iconName
        && <SvgIcon name={iconName} className={styles.icon} />}
      {children}
    </AnyLink>
  </div>
);
