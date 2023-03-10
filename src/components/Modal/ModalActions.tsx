import React, { HTMLAttributes, PropsWithChildren } from 'react';
import classNames from 'classnames';

import styles from './Modal.module.css';

interface ModalFooterProps extends HTMLAttributes<HTMLDivElement> {
  children: Array<React.ReactNode> | React.ReactNode;
}

export const ModalActions = ({ children, ...props }: PropsWithChildren<ModalFooterProps>) => (
  <div
    {...props}
    className={classNames(props.className, styles.actions)}
  >
    {children}
  </div>
);
