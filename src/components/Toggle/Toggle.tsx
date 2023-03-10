import React, { HTMLAttributes, PropsWithChildren } from 'react';
import classNames from 'classnames';

import styles from './Toggle.module.css';

interface ToggleProps extends HTMLAttributes<HTMLDivElement> {}

export const Toggle = ({ children, ...props }: PropsWithChildren<ToggleProps>) => (
  <div
    {...props}
    className={classNames(props.className, styles.root)}
  >
    {children}
  </div>
);
