import React from 'react';
import { useFormContext } from 'react-hook-form';
import { FormInput } from '../../components/Form/FormInput/FormInput';
import { FormField } from '../../components/Form/FormField/FormField';

export const ApiKeyFormFields = () => {
  const form = useFormContext();

  return (
    <FormField
      id="name"
      error={form.formState.errors?.key_name?.message}
      inline
      label="Name"
    >
      <FormInput
        {...form.register('key_name', {
          required: {
            value: true,
            message: 'This field can\'t be blank',
          },
        })}
        data-qa="api_key_form_field_name"
      />
    </FormField>
  );
};
