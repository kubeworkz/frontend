import React from 'react';

import { NavItemConfig } from '#shared/components/Layout/types';
import { AnyLink, AnyLinkConfig } from '#shared/components/AnyLink/AnyLink';

import { SvgIcon } from '#shared/components/SvgIcon/SvgIcon';
import styles from './MenuItem.module.css';

export const MenuItem = ({ iconName, children, ...props }: NavItemConfig) => (
  <AnyLink
    {...(props as AnyLinkConfig)}
    className={styles.root}
    activeClassName={styles.active}
    disabledClassName={styles.disabled}
  >
    {iconName && <SvgIcon className={styles.icon} name={iconName} size={16} />}
    <span className={styles.label}>
      {children}
    </span>
  </AnyLink>
);
