import React from 'react';
import { useFormContext } from 'react-hook-form';
import { FormField } from '../../components/Form/FormField/FormField';
import { FormInput } from '../../components/Form/FormInput/FormInput';
import { BRANCH_NAME_RESTRICTIONS } from '../BranchForm/BranchForm';

export const BranchRenameFormFields = () => {
  const form = useFormContext();

  return (
    <FormField
      label="Name"
      error={form.formState.errors.name?.message}
    >
      <FormInput
        {...form.register('name', BRANCH_NAME_RESTRICTIONS)}
      />
    </FormField>
  );
};
