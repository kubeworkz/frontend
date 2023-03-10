import React from 'react';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';

import { SettingsHeader, SettingsDesc } from '#shared/components/Settings/Settings';
import { apiErrorToaster } from '#api_client/utils';
import {
  ConfirmationPreset,
  createConfirmation,
  useConfirmation,
} from '#shared/components/Confirmation/ConfirmationProvider';
import { Alert } from '#shared/components/Alert/Alert';
import { Button } from '#shared/components/Button/Button';
import { ConsoleRoutes } from '#shared/routes';
import { AnalyticsAction, useAnalytics } from '#shared/utils/analytics';
import { ToastSuccess } from '#shared/components/Toast/Toast';
import { apiService } from '#api_client/publicv2';
import { useProjectsItemContext } from '../../../hooks/projectsItem';
import { useProjectsContext } from '../../../hooks/projectsContext';
import { ProjectSettingsSectionProps } from '../types';

export const ProjectSettingsDelete = ({ disabled }: ProjectSettingsSectionProps) => {
  const { get } = useProjectsContext();
  const { projectId, project } = useProjectsItemContext();
  const { confirm } = useConfirmation();
  const { trackUiInteraction } = useAnalytics();
  const history = useHistory();

  const onClick = (e: any) => {
    e.preventDefault();
    trackUiInteraction(AnalyticsAction.ProjectSettingsDeleteProjectClicked);

    confirm(createConfirmation(
      ConfirmationPreset.DeleteProject,
      project,
    )).then(
      () => (
        apiService
          .deleteProject(projectId)
      ),
    ).then(() => {
      toast(
        <ToastSuccess
          header={(
            <>
              Project
              {' '}
              <b>{project?.name}</b>
              {' '}
              was successfully deleted
            </>
          )}
        />,
      );
      get();
      history.push(ConsoleRoutes.ProjectsList);
    }, apiErrorToaster);
  };

  return (
    <>
      <SettingsDesc>
        <SettingsHeader>
          Delete project
        </SettingsHeader>
      </SettingsDesc>
      <SettingsDesc>
        <Alert appearance="error">
          Permanently delete project
          {' '}
          <b>{project?.name}</b>
          . This action is not reversable, so please continue with caution.
        </Alert>
      </SettingsDesc>
      <SettingsDesc>
        <Button
          data-qa="delete-project-button"
          onClick={onClick}
          disabled={disabled}
          appearance="error"
        >
          Delete project
        </Button>
      </SettingsDesc>
    </>
  );
};
