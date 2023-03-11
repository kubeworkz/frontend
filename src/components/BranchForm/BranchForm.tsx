import React, { useCallback, useEffect, useState } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import moment from 'moment';

import { apiErrorToaster } from '../../api/utils';
import { Form } from '../../components/Form/Form';
import { FormField } from '../../components/Form/FormField/FormField';
import { FormInput } from '../../components/Form/FormInput/FormInput';
import { Button } from '../../components/Button/Button';

import {
  SettingsActions,
  SettingsDesc,
  SettingsHeader,
  SettingsPageHeader,
} from '../../components/Settings/Settings';
import { FormCallbacks } from '../../components/Form/types';
import { Branch, EndpointType } from '../../api/generated/api_public_v2';
import { apiService } from '../../api/publicv2';
import { AnalyticsAction, useAnalytics } from '../../utils/analytics';
import { BranchSelectOption, useBranches } from '../../hooks/projectBranches';
import { FormRadio } from '../../components/Form/FormRadio/FormRadio';
import { Tippy } from '../../components/Tippy/Tippy';
import { useNewItemsCallbacks } from '../../hooks/useNewItem';
import { useProjectsItemContext } from '../../app/hooks/projectsItem';
import { BranchSelect } from '../BranchSelect/BranchSelect';
import { useProjectEndpoints } from '../../app/hooks/projectEndpoints';
import { useUserEndpointsLimit } from '../../app/hooks/userLimits';
import { BranchFormStartPoint, DATE_TIME_FORMAT } from './BranchFormStartPoint/BranchFormStartPoint';
import styles from './BranchForm.module.css';

export type BranchFormState = {
  name: string;
  parent_id: Branch['id'];
  parent_lsn?: string;
  parent_timestamp?: string;
};

export const BRANCH_NAME_RESTRICTIONS = {
  maxLength: {
    value: 128,
    message: 'Branch name should be less than 128 characters',
  },
};

enum CreateEndpointOption {
  Create = 'create',
  DoNotCreate = 'do_not_create',
}

interface BranchFormProps extends FormCallbacks<Branch> {
  parentId?: string;
}

