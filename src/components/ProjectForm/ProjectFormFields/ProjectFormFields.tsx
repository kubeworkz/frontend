import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { FormField } from '../../../components/Form/FormField/FormField';
import { FormInput } from '../../../components/Form/FormInput/FormInput';
import { FormSelect } from '../../../components/Form/FormSelect/FormSelect';
import { usePgSettings } from '../../../hooks/pgSettings';
import { BillingSubscriptionType, Project } from '../../../api/publicv2';

import { humanizeRam } from '../../../utils/sizeHelpers';
import {
  InstanceType, Platform, Region, usePlatforms,
} from '../../../hooks/platforms';
import { AnalyticsAction, useAnalytics } from '../../../utils/analytics';
import { isServerless } from '../../../utils/isServerless';

import { FormRadio } from '../../../components/Form/FormRadio/FormRadio';
import { useCurrentUser } from '../../../hooks/currentUser';
import { CPUUnitsSlider, CU_SCALE } from '../../../components/CPUUnitsSlider/CPUUnitsSlider';
import { useAppContext } from '../../../app/hooks/app';
import styles from './ProjectFormFields.module.css';

interface ProjectFormFieldsProps {
  project?: Project | undefined;
  blockLabels?: boolean;
}

const POSTGRES_VERSION_OPTIONS = [
  {
    label: '14',
    value: 14,
  },
  {
    label: '15',
    value: 15,
  },
];

const PG_VERSION_OPTIONS_BY_ID = Object
  .fromEntries(POSTGRES_VERSION_OPTIONS.map(
    (option) => ([option.value, option]),
  ));

