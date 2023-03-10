import React, { HTMLAttributes, PropsWithChildren } from 'react';
import classNames from 'classnames';

import styles from './Widget.module.css';

export const WidgetTable = ({
  children,
  className,
}: PropsWithChildren<HTMLAttributes<HTMLTableElement>>) => (
  <table className={classNames(styles.table, className)}>
    <tbody>
      {children}
    </tbody>
  </table>
);
