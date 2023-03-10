import React, { HTMLAttributes } from 'react';
import Datetime, { DatetimepickerProps } from 'react-datetime';

import 'react-datetime/css/react-datetime.css';
import { FormInput } from '#shared/components/Form/FormInput/FormInput';
import './FormDateTime.module.css';

interface FormDateTimeProps
  extends DatetimepickerProps {}

const renderFormDateTimeInput = ({
  className,
  ...props
}: HTMLAttributes<HTMLInputElement>) => (
  <FormInput
    {...props}
  />
);

export const FormDateTime = (props: FormDateTimeProps) => (
  <Datetime
    renderInput={renderFormDateTimeInput}
    {...props}
  />
);
