import React, { PropsWithChildren } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { Form } from '../../components/Form/Form';
import { Database } from '../../api/publicv2';
import { apiErrorToaster } from '../../api/utils';
import { FormCallbacks } from '../../components/Form/types';
import { useProjectRoles } from '../../app/hooks/projectRoles';
import { useProjectDatabases } from '../../app/hooks/projectDatabases';
import { useSelectedBranch } from '../../app/hooks/selectedBranchProvider';
import { DatabaseFormState } from './types';

export interface DatabaseFormProps extends FormCallbacks<Database> {
  database?: Database;
}

export const DatabaseFormProvider = ({
  database, onSuccess, onFail, children,
}: PropsWithChildren<DatabaseFormProps>) => {
  const { list } = useProjectRoles();
  const { updateDatabase, createDatabase } = useProjectDatabases();
  const { branch } = useSelectedBranch();

  const form = useForm<DatabaseFormState>({
    shouldUnregister: true,
    mode: 'onChange',
    defaultValues: {
      name: database?.name || '',
      owner_name: database?.owner_name || (list[0] && list[0].name),
    },
  });

  const onSubmit = ({ branchId, ...data }: DatabaseFormState) => {
    if (!branch) {
      return undefined;
    }
    const request = database
      ? () => updateDatabase(database, {
        database: data,
      })
      : () => createDatabase(branch.id, {
        database: data,
      });

    return request()?.then(({ data: resp }) => {
      if (onSuccess) {
        onSuccess(resp.database);
      }
    }, (e) => {
      apiErrorToaster(e);
      if (onFail) {
        onFail(e);
      }
    });
  };

  return (
    <FormProvider {...form}>
      <Form
        onSubmit={form.handleSubmit(onSubmit)}
        data-qa="create_database_form"
      >
        {children}
      </Form>
    </FormProvider>
  );
};
