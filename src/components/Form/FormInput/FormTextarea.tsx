import React, {
  ForwardedRef, forwardRef, TextareaHTMLAttributes,
} from 'react';
import classNames from 'classnames';

import { SvgIcon } from '../../../components/SvgIcon/SvgIcon';

import { useFormFieldContext } from '../../../components/Form/FormField/formFieldContext';
import { SizeProps } from '../../../types/Props';
import styles from './FormInput.module.css';

interface FormTextareaProps extends SizeProps {
  onClear?(): void;
}

export const FormTextarea = forwardRef((
  {
    onClear, className, size = 'm', ...rest
  }: FormTextareaProps & TextareaHTMLAttributes<HTMLTextAreaElement>,
  ref: ForwardedRef<HTMLTextAreaElement>,
) => {
  const { id, invalid } = useFormFieldContext();

  let action: React.ReactNode;

  if (onClear) {
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

  return (
    <div className={classNames(className, styles.root, {
      [`${styles.disabled}`]: rest.disabled,
    })}
    >
      <textarea
        id={id}
        {...rest}
        ref={ref}
        className={classNames(styles.field, styles[`field_${size}`], {
          [`${styles.field_invalid}`]: invalid,
        })}
      />
      {action}
    </div>
  );
});

FormTextarea.displayName = 'FormTextarea';
FormTextarea.defaultProps = {
  onClear: undefined,
};