export const ProjectFormFields = React.memo(
  ({ project, blockLabels }: ProjectFormFieldsProps) => {
    const { trackUiInteraction } = useAnalytics();
    const { isFeatureEnabled } = useAppContext();
    const { user: { maxAutoscalingLimit, billingAccount } } = useCurrentUser();
    const isFreeUser = billingAccount.subscription_type === BillingSubscriptionType.Free;
    const {
      pgDefaults,
    } = usePgSettings();
    const {
      platforms,
      platformsById,
      regionsByPlatform,
      instanceTypesByPlatform,
    } = usePlatforms();

    const {
      watch,
      register,
      formState: {
        errors,
      },
      setValue,
      control: formControl,
    } = useFormContext();

    const {
      region_id: selectedRegion,
      instance_type_id: selectedInstanceType,
      platform_id: selectedPlatform,
      settings: currentSettings,
    } = watch('project');

    const getRegionOptions = React.useCallback((platformId: Platform['id']) => (
      (regionsByPlatform[platformId] && regionsByPlatform[platformId].length)
        ? regionsByPlatform[platformId].filter((region) => region.active)
        : []
    ), [regionsByPlatform]);

    const onChangePlatform = React.useCallback((platformId) => {
      if (!project) {
      // only for project creation
        if (!platformId) {
          setValue('project.region_id', undefined);
          setValue('project.instance_type_id', undefined);
          return;
        }

        const regionOptions = getRegionOptions(platformId);

        const regionId = regionOptions.length
          ? regionOptions[0].id : undefined;
        const instanceTypeId = (instanceTypesByPlatform[platformId]
          && instanceTypesByPlatform[platformId].length)
          ? instanceTypesByPlatform[platformId][0].id : undefined;

        setValue('project.region_id', regionId);
        setValue('project.instance_type_id', instanceTypeId);
        setValue('project.platform_id', platformId);
        setValue('project.settings', pgDefaults);
        setValue('project.provisioner', undefined);
      }
    }, []);

    const onChangeInstanceType = React.useCallback((instanceTypeId) => {
      // maybe we should ask user if they ok with settings changing?

      setValue('project.settings', currentSettings);
      setValue('project.instance_type_id', instanceTypeId);
    }, [selectedPlatform]);

    const instanceTypeOptions: InstanceType[] = React.useMemo(() => (
      selectedPlatform && instanceTypesByPlatform[selectedPlatform]
    ) || [], [selectedPlatform]);

    const isSelectedPlatformServerless = React.useMemo(
      () => selectedPlatform && isServerless(selectedPlatform),
      [selectedPlatform],
    );

    const regionOptions = getRegionOptions(selectedPlatform);

    const fieldsCommonProps = {
      labelClassName: blockLabels ? '' : styles.label,
    };

    const onChangeRegion = (o: Region) => {
      trackUiInteraction(AnalyticsAction.ProjectFormRegionChanged);
      setValue('project.region_id', o.id);
      setValue('project.provisioner', undefined);
    };

    const selectedRegionOption = regionOptions
      .find(({ id }) => id === selectedRegion);
    const provisionerOptions: Array<string> = (isFeatureEnabled('provisioner_ui') && selectedRegionOption
    && selectedRegionOption.supported_provisioners.length)
      ? selectedRegionOption.supported_provisioners
      : [];

    const isCPUUnitsVisible = (
      isFeatureEnabled('autoscaling_ui') || isFeatureEnabled('autoscaling_ui_next')
    ) && maxAutoscalingLimit > 1;

    return (
      <div>
        <FormField
          id="project.name"
          error={errors.project?.name.message}
          label="Name"
          {...fieldsCommonProps}
        >
          <FormInput
            {...register('project.name', {
              maxLength: {
                value: 64,
                message: 'Project name should be less than 64 characters',
              },
            })}
            placeholder={project ? 'Enter the name' : 'Will be autogenerated if left blank'}
          />
        </FormField>
        <FormField
          id="project.pg_version"
          error={errors.project?.pg_version.message}
          label="Postgres version"
          {...fieldsCommonProps}
        >
          <Controller
            name="project.pg_version"
            control={formControl}
            render={({ field }) => (
              <FormSelect
                containerClassName={styles.input}
                value={PG_VERSION_OPTIONS_BY_ID[field.value]}
                onChange={(o: any) => field.onChange(o.value)}
                options={POSTGRES_VERSION_OPTIONS}
              />
            )}
          />
        </FormField>
        {(!project)
      && (
        <>
          {platforms.length > 1 && (
            <FormField
              id="project.platform"
              label="Service"
              {...fieldsCommonProps}
            >
              <Controller
                name="project.platformId"
                control={formControl}
                render={() => (
                  <FormSelect
                    containerClassName={styles.input}
                    value={platformsById[selectedPlatform]}
                    onChange={(o: any) => onChangePlatform(o.id)}
                    options={platforms}
                    getOptionLabel={(o: Platform) => o.name}
                    getOptionValue={(o: Platform) => o.id}
                  />
                )}
              />
            </FormField>
          )}
          {regionOptions?.length > 1 && (
            <FormField
              className={styles.input_container}
              id="project.region_id"
              label="Region"
              {...fieldsCommonProps}
            >
              {selectedPlatform
              && (
                <Controller
                  name="project.region_id"
                  control={formControl}
                  render={() => (
                    <FormSelect
                      containerClassName={styles.input}
                      value={selectedRegionOption}
                      onChange={onChangeRegion}
                      options={regionOptions}
                      getOptionLabel={(o: Region) => o.name}
                      getOptionValue={(o: Region) => o.id}
                    />
                  )}
                />
              )}
            </FormField>
          )}
        </>
      )}
        { Boolean(selectedPlatform
          && instanceTypeOptions.length
          && !isSelectedPlatformServerless) && (
            <FormField
              className={styles.input_container}
              id="project.instance_type_id"
              label="Compute endpoint"
              {...fieldsCommonProps}
            >
              <Controller
                name="project.instance_type_id"
                control={formControl}
                render={() => (
                  <FormSelect
                    containerClassName={styles.input}
                    value={instanceTypeOptions.find(({ id }) => id === selectedInstanceType)}
                    onChange={(o: any) => onChangeInstanceType(o.id)}
                    options={instanceTypeOptions}
                    getOptionLabel={(o: InstanceType) => `${o.vcpu_count} ${o.vcpu_count === 1 ? 'core' : 'cores'} vCPU/${humanizeRam(o.memory_size)}GB memory`}
                    getOptionValue={(o: InstanceType) => o.id}
                  />
                )}
              />
            </FormField>
        )}
        {provisionerOptions.length > 1 && (
          <FormField
            className={styles.input_container}
            id="project.provisioner"
            label="Provisioner"
            {...fieldsCommonProps}
          >
            <Controller
              name="project.provisioner"
              control={formControl}
              render={({ field }) => (
                <>
                  {provisionerOptions.map((v) => (
                    <FormRadio
                      key={v}
                      name="project.provisioner"
                      value={v}
                      checked={field.value === v}
                      onChange={(e) => e.target.checked && (field.onChange(v))}
                    >
                      {v}
                    </FormRadio>
                  ))}
                </>
              )}
            />
          </FormField>
        )}
        {isCPUUnitsVisible
          && (
          <FormField
            label="CPU Units"
          >
            <Controller
              name="endpoint.cpu_units"
              control={formControl}
              rules={{
                shouldUnregister: true,
              }}
              render={({ field }) => (
                <CPUUnitsSlider
                  maxValue={maxAutoscalingLimit}
                  minValue={isFeatureEnabled('autoscaling_ui_next') ? CU_SCALE[0] : undefined}
                  isEditMinAvailable={isFeatureEnabled('autoscaling_ui_next')}
                  value={field.value}
                  disabled={isFreeUser}
                  onChange={(v) => field.onChange(v)}
                />
              )}
            />
          </FormField>
          )}
      </div>
    );
  },
);

ProjectFormFields.displayName = 'ProjectFormInstance';
