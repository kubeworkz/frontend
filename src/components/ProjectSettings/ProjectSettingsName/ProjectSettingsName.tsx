import React from 'react';
import { toast } from 'react-toastify';

import { SettingsDesc } from '#shared/components/Settings/Settings';
import { apiErrorToaster } from '#api_client/utils';
import { FormInput } from '#shared/components/Form/FormInput/FormInput';
import { Button } from '#shared/components/Button/Button';
import { useForm } from 'react-hook-form';
import { FormField } from '#shared/components/Form/FormField/FormField';
import { apiService } from '#api_client/publicv2';
import { ToastSuccess } from '#shared/components/Toast/Toast';
import { AnalyticsAction, useAnalytics } from '#shared/utils/analytics';
import { useProjectsItemContext } from '../../../hooks/projectsItem';
import { ProjectSettingsSectionProps } from '../types';

const NAME_LENGTH_LIMIT = 64;

export const ProjectSettingsName = ({ disabled }: ProjectSettingsSectionProps) => {
  const { projectId, project, get } = useProjectsItemContext();
  const { trackUiInteraction } = useAnalytics();

  const form = useForm<{
    name: string,
  }>({
    defaultValues: {
      name: project?.name,
    },
  });

  const onSubmit = (data: { name: string }) => {
    trackUiInteraction(AnalyticsAction.ProjectSettingsGeneralPageSave);

    apiService
      .updateProject(projectId, {
        project: data,
      })
      .then(get)
      .then(() => {
        toast(<ToastSuccess body="Project updated!" />);
      })
      .catch(apiErrorToaster);
  };

  const errorText: string | undefined = React.useMemo(() => {
    const nameError = form.formState.errors.name;
    if (!nameError) {
      return undefined;
    }

    switch (nameError.type) {
      case 'maxLength':
        return `Name should be less than ${NAME_LENGTH_LIMIT} characters long`;
      default:
        return undefined;
    }
  }, [form.formState.errors.name]);

  return (
    <>
      <form onSubmit={disabled ? undefined : form.handleSubmit(onSubmit)}>
        <SettingsDesc>
          <FormField
            id="name_field"
            error={errorText}
            label="Project name"
          >
            <FormInput
              data-qa="project_name_input"
              disabled={disabled}
              {...form.register('name', {
                maxLength: {
                  value: NAME_LENGTH_LIMIT,
                  message: `Name should be less than ${NAME_LENGTH_LIMIT} characters`,
                },
              })}
            />
          </FormField>
        </SettingsDesc>
        <SettingsDesc>
          <Button
            data-qa="form_submit"
            type="submit"
            disabled={disabled}
          >
            Save
          </Button>
        </SettingsDesc>
      </form>
    </>
  );
};
