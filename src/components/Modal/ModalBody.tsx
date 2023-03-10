import React, { HTMLAttributes, PropsWithChildren } from 'react';
import classNames from 'classnames';

import styles from './Modal.module.css';

export interface ModalBodyProps extends HTMLAttributes<HTMLDivElement> {}

export const ModalBody = ({ children, className, ...props }: PropsWithChildren<ModalBodyProps>) => (
  <div
    {...props}
    className={classNames(styles.body, className)}
  >
    {children}
  </div>
);
