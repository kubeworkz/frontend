import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { FormField } from '#shared/components/Form/FormField/FormField';
import { FormInput } from '#shared/components/Form/FormInput/FormInput';
import { useBranches } from '#shared/hooks/projectBranches';
import { RoleOption, useProjectRoles } from '../../hooks/projectRoles';
import { RoleSelect } from '../RoleSelect/RoleSelect';

import { BranchSelect } from '../BranchSelect/BranchSelect';
import { useSelectedBranch } from '../../hooks/selectedBranchProvider';
import { DatabaseFormState } from './types';
import styles from './DatabaseForm.module.css';

export const DatabaseFormFields = () => {
  const {
    register,
    control,
    formState: {
      errors,
    },
  } = useFormContext<DatabaseFormState>();
  const { selectOptionsById: rolesById } = useProjectRoles();
  const { selectOptionsById: branchesById } = useBranches();
  const { branch } = useSelectedBranch();

  return (
    <>
      <FormField
        id="branchId"
        error={!!errors.branchId}
        label="Branch"
        inline
        labelClassName={styles.label}
      >
        <BranchSelect
          containerClassName={styles.field}
          value={branch ? branchesById[branch?.id] : null}
          isDisabled
          data-qa="create_database_form_branch_field"
        />
      </FormField>
      <FormField
        id="name_field"
        error={errors?.name?.message}
        label="Database name"
        labelClassName={styles.label}
        inline
        data-qa="create_database_form_name_field"
      >
        <FormInput
          {...register('name', {
            required: {
              value: true,
              message: 'This field is required',
            },
            maxLength: {
              value: 63,
              message: 'Database name should be less than 63 bytes',
            },
          })}
          data-qa="create_database_form_name_input"
        />
      </FormField>
      <FormField
        id="ownerId"
        error={!!errors.owner_name}
        label="Owner"
        inline
        labelClassName={styles.label}
      >
        <Controller
          name="owner_name"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <RoleSelect
              containerClassName={styles.field}
              value={rolesById[field.value]}
              onChange={(o: RoleOption) => field.onChange(o ? o.value : undefined)}
              data-qa="create_database_form_owner_field"
            />
          )}
        />
      </FormField>
      {/* <FormField */}
      {/*  id="sorting_locale" */}
      {/*  className={styles.row} */}
      {/*  inlineLabel */}
      {/*  wide */}
      {/* > */}
      {/*  <FormLabel className={styles.label}>Locale for sorting (LC_COLLATE)</FormLabel> */}
      {/*  <FormSelect */}
      {/*    containerClassName={styles.field} */}
      {/*    isLoading={!isReady} */}
      {/*    options={[ */}
      {/*      { value: 1, label: 'C' }, */}
      {/*    ]} */}
      {/*  /> */}
      {/* </FormField> */}
      {/* <FormField */}
      {/*  id="charset_locale" */}
      {/*  className={styles.row} */}
      {/*  inlineLabel */}
      {/*  wide */}
      {/* > */}
      {/*  <FormLabel className={styles.label}>Charset locale (LC_CTYPE)</FormLabel> */}
      {/*  <FormSelect */}
      {/*    containerClassName={styles.field} */}
      {/*    isLoading={!isReady} */}
      {/*    options={[ */}
      {/*      { value: 1, label: 'C' }, */}
      {/*    ]} */}
      {/*  /> */}
      {/* </FormField> */}
      {/* <ModalActions> */}
      {/*  <StatusButton */}
      {/*    type="submit" */}
      {/*    appearance={isValid ? 'primary' : 'secondary'} */}
      {/*    disabled={!isValid} */}
      {/*    loading={isSubmitting} */}
      {/*    succeed={isSubmitSuccessful && !submitError} */}
      {/*    label={database ? STATUS_BUTTON_LABELS.Save : STATUS_BUTTON_LABELS.Create} */}
      {/*  /> */}
      {/* </ModalActions> */}
    </>
  );
};
