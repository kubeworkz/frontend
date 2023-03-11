import React from 'react';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';

import { SettingsHeader, SettingsDesc } from '../../../components/Settings/Settings';
import { apiErrorToaster } from '../../../api/utils';
import {
  ConfirmationPreset,
  createConfirmation,
  useConfirmation,
} from '../../../components/Confirmation/ConfirmationProvider';
import { Alert } from '../../../components/Alert/Alert';
import { Button } from '../../../components/Button/Button';
import { ConsoleRoutes } from '../../../routes/routes';
import { AnalyticsAction, useAnalytics } from '../../../utils/analytics';
import { ToastSuccess } from '../../../components/Toast/Toast';
import { apiService } from '../../../api/publicv2';
import { useProjectsItemContext } from '../../../app/hooks/projectsItem';
import { useProjectsContext } from '../../../app/hooks/projectsContext';
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
