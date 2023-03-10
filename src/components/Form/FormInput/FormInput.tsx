import React, {
  ForwardedRef, forwardRef, InputHTMLAttributes, useState,
} from 'react';
import classNames from 'classnames';

import { SvgIcon } from '#shared/components/SvgIcon/SvgIcon';

import { useFormFieldContext } from '#shared/components/Form/FormField/formFieldContext';
import { SizeProps } from '#shared/types/Props';
import styles from './FormInput.module.css';

export interface FormInputProps extends SizeProps, Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  onClear?(): void;
}

export const FormInput = forwardRef(({
  onClear, type = 'text', className, size = 'm', ...inputAttrs
}: FormInputProps, ref: ForwardedRef<HTMLInputElement>) => {
  const { id, invalid } = useFormFieldContext();

  const [isVisible, setIsVisible] = useState(false);

  let action: React.ReactNode;

  if (type === 'password') {
    action = (
      <button
        type="button"
        className={classNames(styles.action, styles.eye)}
        onClick={() => setIsVisible(!isVisible)}
      >
        <SvgIcon name={isVisible ? 'eye-hide_24' : 'eye_24'} />
      </button>
    );
  } else if (onClear) {
    action = (
      <button
        type="button"
        className={classNames(styles.action, styles.clear)}
        onClick={onClear}
      >
        <SvgIcon name="clear-24" />
      </button>
    );
  }

  const getPasswordInputType = () => (isVisible ? 'text' : 'password');

  return (
    <div className={classNames(
      className,
      styles.root,
      {
        [`${styles.disabled}`]: inputAttrs.disabled,
      },
    )}
    >
      <input
        id={id}
        {...inputAttrs}
        type={type === 'password'
          ? getPasswordInputType()
          : type}
        ref={ref}
        className={classNames(styles.field,
          styles[`field_${size}`],
          {
            [`${styles.field_invalid}`]: invalid,
          })}
      />
      {action}
    </div>
  );
});

FormInput.displayName = 'FormInput';
FormInput.defaultProps = {
  onClear: undefined,
};
