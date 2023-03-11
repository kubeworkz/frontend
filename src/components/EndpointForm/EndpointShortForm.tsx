import React, { PropsWithChildren } from 'react';
import { FormCallbacks } from '../../components/Form/types';
import { Endpoint, EndpointType } from '../../api/generated/api_public_v2';
import { Form, FormProps } from '../../components/Form/Form';
import { FormProvider, useForm } from 'react-hook-form';
import { apiService } from '../../api/publicv2';
import { useAppContext } from '../../app/hooks/app';
import { EndpointFormInitialData } from './types';

export interface EndpointEditFormProps
  extends EndpointFormInitialData, FormCallbacks<Endpoint>, FormProps {}

interface EndpointShortFormData {
  branch_id: string;
  autoscaling_limit_cu: {
    min?: number;
    max?: number;
  }
  pooler_enabled: boolean;
}

export const EndpointShortForm = ({
  endpoint,
  projectId,
  branchId,
  onSuccess,
  onFail,
  children,
  ...props
}: PropsWithChildren<EndpointEditFormProps>) => {
  const { isFeatureEnabled } = useAppContext();

  const formDefaults: EndpointShortFormData = React.useMemo(() => {
    if (endpoint) {
      return {
        branch_id: endpoint.branch_id,
        autoscaling_limit_cu: {
          max: endpoint.autoscaling_limit_max_cu,
          min: endpoint.autoscaling_limit_min_cu,
        },
        pooler_enabled: endpoint.pooler_enabled,
      };
    } if (branchId) {
      return {
        branch_id: branchId,
        autoscaling_limit_cu: {
          max: 1,
          min: 1,
        },
        pooler_enabled: false,
      };
    }

    return {
      branch_id: '',
      pooler_enabled: false,
      autoscaling_limit_cu: {
        max: 1,
        min: 1,
      },
    };
  }, [projectId]);

  const form = useForm<EndpointShortFormData>({
    defaultValues: formDefaults,
    shouldUnregister: true,
  });

  const onSubmit = React.useCallback(({
    branch_id,
    pooler_enabled,
    autoscaling_limit_cu,
  }: EndpointShortFormData) => {
    const autoscalingLimitsCUData: {
      autoscaling_limit_max_cu?: number;
      autoscaling_limit_min_cu?: number;
    } = {};

    if (isFeatureEnabled('autoscaling_ui')) {
      autoscalingLimitsCUData.autoscaling_limit_max_cu = autoscaling_limit_cu.max;
    }

    if (isFeatureEnabled('autoscaling_ui_next')) {
      autoscalingLimitsCUData.autoscaling_limit_min_cu = autoscaling_limit_cu.min;
      autoscalingLimitsCUData.autoscaling_limit_max_cu = autoscaling_limit_cu.max;
    }

    if (endpoint) {
      return apiService.updateProjectEndpoint(endpoint.project_id, endpoint.id, {
        endpoint: {
          pooler_enabled,
          ...autoscalingLimitsCUData,
        },
      }).then(({ data }) => {
        if (onSuccess) {
          onSuccess(data.endpoint);
        }
      }).catch((err) => {
        if (onFail) {
          onFail(err);
        }
      });
    }

    if (!projectId) {
      throw new Error('ProjectId should be specified');
    }

    return apiService.createProjectEndpoint(projectId, {
      endpoint: {
        branch_id,
        pooler_enabled,
        ...autoscalingLimitsCUData,
        type: EndpointType.ReadWrite,
      },
    }).then(({ data }) => {
      if (onSuccess) {
        onSuccess(data.endpoint);
      }
    }).catch((err) => {
      if (onFail) {
        onFail(err);
      }
    });
  }, [projectId, endpoint, branchId]);

  return (
    <FormProvider {...form}>
      <Form {...props} onSubmit={form.handleSubmit(onSubmit)}>
        {children}
      </Form>
    </FormProvider>
  );
};
