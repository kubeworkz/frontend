import React from 'react';
import { Controller, useForm } from 'react-hook-form';

import { Button } from '../../../components/Button/Button';
import { Form } from '../../../components/Form/Form';
import { FormField } from '../../../components/Form/FormField/FormField';
import { FormInput } from '../../../components/Form/FormInput/FormInput';

import { FormSelect } from '../../../components/Form/FormSelect/FormSelect';
import { Role } from '../../../api/publicv2';
import { Credentials, useQueryContext } from '../../../app/pages/Query/queryContext';
import { useProjectRoles } from '../../../app/hooks/projectRoles';

interface QueryRoleFormProps {
  onSubmit(): void;
}

export const QueryRoleForm = (props: QueryRoleFormProps) => {
  const { state: { credentials }, actions: { onChangeCredentials } } = useQueryContext();

  const { selectOptions: roles, selectOptionsById: rolesById, isLoading } = useProjectRoles();

  const form = useForm({
    mode: 'onChange',
    defaultValues: {
      user: credentials?.user,
      password: '',
    },
  });

  const submitCredentials = (creds: Credentials) => {
    onChangeCredentials(creds);
    props.onSubmit();
  };

  const onReset = () => {
    onChangeCredentials();
    props.onSubmit();
  };

  const onSubmit = (data: { user: Role, password: string }) => {
    if (!data.user || !data.user.name) {
      onReset();
      return;
    }

    submitCredentials(data);
  };

  return (
    <Form
      className="QueryRoleForm"
      onSubmit={form.handleSubmit(onSubmit)}
      actions={(
        <>
          <Button
            appearance="secondary"
            onClick={onReset}
          >
            Use default
          </Button>
          <Button>Ok</Button>
        </>
)}
    >
      <FormField id="user_">
        <Controller
          name="user"
          control={form.control}
          render={({ field }) => (
            <FormSelect
              {...field}
              value={field.value ? rolesById[field.value.name] : undefined}
              onChange={(o: any) => field.onChange(o ? o.user : undefined)}
              isLoading={isLoading}
              options={roles}
            />
          )}
        />
      </FormField>
      <FormField id="password">
        <FormInput
          placeholder="Password"
          type="password"
          {...form.register('password')}
        />
      </FormField>
    </Form>
  );
};
