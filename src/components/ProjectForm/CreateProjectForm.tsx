import React, { PropsWithChildren } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { Form } from '#shared/components/Form/Form';

import { useConfirmation } from '#shared/components/Confirmation/ConfirmationProvider';
import {
  apiService, Project, ProjectCreateRequest,
} from '#api_client/publicv2';
import { AnalyticsAction, useAnalytics } from '#shared/utils/analytics';
import { usePgSettings } from '#shared/hooks/pgSettings';
import { usePlatforms } from '#shared/hooks/platforms';
import { ProjectData } from '#shared/hooks/useNewItem';
import { FormCallbacks } from '#shared/components/Form/types';

import { CU_SCALE } from '../CPUUnitsSlider/CPUUnitsSlider';
import { useAppContext } from '../../../console/hooks/app';

import './ProjectForm.css';

interface CreateProjectFormProps extends FormCallbacks<ProjectData> {
  id?: string;
}

interface ProjectFormData {
  project: {
    name?: string;
    platform_id: string;
    region_id: string;
    instance_handle: string;
    pg_version: number;
    settings: Record<string, string>;
    provisioner?: Project['provisioner'] | undefined;
  };
  database?: {
    name: string;
  };
  role?: {
    name: string;
    password:string;
  };
  endpoint: {
    cpu_units: {
      min: number;
      max: number;
    }
  }
}

export const CreateProjectForm = React.memo(({
  id,
  onSuccess,
  onFail,
  children,
}: PropsWithChildren<CreateProjectFormProps>) => {
  const { pgDefaults } = usePgSettings();
  const { platforms } = usePlatforms();
  const { isFeatureEnabled } = useAppContext();

  const { trackUiInteraction } = useAnalytics();

  const calculateInitialValues = React.useCallback(() => {
    const defaultPlatform = platforms.find((p) => p.default) || platforms[0];

    const defaultRegion = defaultPlatform ? (
      defaultPlatform.regions.find((r) => r.default) || defaultPlatform.regions[0]
    ) : null;
    const defaultInstance = defaultPlatform ? (
      defaultPlatform.instance_types.find((p) => p.default) || defaultPlatform.instance_types[0]
    ) : null;

    return {
      platform_id: defaultPlatform?.id,
      region_id: defaultRegion?.id,
      instance_handle: defaultInstance?.id,
      settings: pgDefaults,
      pg_version: 15,
    };
  }, []);

  const initials = calculateInitialValues();

  const { confirm } = useConfirmation();

  const form = useForm<ProjectFormData>({
    mode: 'onChange',
    defaultValues: {
      project: initials,
      endpoint: {
        cpu_units: {
          min: CU_SCALE[0],
          max: CU_SCALE[0],
        },
      },
    },
  });

  const createProject = React.useCallback((formData: ProjectFormData) => {
    const newProjectData = formData;
    if (newProjectData.project.name === '') {
      delete newProjectData.project.name;
    }

    const projectCreateData: ProjectCreateRequest = {
      project: newProjectData.project,
    };

    if (isFeatureEnabled('autoscaling_ui')) {
      projectCreateData.project.autoscaling_limit_max_cu = newProjectData.endpoint.cpu_units.max;
    }

    if (isFeatureEnabled('autoscaling_ui_next')) {
      projectCreateData.project.autoscaling_limit_min_cu = newProjectData.endpoint.cpu_units.min;
      projectCreateData.project.autoscaling_limit_max_cu = newProjectData.endpoint.cpu_units.max;
    }

    trackUiInteraction(AnalyticsAction.ProjectFormSubmitted);
    return apiService.createProject(projectCreateData)
      .then(({ data }) => {
        if (onSuccess) {
          onSuccess(data);
        }
      })
      .catch((err) => {
        if (onFail) {
          onFail(err);
        }
      });
  }, []);

  const onSubmitForm = React.useCallback((rawData: ProjectFormData) => {
    // filter empty and default values from pg settings
    const settings: Record<string, string> = {};

    const shouldConfirmRestart = false;

    const formData = {
      ...rawData,
      project: {
        ...rawData.project,
        settings,
      },
    };

    if (shouldConfirmRestart) {
      return confirm({
        header: 'Compute node will be restarted',
      }).then(() => createProject(formData));
    }

    return createProject(formData);
  }, []);

  return (
    <FormProvider {...form}>
      <Form
        onSubmit={form.handleSubmit(onSubmitForm)}
        className="ProjectsNew"
        id={id}
      >
        {children}
      </Form>
    </FormProvider>
  );
});

CreateProjectForm.displayName = 'ProjectForm';
