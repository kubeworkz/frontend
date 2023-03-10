import React from 'react';
import { FormField } from '#shared/components/Form/FormField/FormField';
import { FormTextarea } from '#shared/components/Form/FormInput/FormTextarea';
import { useFormContext } from 'react-hook-form';
import {
  FeedbackFormData,
} from '#shared/utils/hubspot';
import { FormInput } from '#shared/components/Form/FormInput/FormInput';
import { EMAIL_VALIDATION_REGEX } from '#shared/utils/validation';

export const FeedbackFormFields = () => {
  const {
    register, formState,
  } = useFormContext<FeedbackFormData>();

  return (
    <>
      <FormField
        error={formState.errors.email?.message}
        label="Email"
      >
        <FormInput
          {...register('email', {
            required: {
              value: true,
              message: 'This field is required',
            },
            pattern: {
              value: EMAIL_VALIDATION_REGEX,
              message: 'Please input a valid email',
            },
          })}
        />
      </FormField>
      <FormField
        error={formState.errors.message?.message}
        label="Message"
      >
        <FormTextarea
          rows={6}
          placeholder="Please share your feedback"
          {...register('message', {
            required: {
              value: true,
              message: 'This field is required',
            },
          })}
        />
      </FormField>
    </>
  );
};
