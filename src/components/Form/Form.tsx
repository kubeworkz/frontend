import React, { FormHTMLAttributes, PropsWithChildren } from 'react';
import classNames from 'classnames';

import './Form.css';

export interface FormProps extends FormHTMLAttributes<HTMLFormElement> {
  actions?: React.ReactNode;
}

export const Form = (
  {
    children,
    actions,
    ...formAttrs
  }: PropsWithChildren<FormProps>,
) => (
  <form
    {...formAttrs}
    className={classNames(formAttrs.className, 'Form')}
  >
    <div className="FormBody">
      {children}
    </div>
    {actions
      && (
      <div className="FormActions">
        {actions}
      </div>
      )}
  </form>
);
