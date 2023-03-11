import React, { PropsWithChildren } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { apiService, Branch } from '../../api/publicv2';
import { Form } from '../../components/Form/Form';
import { FormCallbacks } from '../../components/Form/types';

interface BranchRenameFormValues {
  name: string;
}

interface BranchViewRenameFormProps extends FormCallbacks<Branch> {
  branch: Branch;
}

export const BranchRenameForm = ({
  branch, onSuccess, onFail, children,
}: PropsWithChildren<BranchViewRenameFormProps>) => {
  const form = useForm<BranchRenameFormValues>({
    defaultValues: {
      name: branch.name,
    },
    shouldUnregister: true,
  });

  const onSubmit = (data: BranchRenameFormValues) => (
    apiService.updateProjectBranch(branch.project_id, branch.id, {
      branch: {
        name: data.name,
      },
    }).then(({ data: result }) => {
      if (onSuccess) {
        onSuccess(result.branch);
      }
    }).catch((err) => {
      if (onFail) {
        onFail(err);
      }
    }));

  const formId = 'branch_rename_form';

  return (
    <FormProvider {...form}>
      <Form
        id={formId}
        onSubmit={form.handleSubmit(onSubmit)}
      >
        {children}
      </Form>
    </FormProvider>
  );
};
