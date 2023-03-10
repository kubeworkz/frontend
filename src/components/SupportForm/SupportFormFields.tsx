import React from 'react';
import { useFormContext } from 'react-hook-form';
import { FormField } from '#shared/components/Form/FormField/FormField';
import { FormInput } from '#shared/components/Form/FormInput/FormInput';
import { FormTextarea } from '#shared/components/Form/FormInput/FormTextarea';
import { EMAIL_VALIDATION_REGEX } from '#shared/utils/validation';

export const SupportFormFields = () => {
  const { formState, register } = useFormContext();

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
        error={formState.errors.subject?.message}
        label="Topic"
      >
        <FormInput
          {...register('subject', {
            required: {
              value: true,
              message: 'This field is required',
            },
          })}
        />
      </FormField>
      <FormField
        error={formState.errors.content?.message}
        label="Message"
      >
        <FormTextarea
          rows={6}
          placeholder="Please describe the issue in detail and what you are trying to accomplish"
          {...register('content', {
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
