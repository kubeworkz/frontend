import React, { HTMLAttributes, PropsWithChildren } from 'react';
import classNames from 'classnames';

import styles from './FormRow.module.css';

interface FormRowProps extends HTMLAttributes<HTMLDivElement> {
  flex?: boolean
}

export const FormRow = ({ children, flex, ...props }: PropsWithChildren<FormRowProps>) => (
  <div
    {...props}
    className={classNames(props.className, styles.root, {
      [styles.root_flex]: flex,
    })}
  >
    {children}
  </div>
);
