import React, {
  ForwardedRef, forwardRef, InputHTMLAttributes,
} from 'react';
import classNames from 'classnames';

import styles from './FormRadio.module.css';

interface FormRadioProps extends InputHTMLAttributes<HTMLInputElement> {
  circle?: React.ReactNode;
  children?: React.ReactNode;
}

export const FormRadio = forwardRef(({
  circle, children, ...inputProps
}: FormRadioProps, ref: ForwardedRef<HTMLInputElement>) => {
  const id = inputProps.id ? inputProps.id : `${inputProps.name}_${inputProps.value}`;

  return (
    <div
      className={classNames(inputProps.className, styles.root, {
        [styles.root_disabled]: inputProps.disabled,
        [styles.root_checked]: inputProps.checked,
        [styles.root_custom]: !!circle,
      })}
    >
      <div className={styles.inner}>
        <input
          {...inputProps}
          className={styles.input}
          type="radio"
          id={id}
          ref={ref}
        />
        <label
          htmlFor={id}
          className={styles.circleContainer}
        >
          {circle
            || (
            <div className={classNames(styles.circle, {
              [styles.circle_checked]: inputProps.checked,
            })}
            />
            )}
        </label>
        {children
          && (
          <label
            htmlFor={id}
            className={styles.label}
          >
            {children}
          </label>
          )}
      </div>
    </div>
  );
});

FormRadio.displayName = 'FormRadio';
FormRadio.defaultProps = {
  circle: null,
  children: null,
};
