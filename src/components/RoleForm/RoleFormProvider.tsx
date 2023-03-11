import React, { PropsWithChildren } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { Form } from '../../components/Form/Form';
import { Role, apiService } from '../../api/publicv2';
import { apiErrorToaster } from '../../api/utils';
import { useNewItemsCallbacks } from '../../hooks/useNewItem';
import { useProjectsItemContext } from '../../app/hooks/projectsItem';
import { useProjectRoles } from '../../app/hooks/projectRoles';
import { useSelectedBranch } from '../../app/hooks/selectedBranchProvider';
import { RoleFormState } from './types';

export interface RoleFormProps {
  initialRole?: Partial<Role>;
  onSuccess?: (r: Role) => void;
  onError?: (e: any) => void;
}

export const RoleFormProvider = ({
  initialRole: role, onSuccess, onError, children,
}: PropsWithChildren<RoleFormProps>) => {
  const { projectId } = useProjectsItemContext();
  const { branch } = useSelectedBranch();
  const { fetch } = useProjectRoles();
  const { onRoleCreate } = useNewItemsCallbacks();

  const form = useForm<RoleFormState>({
    shouldUnregister: true,
    mode: 'onChange',
    defaultValues: {
      name: role?.name || '',
    },
  });

  const onSubmit = (data: RoleFormState) => apiService
    .createProjectBranchRole(projectId, branch?.id ?? '', {
      role: {
        name: data.name,
      },
    })
    .then(({ data: resp }) => {
      onRoleCreate(resp);
      if (onSuccess) {
        onSuccess(resp.role);
      }
      fetch();
    }, (err) => {
      apiErrorToaster(err);
      if (onError) {
        onError(err);
      }
    });

  return (
    <FormProvider {...form}>
      <Form
        onSubmit={form.handleSubmit(onSubmit)}
      >
        {children}
      </Form>
    </FormProvider>
  );
};
