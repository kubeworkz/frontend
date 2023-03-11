import React, { HTMLAttributes, PropsWithChildren } from 'react';
import classNames from 'classnames';

import { FormFieldContext } from '../../../components/Form/FormField/formFieldContext';
import { FormLabel } from '../../../components/Form/FormLabel/FormLabel';

import styles from './FormField.module.css';

interface FormFieldProps extends HTMLAttributes<HTMLElement>{
  id?: string; // this prop will bond label and input elements
  label?: React.ReactNode;
  labelClassName?: string;
  error?: boolean | string;
  children: React.ReactNode;
  inline?: boolean;
}

export const FormField = ({
  id, error, label, children, labelClassName, inline, ...props
}: PropsWithChildren<FormFieldProps>) => (
  <FormFieldContext.Provider value={{
    id, invalid: !!error, error,
  }}
  >
    <div
      {...props}
      className={classNames(props.className, styles.root, {
        [styles.root_flex]: inline,
      })}
    >
      {label
        && (
        <FormLabel
          htmlFor={id}
          className={labelClassName}
        >
          {label}
        </FormLabel>
        )}
      <div className={styles.input_container}>
        {children}
        <div className={styles.error}>
          { typeof error === 'string'
            && error }
        </div>
      </div>
    </div>
  </FormFieldContext.Provider>
);
