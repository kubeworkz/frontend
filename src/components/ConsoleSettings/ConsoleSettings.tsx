import React, { useState } from 'react';
import { SettingsDesc, SettingsPageHeader } from '../../components/Settings/Settings';
import { Alert } from '../../components/Alert/Alert';
import { GlobalSettingsTableRaw, internalApiService } from '../../api/internal';

import { apiErrorToaster } from '../../api/utils';
import { Button } from '../../components/Button/Button';
import { useConfirmation } from '../../components/Confirmation/ConfirmationProvider';
import { toast } from 'react-toastify';
import { ToastError } from '../../components/Toast/Toast';
import { SettingsEditor } from '../SettingsEditor/SettingsEditor';
import { settingsToJSON } from '../SettingsEditor/utils';
import { ConsoleSettingsVersionSelector } from './ConsoleSettingsVersionSelector/ConsoleSettingsVersionSelector';

interface ConsoleSettingsProps extends GlobalSettingsTableRaw {}

export const ConsoleSettings = (props: ConsoleSettingsProps) => {
  const { confirm } = useConfirmation();

  const [currentVersion, setCurrentVersion] = useState<GlobalSettingsTableRaw>(props);
  const [selectedVersion, setSelectedVersion] = useState<GlobalSettingsTableRaw>(props);
  const [
    aceInputValue,
    setAceInputValue,
  ] = useState<string>(settingsToJSON(selectedVersion.settings));

  const [options, setOptions] = useState<{ value: any, label: any }[]>([]);
  // const [isLoading, setIsLoading] = useState(true);

  const selectedSettingsJSON = React.useMemo(
    () => settingsToJSON(selectedVersion.settings),
    [selectedVersion],
  );
  const currentSettingsJSON = React.useMemo(
    () => settingsToJSON(currentVersion.settings),
    [currentVersion],
  );

  const updateOptions = React.useCallback(() => {
    internalApiService.adminGlobalSettingsIds().then(({ data }) => {
      setOptions(data.settings.map(({ id }) => ({
        value: id,
        label: id,
      })));
    });
  }, []);

  const onChangeVersion = React.useCallback((v: any) => {
    internalApiService.adminGlobalSettingsShow({ id: v })
      .then(({ data }) => {
        setSelectedVersion(data);
      });
  }, [aceInputValue, selectedSettingsJSON]);

  const onSave = React.useCallback(() => {
    try {
      const settings = JSON.parse(aceInputValue);
      confirm({
        text: "I solemnly swear that I've read the docs and I know what I'm doing.",
      }).then(() => {
        internalApiService.adminGlobalSettingsUpdate({
          last_seen_id: currentVersion.id,
          global_settings: settings,
        })
          .then(({ data }) => {
            setSelectedVersion(data);
            setCurrentVersion(data);
            updateOptions();
            onChangeVersion(data.id);
          })
          .catch(apiErrorToaster);
      });
    } catch (e) {
      toast(<ToastError body="Seems like a bad JSON" />);
    }
  }, [aceInputValue]);

  React.useEffect(updateOptions, []);

  const currentVersionHasChanges = currentSettingsJSON !== aceInputValue;

  return (
    <>
      <SettingsPageHeader>Settings</SettingsPageHeader>
      <SettingsDesc>
        <Alert appearance="warning">
          This is a dangerous sections. I hope you know what you are doing.
        </Alert>
      </SettingsDesc>
      <SettingsDesc>
        You can choose a settings version to compare your changes with.
        Change only the right column.
        Changes will be highlighted in both columns.
      </SettingsDesc>
      <SettingsDesc>
        <ConsoleSettingsVersionSelector
          currentVersion={selectedVersion.id}
          onChange={onChangeVersion}
          options={options}
        />
      </SettingsDesc>
      <SettingsDesc>
        <SettingsEditor
          leftTabValue={selectedSettingsJSON}
          leftTabLabel={`Settings, v${selectedVersion.id}`}
          leftTabActions={selectedVersion.id !== currentVersion.id ? [
            {
              label: 'use this version',
              onClick: () => setAceInputValue(selectedSettingsJSON),
            },
          ] : undefined}
          rightTabValue={aceInputValue}
          rightTabLabel={`Your version (v${currentVersion.id}${currentVersionHasChanges ? '*' : ''}):`}
          rightTabActions={currentVersionHasChanges ? [
            {
              label: 'discard',
              onClick: () => setAceInputValue(currentSettingsJSON),
            },
          ] : undefined}
          onChangeRightValue={setAceInputValue}
        />
      </SettingsDesc>
      <SettingsDesc>
        <Button
          onClick={onSave}
          disabled={!currentVersionHasChanges}
        >
          Save
        </Button>
      </SettingsDesc>
    </>
  );
};
