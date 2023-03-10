import React, { HTMLAttributes } from 'react';

import classNames from 'classnames';
import styles from './Widget.module.css';

interface WidgetBodyProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const WidgetBody = ({ children, className, ...props }: WidgetBodyProps) => (
  <div
    className={classNames(styles.body, className, {
      [styles.body_withCols]: Array.isArray(children),
    })}
    {...props}
  >
    {children}
  </div>
);
