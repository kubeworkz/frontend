import React from 'react';
import { generatePath } from 'react-router-dom';

import { Project } from '#api_client/publicv2';
import { ActionsDropdown } from '#shared/components/ActionsDropdown/ActionsDropdown';
import { ActionsDropdownItem } from '#shared/components/ActionsDropdown/ActionDropdownItem/ActionsDropdownItem';
import { ConsoleRoutes } from '#shared/routes';

import { AnalyticsAction, useAnalytics } from '#shared/utils/analytics';

export type ProjectActionsProps = {
  project: Project;
};

export const ProjectActions = ({ project }: ProjectActionsProps) => {
  const { trackUiInteraction } = useAnalytics();

  return (
    <ActionsDropdown
      data-qa="project-actions"
      aria-label={`Actions with project ${project.name}`}
      onOpenEventId={AnalyticsAction.ProjectListItemMenuOpened}
    >
      <ActionsDropdownItem
        iconName="projects-nav-dashboard_20"
        data-qa="project-dashboard-link"
        to={generatePath(ConsoleRoutes.ProjectsItem, { projectId: project.id })}
        onClick={() => trackUiInteraction(AnalyticsAction.ProjectListItemMenuDashboardClicked)}
      >
        Dashboard
      </ActionsDropdownItem>
      <ActionsDropdownItem
        iconName="projects-nav-sql-editor_20"
        data-qa="project-sql-editor-link"
        to={generatePath(ConsoleRoutes.ProjectsItemQuery, { projectId: project.id })}
        onClick={() => trackUiInteraction(AnalyticsAction.ProjectListItemMenuSqlEditorClicked)}

      >
        SQL Editor
      </ActionsDropdownItem>
      <ActionsDropdownItem
        iconName="projects-nav-settings_20"
        data-qa="project-settings-link"
        to={generatePath(ConsoleRoutes.ProjectsItemSettings, { projectId: project.id })}
        onClick={() => trackUiInteraction(AnalyticsAction.ProjectListItemMenuSettingsClicked)}
      >
        Settings
      </ActionsDropdownItem>
    </ActionsDropdown>
  );
};
