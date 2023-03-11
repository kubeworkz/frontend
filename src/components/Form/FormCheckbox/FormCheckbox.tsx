import React, {
  ForwardedRef, forwardRef, InputHTMLAttributes, PropsWithChildren,
} from 'react';
import classNames from 'classnames';

import { SvgIcon } from '../../../components/SvgIcon/SvgIcon';

import styles from './FormCheckbox.module.css';

interface FormCheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  circle?: React.ReactNode;
}

export const FormCheckbox = forwardRef(({
  circle, children, ...inputProps
}: PropsWithChildren<FormCheckboxProps>, ref: ForwardedRef<HTMLInputElement>) => (
  <div
    className={classNames(inputProps.className, styles.root, {
      [styles.root_disabled]: inputProps.disabled,
      [styles.root_checked]: inputProps.checked,
      [styles.root_custom]: !!circle,
    })}
  >
    <input
      {...inputProps}
      className={styles.input}
      type="checkbox"
      ref={ref}
    />
    <label
      htmlFor={inputProps.id}
      className={styles.circleContainer}
    >
      {circle
          || (
          <div className={styles.circle}>
            <SvgIcon name="check_12" className={styles.check_icon} />
          </div>
          )}
    </label>
    {
      children
      && (
      <label
        htmlFor={inputProps.id}
        className={styles.label}
      >
        {children}
      </label>
      )
    }
  </div>
));

FormCheckbox.displayName = 'FormCheckbox';
FormCheckbox.defaultProps = {
  circle: null,
};
