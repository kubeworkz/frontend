import React, { HTMLAttributes, PropsWithChildren } from 'react';
import classNames from 'classnames';

import styles from './DataTableFilters.module.css';

export const DataTableFilters = ({
  children,
  className,
  ...props
}: PropsWithChildren<HTMLAttributes<HTMLDivElement>>) => (
  <div
    className={classNames(className, styles.root)}
    {...props}
  >
    {children}
  </div>
);
