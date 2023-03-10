import React from 'react';
import { useResource } from '#shared/utils/useResource';
import { apiService, ProjectPermission } from '#api_client/publicv2';
import { apiErrorToaster, createErrorText } from '#api_client/utils';
import { useForm } from 'react-hook-form';
import { SettingsDesc, SettingsHeader } from '#shared/components/Settings/Settings';
import { Form } from '#shared/components/Form/Form';

import { FormInput } from '#shared/components/Form/FormInput/FormInput';
import { FormField } from '#shared/components/Form/FormField/FormField';
import { EMAIL_VALIDATION_REGEX } from '#shared/utils/validation';
import { Button } from '#shared/components/Button/Button';
import { DataTable, DataTableColumn } from '#shared/components/DataTable/DataTable';
import {
  ConfirmationPreset,
  useConfirmation,
} from '#shared/components/Confirmation/ConfirmationProvider';

import styles from './ShareProjectForm.module.css';

interface ShareProjectFormProps {
  projectId: string;
}

interface GrantPermissionFormData {
  email: string;
}

export const ShareProjectForm = ({ projectId }: ShareProjectFormProps) => {
  const [projectPermissions, setProjectPermissions] = useResource<ProjectPermission[]>();
  const { confirm } = useConfirmation();
  const grantPermissionForm = useForm<GrantPermissionFormData>({
    shouldUnregister: true,
    defaultValues: {
      email: '',
    },
  });

  const fetchPermissions = React.useCallback(() => {
    apiService
      .listProjectPermissions(projectId)
      .then(({ data }) => {
        setProjectPermissions({
          data: data.project_permissions,
          isLoading: false,
        });
      }, (res) => {
        setProjectPermissions({
          error: createErrorText(res),
          isLoading: false,
        });
      });
  }, [projectId]);

  const onRevokePermission = (id: ProjectPermission['id']) => {
    apiService.revokePermissionFromProject(projectId, id)
      .then(fetchPermissions, apiErrorToaster);
  };

  const onGrantPermission = (data: GrantPermissionFormData) => {
    apiService.grantPermissionToProject(projectId, data)
      .then(() => {
        fetchPermissions();
        grantPermissionForm.setValue('email', '');
      }, apiErrorToaster);
  };

  const permissionsCols: DataTableColumn<ProjectPermission>[] = React.useMemo(() => ([
    {
      label: 'Email',
      key: 'granted_to_email',
    },
    {
      label: '',
      key: 'revoke',
      tdAttrs: {
        className: styles.revokeCol,
      },
      renderValue: (permission) => (
        <Button
          size="s"
          appearance="error"
          onClick={() => {
            confirm(ConfirmationPreset.RevokeProjectPermission)
              .then(() => onRevokePermission(permission.id));
          }}
        >
          Revoke
        </Button>
      ),
    },
  ]), []);

  React.useEffect(() => {
    setProjectPermissions({ isLoading: true });
    fetchPermissions();
  }, [fetchPermissions]);

  return (
    <>
      <SettingsDesc>
        <SettingsHeader>
          People, who have the access to the project
        </SettingsHeader>
      </SettingsDesc>
      <SettingsDesc>
        <DataTable
          cols={permissionsCols}
          data={projectPermissions.data}
          isLoading={projectPermissions.isLoading}
          dataPlaceholderProps={{
            title: 'You haven\'t share the access with anybody yet',
          }}
        />
      </SettingsDesc>
      <SettingsDesc>
        <SettingsHeader>
          Grant access to your project
        </SettingsHeader>
      </SettingsDesc>
      <SettingsDesc>
        <Form
          onSubmit={grantPermissionForm.handleSubmit(onGrantPermission)}
        >
          <FormField
            error={grantPermissionForm.formState.errors.email?.message}
          >
            <FormInput
              placeholder="Email"
              {...grantPermissionForm.register('email', {
                required: true,
                pattern: {
                  value: EMAIL_VALIDATION_REGEX,
                  message: 'Please enter a valid email address',
                },
              })}
            />
          </FormField>
          <Button type="submit">Grant Access</Button>
        </Form>
      </SettingsDesc>
    </>
  );
};