export const BranchForm = ({ parentId, onSuccess, onCancel }: BranchFormProps) => {
  const { trackUiInteraction } = useAnalytics();
  const { projectId } = useProjectsItemContext();
  const { fetch: fetchBranches, selectOptionsById } = useBranches();
  const { fetch: fetchEndpoints } = useProjectEndpoints();
  const endpointLimitsData = useUserEndpointsLimit();
  const { onBranchCreate } = useNewItemsCallbacks();

  const initialState: BranchFormState = {
    name: '',
    parent_id: parentId ?? '',
  };

  const form = useForm<BranchFormState>({
    defaultValues: initialState,
  });
  const {
    register, handleSubmit, formState,
  } = form;
  const [createEndpoint, setCreateEndpoint] = useState<CreateEndpointOption | string | undefined>();

  const onSubmit = useCallback(
    ({ parent_timestamp, parent_lsn, ...data }: BranchFormState) => {
      trackUiInteraction(AnalyticsAction.BranchFormSubmitted);
      apiService.createProjectBranch(projectId, {
        branch: {
          parent_id: data.parent_id,
          name: data.name || undefined,
          parent_timestamp: parent_timestamp
            ? moment(parent_timestamp, DATE_TIME_FORMAT).toISOString(true)
            : undefined,
          parent_lsn,
        },
        endpoints: createEndpoint === CreateEndpointOption.Create ? [
          {
            type: EndpointType.ReadWrite,
          }] : undefined,
      })
        .then(({ data: result }) => {
          onBranchCreate(result);
          fetchBranches();
          // we update endpoints list here because
          // for now we create endpoint for branch automatically
          fetchEndpoints();
          if (onSuccess) {
            onSuccess(result.branch);
          }
        })
        .catch(apiErrorToaster);
    },
    [projectId, createEndpoint],
  );

  const onCancelClick = React.useCallback(() => {
    trackUiInteraction(AnalyticsAction.BranchFormDismissed);
    if (onCancel) {
      onCancel();
    }
  }, [onCancel]);

  useEffect(() => {
    if (!endpointLimitsData.isLimitExceeded && createEndpoint === undefined) {
      setCreateEndpoint(
        endpointLimitsData.isLimitExceeded
          ? CreateEndpointOption.DoNotCreate
          : CreateEndpointOption.Create,
      );
    }
  }, [endpointLimitsData.isLoading, endpointLimitsData.isLimitExceeded]);

  const onChangeCreateEndpoint = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setCreateEndpoint(e.target.value);
  }, []);

  return (
    <>
      <SettingsPageHeader>
        Create a branch
      </SettingsPageHeader>
      <FormProvider {...form}>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <SettingsHeader>
            General
          </SettingsHeader>
          <SettingsDesc>
            <FormField
              label="Branch name"
              className={styles.field}
              error={formState.errors.name?.message}
            >
              <FormInput
                {...register('name', BRANCH_NAME_RESTRICTIONS)}
                placeholder="Will be autogenerated if left blank"
              />
            </FormField>
          </SettingsDesc>
          <SettingsHeader>
            Parent branch
          </SettingsHeader>
          <SettingsDesc>
            Select a parent branch. You can branch from the
            primary branch or from a previously created branch.
          </SettingsDesc>
          <SettingsDesc>
            <FormField
              label="Parent branch"
              className={styles.field}
              error={formState.errors.parent_id?.message}
            >
              <Controller
                name="parent_id"
                control={form.control}
                rules={{
                  required: {
                    value: true,
                    message: 'Parent is required',
                  },
                }}
                render={({ field }) => (
                  <BranchSelect
                    value={selectOptionsById[field.value]}
                    onChange={(o: BranchSelectOption) => {
                      trackUiInteraction(AnalyticsAction.BranchFormParentChanged);
                      field.onChange(o?.value);
                    }}
                  />
                )}
              />
            </FormField>
          </SettingsDesc>
          <SettingsDesc>
            Select one of the following options
            to specify the data to be included:
          </SettingsDesc>
          <BranchFormStartPoint />
          <SettingsHeader>
            Configure endpoints
          </SettingsHeader>
          <SettingsDesc>
            A compute endpoint is required to connect to the branch from a client or application.
            Create a compute endpoint if you intend to connect to the branch.
            If you are creating a branch as a backup or snapshot, you may not need a
            compute endpoint.
            If you are unsure, you can add a compute endpoint later.
          </SettingsDesc>
          <SettingsDesc>
            <div>
              <FormRadio
                value={CreateEndpointOption.Create}
                name="create_endpoint"
                disabled={endpointLimitsData.isLimitExceeded}
                onChange={onChangeCreateEndpoint}
                checked={createEndpoint === CreateEndpointOption.Create}
              >
                <Tippy
                  content={endpointLimitsData.message}
                  placement="right"
                  disabled={!endpointLimitsData.message}
                >
                  <div style={{ display: 'inline-block' }}>
                    Create compute endpoint
                  </div>
                </Tippy>
              </FormRadio>
            </div>
            <div>
              <FormRadio
                value={CreateEndpointOption.DoNotCreate}
                name="create_endpoint"
                onChange={onChangeCreateEndpoint}
                checked={createEndpoint === CreateEndpointOption.DoNotCreate}
              >
                Don’t create a compute endpoint
              </FormRadio>
            </div>
          </SettingsDesc>
          <SettingsActions>
            <Button type="submit">Create a branch</Button>
            {onCancel
              && (
              <Button
                onClick={onCancelClick}
                appearance="default"
                type="button"
              >
                Cancel
              </Button>
              )}
          </SettingsActions>
        </Form>
      </FormProvider>
    </>
  );
};
