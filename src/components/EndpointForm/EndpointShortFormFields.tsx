import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { FormField } from '#shared/components/Form/FormField/FormField';
import { BranchSelectOption, useBranches } from '#shared/hooks/projectBranches';
import { useCurrentUser } from '#shared/hooks/currentUser';
import { FormCheckbox } from '#shared/components/Form/FormCheckbox/FormCheckbox';
import { CPUUnitsSlider } from '#shared/components/CPUUnitsSlider/CPUUnitsSlider';
import { Button } from '#shared/components/Button/Button';
import { Alert } from '#shared/components/Alert/Alert';
import { FormRow } from '#shared/components/Form/FormRow/FormRow';
import { Endpoint } from '#api_client/generated/api_public_v2';
import { BranchSelect } from '../BranchSelect/BranchSelect';
import { useAppContext } from '../../hooks/app';

const EndpointBranchIdField = () => {
  const { selectOptionsById } = useBranches();

  const form = useFormContext();

  return (
    <FormField
      label="Branch"
      error={form.formState.errors.branch_id?.message}
    >
      <Controller
        name="branch_id"
        control={form.control}
        rules={{
          required: {
            value: true,
            message: 'Branch is required',
          },
        }}
        render={({ field }) => (
          <BranchSelect
            value={selectOptionsById[field.value]}
            onChange={(o: BranchSelectOption) => (
              field.onChange(o ? o.value : undefined)
            )}
            isDisabled
          />
        )}
      />
    </FormField>
  );
};

const EndpointCPULimitsField = () => {
  const { user: { maxAutoscalingLimit } } = useCurrentUser();
  const { isFeatureEnabled } = useAppContext();

  const form = useFormContext();

  const isCPUUnitsFieldVisible = React.useMemo(
    () => (
      isFeatureEnabled('autoscaling_ui') || isFeatureEnabled('autoscaling_ui_next')
    ),
    [maxAutoscalingLimit, isFeatureEnabled],
  );

  if (!isCPUUnitsFieldVisible) {
    return null;
  }

  const sliderProps = maxAutoscalingLimit > 1 ? {
    maxValue: maxAutoscalingLimit,
  } : {
    disabled: true,
    maxValue: 8,
  };

  return (
    <FormField
      label={(
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
          <span>CPU Units:</span>
          <Button
            appearance="default"
            as="a"
            target="_blank"
            href="#"
          >
            Read more
          </Button>
        </div>
      )}
    >
      <Controller
        name="autoscaling_limit_cu"
        control={form.control}
        rules={{
          shouldUnregister: true,
        }}
        render={({ field }) => (
          <CPUUnitsSlider
            {...sliderProps}
            value={field.value}
            onChange={(v) => field.onChange(v)}
            isEditMinAvailable={isFeatureEnabled('autoscaling_ui_next')}
          />
        )}
      />
    </FormField>
  );
};

// todo: remove this code after March 29, 2023
const EndpointPoolerField = ({ disabled }: { disabled?: boolean }) => {
  const form = useFormContext();
  const { isFeatureEnabled } = useAppContext();

  if (isFeatureEnabled('endpointPoolerHiddenUI')) {
    return null;
  }

  return (
    <>
      <FormRow>
        <Alert>
          Enabling connection pooling for a compute
          endpoint is deprecated.
          {' '}
          <Button
            as="a"
            href="https://cloudrock.ca/docs/connect/connection-pooling#enable-connection-pooling"
            appearance="default"
            target="_blank"
          >
            Read more
          </Button>
          {' '}
          to learn how to enable pooling for individual
          connections.
        </Alert>
      </FormRow>
      <FormField>
        <Controller
          name="pooler_enabled"
          control={form.control}
          render={({ field }) => (
            <FormCheckbox
              checked={field.value === true}
              disabled={disabled}
              onChange={(v) => field.onChange(v.target.checked)}
            >
              Pooler enabled
            </FormCheckbox>
          )}
        />
      </FormField>
    </>
  );
};

export const EndpointCreateShortFormFields = () => (
  <>
    <EndpointBranchIdField />
    <EndpointCPULimitsField />
    <EndpointPoolerField disabled />
  </>
);

export const EndpointEditShortFormFields = ({ endpoint }: { endpoint: Endpoint }) => (
  <>
    <EndpointBranchIdField />
    <EndpointCPULimitsField />
    <EndpointPoolerField disabled={!endpoint.pooler_enabled} />
  </>
);
