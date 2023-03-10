import React, { HTMLAttributes, PropsWithChildren } from 'react';
import { IconName, SvgIcon } from '#shared/components/SvgIcon/SvgIcon';

import classNames from 'classnames';
import styles from './BranchViewBadge.module.css';

interface BranchViewBadgeProps
  extends HTMLAttributes<HTMLDivElement> {
  title: string;
  iconName?: IconName;
}

export const BranchViewBadge = ({
  className, title, iconName, children, ...props
}: PropsWithChildren<BranchViewBadgeProps>) => (
  <div className={classNames(styles.root, className)} {...props}>
    <div className={styles.header}>
      {iconName && <SvgIcon name={iconName} className={styles.headerIcon} />}
      <div className={styles.headerTitle}>
        {title}
      </div>
    </div>
    {children}
  </div>
);

export const BranchViewBadgeTable = ({
  className,
  children,
  ...props
}: PropsWithChildren<HTMLAttributes<HTMLDivElement>>) => (
  <table className={classNames(styles.table, className)} {...props}>
    <tbody>
      {children}
    </tbody>
  </table>
);

export const BranchViewBadgeBody = ({
  className,
  children,
  ...props
}: PropsWithChildren<HTMLAttributes<HTMLDivElement>>) => (
  <div className={classNames(styles.body, className)} {...props}>
    {children}
  </div>
);
