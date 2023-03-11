import React, { useEffect } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { FormField } from '../../components/Form/FormField/FormField';
import { FormSelect } from '../../components/Form/FormSelect/FormSelect';
import { Hint } from '../../components/Hint/Hint';
import { RoleSelect } from '../../components/RoleSelect/RoleSelect';
import { DatabaseSelect } from '../../components/DatabaseSelect/DatabaseSelect';
import { DatabaseOption } from '../../app/hooks/projectDatabases';
import { RoleOption } from '../../app/hooks/projectRoles';
import { useSelectedBranch } from '../../app/hooks/selectedBranchProvider';

const branchSelectOptions = [
  { label: 'main', value: 'main' },
];

export const ProjectInternalsSelect = () => {
  const { formState, setValue, control } = useFormContext();
  const { endpoints } = useSelectedBranch();
  useEffect(() => {
    if (endpoints.length > 0) {
      setValue('endpoint', endpoints[0].host);
    }
  }, [endpoints]);

  return (
    <>
      <FormField label={(
        <>
          <span>Production branch</span>
          <Hint>
            The
            {' '}
            <code>main</code>
            {' '}
            branch of your Neon project is the production branch for your database.
            Database branches that are created for previews are branched from
            {' '}
            <code>main</code>
            .
          </Hint>
        </>
      )}
      >
        <FormSelect options={branchSelectOptions} value={branchSelectOptions[0]} isDisabled />
      </FormField>
      <FormField label="Database" error={formState.errors.database?.message}>
        <Controller
          name="database"
          control={control}
          rules={{ required: { message: 'Pick database', value: true } }}
          render={({ field }) => (
            <DatabaseSelect
              value={field.value}
              canCreateDatabase={false}
              onChange={(v: DatabaseOption) => field.onChange(v)}
            />
          )}
        />
      </FormField>
      <FormField label="Role" error={formState.errors.role?.message}>
        <Controller
          name="role"
          control={control}
          rules={{ required: { message: 'Pick role', value: true } }}
          render={({ field }) => (
            <RoleSelect
              value={field.value}
              canCreateRole={false}
                // in some cases field.onChange doesn't work,
                // probably due to some bug in usehook library,
                // setTimeout is a workaround
              onChange={(v: RoleOption) => { setTimeout(() => field.onChange(v), 1); }}
            />
          )}
        />
      </FormField>
    </>
  );
};
