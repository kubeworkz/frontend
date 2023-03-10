import React, { PropsWithChildren, useState } from 'react';
import { toast } from 'react-toastify';
import _ from 'lodash';
import {
  useForm, FormProvider, useFormContext, Controller,
} from 'react-hook-form';
import {
  AdminUser, internalApiService, UserSettings,
} from '#api_client/internal';
import { Alert } from '#shared/components/Alert/Alert';
import { ToastError } from '#shared/components/Toast/Toast';
import { apiErrorToaster } from '#api_client/utils';
import { Tabs } from '#shared/components/Tabs/Tabs';
import { FormField } from '#shared/components/Form/FormField/FormField';
import { FormInput } from '#shared/components/Form/FormInput/FormInput';
import { FormCheckbox } from '#shared/components/Form/FormCheckbox/FormCheckbox';
import { useConfirmation } from '#shared/components/Confirmation/ConfirmationProvider';
import { FormRadio } from '#shared/components/Form/FormRadio/FormRadio';
import { Hint } from '#shared/components/Hint/Hint';
import { settingsToJSON } from '../SettingsEditor/utils';
import { SettingsEditor } from '../SettingsEditor/SettingsEditor';

import styles from './UsersItemFormModal.module.css';

export interface FieldDescription {
  description: string;
  type: string;
  'x-form-order'?: number;
}

export interface UserSettingsFormSchema {
  features: {
    [key: string]: FieldDescription,
  },
  limits: {
    [key: string]: FieldDescription,
  },
}

interface FieldDescriptionRenderable extends FieldDescription {
  key: string;
}

export interface UserSettingsFormSchemaRenderable {
  features: Array<FieldDescriptionRenderable>,
  limits: Array<FieldDescriptionRenderable>,
}

export interface UsersItemFormProps {
  schema: UserSettingsFormSchema;
  user: AdminUser;
  onSubmit?: () => void;
  onDecline?: () => void;
}

const VIEW_OPTIONS = [
  {
    label: 'Form',
    value: 'form',
  },
  {
    label: 'JSON editor',
    value: 'json_editor',
  },
];

interface UsersItemFormSettingsJSONEditorProps {
  currentSettingsJSON: string;
  aceInputValue: string;
  onChangeValue(v: string): void;
  schema: UserSettingsFormSchemaRenderable;
}

const UsersItemFormSettingsJSONEditor = ({
  currentSettingsJSON,
  aceInputValue,
  onChangeValue,
  schema,
}: UsersItemFormSettingsJSONEditorProps) => {
  const currentVersionHasChanges = currentSettingsJSON !== aceInputValue;

  const comment = React.useMemo(() => `// Don't put comment into the right half of the editor because your json became invalid!
//
// {
//   "limits": {
${schema.limits.map(({ key, ...item }) => (item.description ? (`
    // ${item.description}
    // ${key}: ...`
  ) : (`
    // ${key}: ...\`
`))).join(',\n')}
//   },
//   "features": {
${schema.features.map(({ key, ...item }) => (item.description ? (`
    // ${item.description}
    // ${key}: ...`
  ) : (`
    // ${key}: ...\`
`))).join(',\n')}
//   }
// }

