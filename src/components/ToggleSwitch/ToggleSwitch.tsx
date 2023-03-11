import classNames from 'classnames';
import React from 'react';

import { SizeProps } from '../../types/Props';
import styles from './ToggleSwitch.module.css';

export interface ToggleSwitchProps extends Omit<React.ComponentProps<'input'>, 'size'>,
  SizeProps {
  label?: React.ReactNode;
}

export const ToggleSwitch = React.forwardRef(
  (
    { label, size = 'm', ...inputProps }: ToggleSwitchProps,
    ref: React.Ref<HTMLInputElement>,
  ) => (
    // eslint-disable-next-line jsx-a11y/label-has-associated-control
    <label
      className={classNames(styles.root, styles[size], {
        disabled: inputProps.disabled,
      })}
    >
      {label && <span className={styles.label}>{label}</span>}
      <div className={styles.switchBox}>
        <input
          {...inputProps}
          ref={ref}
          type="checkbox"
          className={classNames(styles.input, inputProps.className)}
        />
        <div className={styles.switchBackground} />
        <div className={styles.slider} />
      </div>
    </label>
  ),
);

ToggleSwitch.displayName = 'ToggleSwitch';
