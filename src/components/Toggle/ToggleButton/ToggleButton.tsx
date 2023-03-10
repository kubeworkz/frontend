import React, { HTMLAttributes, PropsWithChildren } from 'react';
import classNames from 'classnames';

import styles from './ToggleButton.module.css';

interface ToggleButtonProps extends HTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  disabled?: boolean;
}

export const ToggleButton = (
  {
    children, active, disabled, ...props
  }:
  PropsWithChildren<ToggleButtonProps>,
) => (
  <button
    type="button"
    disabled={disabled}
    {...props}
    className={classNames(props.className, styles.button, {
      [`${styles.active}`]: active,
      [`${styles.disabled}`]: disabled,
    })}
  >
    {children}
  </button>
);
