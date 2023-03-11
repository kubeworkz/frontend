import React from 'react';
import { useFormContext } from 'react-hook-form';
import { FormField } from '../../components/Form/FormField/FormField';
import { FormInput } from '../../components/Form/FormInput/FormInput';
import { useBranches } from '../../hooks/projectBranches';
import { BranchSelect } from '../BranchSelect/BranchSelect';
import { useSelectedBranch } from '../../app/hooks/selectedBranchProvider';

import { RoleFormState } from './types';

export const RoleForm = () => {
  const {
    register,
    formState: {
      errors,
    },
  } = useFormContext<RoleFormState>();
  const { branch } = useSelectedBranch();
  const { selectOptionsById } = useBranches();

  return (
    <>
      <FormField
        id="branch_field"
        label="Branch"
        inline
      >
        <BranchSelect
          value={branch ? selectOptionsById[branch.id] : undefined}
          isDisabled
        />
      </FormField>
      <FormField
        id="name_field"
        error={!!errors.name}
        label="Name"
        inline
      >
        <FormInput
          {...register('name', {
            required: true,
          })}
        />
      </FormField>
    </>
  );
};
