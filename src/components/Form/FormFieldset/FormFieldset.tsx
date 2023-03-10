import React, { FieldsetHTMLAttributes, PropsWithChildren } from 'react';
import classNames from 'classnames';

import './FormFieldset.css';

interface FormFieldsetProps {
  title?: string;
  subtitle?: React.ReactNode;
}

export const FormFieldset = ({
  children,
  title,
  subtitle,
  ...fieldsetAttrs
}: PropsWithChildren<FormFieldsetProps> &
FieldsetHTMLAttributes<HTMLFieldSetElement>) => (
  <fieldset
    {...fieldsetAttrs}
    className={classNames('FormFieldset', fieldsetAttrs.className)}
  >
    {title && <legend className="FormFieldset__legend">{title}</legend>}
    {subtitle && (
      <span className="FormFieldset__legend__subtitle">{subtitle}</span>
    )}
    {children}
  </fieldset>
);