`, [schema]);

  return (
    <SettingsEditor
      leftTabValue={comment + currentSettingsJSON}
      leftTabLabel="current settings"
      rightTabValue={aceInputValue}
      rightTabLabel={`new settings${currentVersionHasChanges ? '*' : ''}`}
      rightTabActions={currentVersionHasChanges ? [
        {
          label: 'discard',
          onClick: () => onChangeValue(currentSettingsJSON),
        },
      ] : undefined}
      onChangeRightValue={onChangeValue}
    />
  );
};

interface UsersItemFormSettingsUIRowProps {
  fieldKey: string;
  description?: string;
  error?: string;
}

const UsersItemFormSettingsUIRow = ({
  fieldKey, error, children, description,
}: PropsWithChildren<UsersItemFormSettingsUIRowProps>) => {
  const {
    watch, control,
  } = useFormContext();

  const useDefault = watch('use_default');

  const key = fieldKey.split('.')[1];
  const label = key.replaceAll('_', ' ');

  return (
    <div className={styles.formRow}>
      <FormField
        id={`${fieldKey}_field`}
        label={description
          ? (
            <>
              {label}
              <Hint>{description}</Hint>
              :
            </>
          )
          : (
            <>
              {label}
              :
            </>
          )}
        labelClassName={styles.formLabel}
        inline
        error={!_.get(useDefault, fieldKey) && error}
      >
        {children}
      </FormField>
      <FormField
        id={`${fieldKey}_default`}
        label="use default"
        inline
        className={styles.default_checkbox}
      >
        <Controller
          name={`use_default.${fieldKey}`}
          control={control}
          render={({ field }) => (
            <FormCheckbox
              id={`${fieldKey}_default`}
              name={field.name}
              checked={field.value}
              onChange={(e) => field.onChange(e.target.checked)}
            />
          )}
        />
      </FormField>
    </div>
  );
};

const UsersItemFormSettingsUI = ({ schema }: { schema: UserSettingsFormSchemaRenderable }) => {
  const {
    register, watch, control,
  } = useFormContext();

  const useDefault = watch('use_default');
  const currentLimits = watch('settings.limits');

  return (
    <>
      <h3>Limits:</h3>
      {
        schema.limits.map(({ key, ...info }) => (
          <UsersItemFormSettingsUIRow
            key={key}
            fieldKey={`limits.${key}`}
            description={info.description}
            error={Number.isNaN(currentLimits[key]) ? 'should be a number' : undefined}
          >
            <FormInput
              {
                ...register(`settings.limits.${key}`, {
                  setValueAs: (v) => window.parseInt(v, 10),
                })
              }
              disabled={useDefault.limits[key] === true}
            />
          </UsersItemFormSettingsUIRow>
        ))
      }
      <h3>Features:</h3>
      {schema.features.map(({ key, ...info }) => (
        <UsersItemFormSettingsUIRow
          key={key}
          fieldKey={`features.${key}`}
          description={info.description}
        >
          <Controller
            name={`settings.features.${key}`}
            control={control}
            render={({ field }) => (
              <>
                <FormRadio
                  id={`features.${key}_enabled`}
                  radioGroup={field.name}
                  checked={field.value === true}
                  onChange={() => field.onChange(true)}
                  disabled={useDefault.features[key] === true}
                >
                  Enabled
                </FormRadio>
                <FormRadio
                  id={`features.${key}_disabled`}
                  radioGroup={field.name}
                  checked={field.value === false}
                  onChange={() => field.onChange(false)}
                  disabled={useDefault.features[key] === true}
                >
                  Disabled
                </FormRadio>
              </>
            )}
          />
        </UsersItemFormSettingsUIRow>
      ))}
    </>
  );
};

const calculateUseDefault = (currentSettings: UserSettings, schema: UserSettingsFormSchema) => ({
  limits: Object.fromEntries(Object.keys(schema.limits).map((key) => ([
    key,
    typeof _.get(currentSettings, `limits.${key}`) === 'undefined',
  ]))),
  features: Object.fromEntries(Object.keys(schema.features).map((key) => ([
    key,
    typeof _.get(currentSettings, `features.${key}`) === 'undefined',
  ]))),
});

const calculateSettings = (settings: any, useDefault: any, schema: UserSettingsFormSchema) => {
  const result = {};
  [
    ...Object.keys(schema.limits).map((key) => (`limits.${key}`)),
    ...Object.keys(schema.features).map((key) => (`features.${key}`)),
  ].forEach((key) => {
    if (!_.get(useDefault, key)) {
      const value = _.get(settings, key);
      _.set(result, key, value);
    }
  });
  return result;
};

const schemaObjectToArray = (schemaObj: {
  [key: string]: FieldDescription,
}) => Object.entries(schemaObj).map(([key, item]) => ({
  key,
  ...item,
})).sort((a, b) => {
  const aOrder = a['x-form-order'] || 0;
  const bOrder = b['x-form-order'] || 0;
  return aOrder - bOrder;
});

export const UsersItemFormSettings = ({ user, onSubmit, schema }: UsersItemFormProps) => {
  const { confirm } = useConfirmation();
  const currentSettingsJSON = settingsToJSON(user.settings_raw);

  const [currentView, setCurrentView] = useState(VIEW_OPTIONS[0].value);

  const [
    aceInputValue,
    setAceInputValue,
  ] = useState<string>(currentSettingsJSON);

  const form = useForm({
    mode: 'onChange',
    defaultValues: {
      settings: user.settings_raw,
      use_default: calculateUseDefault(user.settings_raw, schema),
    },
  });

  const onFormSubmit = React.useCallback((data: any) => {
    let newSettings = data.settings;
    if (currentView === 'json_editor') {
      try {
        newSettings = JSON.parse(aceInputValue);
      } catch (err) {
        toast(<ToastError body="Seems like a bad JSON" />);
        return;
      }
    }
    internalApiService.adminUpdateUser(user.id, {
      settings: newSettings,
    }).then(() => {
      if (onSubmit) {
        onSubmit();
      }
    }, apiErrorToaster);
  }, [user, onSubmit, aceInputValue]);

  const currentFormSettings = form.watch('settings');
  const isFormDirty = form.formState.isDirty;

  const onChangeView = (nextView: string) => {
    if (nextView === 'form' && aceInputValue !== currentSettingsJSON) {
      try {
        const settings = JSON.parse(aceInputValue);
        form.setValue('settings', settings);
        form.setValue('use_default', calculateUseDefault(settings, schema));
        setCurrentView(nextView);
      } catch (err) {
        confirm({
          header: 'The input is not a valid JSON',
          text: 'You will lose all progress when changing the form view',
        }).then(() => {
          setCurrentView(nextView);
        });
      }
    } else if (nextView === 'json_editor' && isFormDirty) {
      setAceInputValue(settingsToJSON(calculateSettings(currentFormSettings, form.getValues('use_default'), schema)));
      setCurrentView(nextView);
    } else {
      setCurrentView(nextView);
    }
  };

  const schemaRenderable = React.useMemo(() => ({
    features: schemaObjectToArray(schema.features),
    limits: schemaObjectToArray(schema.limits),
  }), [schema]);

  return (
    <div>
      <Alert>
        If you remove some prop from user settings, the default will be used.
      </Alert>
      <br />
      <FormProvider {...form}>
        <form id="user_edit" onSubmit={form.handleSubmit(onFormSubmit)} style={{ marginTop: '12px' }}>
          <Tabs
            options={VIEW_OPTIONS}
            value={currentView}
            onChange={onChangeView}
          />
          {currentView === 'json_editor'
            && (
            <UsersItemFormSettingsJSONEditor
              currentSettingsJSON={currentSettingsJSON}
              aceInputValue={aceInputValue}
              onChangeValue={setAceInputValue}
              schema={schemaRenderable}
            />
            )}
          {currentView === 'form'
          && (
            <UsersItemFormSettingsUI schema={schemaRenderable} />
          )}
        </form>
      </FormProvider>
    </div>
  );
};
