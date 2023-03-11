import React, { HTMLAttributes } from 'react';
import { Widget } from '../../../components/Widget/Widget';
import { WidgetBody } from '../../../components/Widget/WidgetBody';
import { Button } from '../../../components/Button/Button';
import { ConsoleRoutes } from '../../../routes/routes';
import { generatePath, Link } from 'react-router-dom';
import classNames from 'classnames';
import { CodeBlock } from '../../../components/Code/Code';
import { AnalyticsAction, useAnalytics } from '../../../utils/analytics';
import { Loader } from '../../../components/Loader/Loader';
import { useProjectsItemContext } from '../../../app/hooks/projectsItem';
import { ProjectWidgetPlaceholder } from '../ProjectWidgetPlaceholder/ProjectWidgetPlaceholder';

import styles from './ProjectPostgresWidget.module.css';

export const ProjectPostgresWidget = (props: HTMLAttributes<HTMLDivElement>) => {
  const { projectId, isLoading, project } = useProjectsItemContext();
  const { trackUiInteraction } = useAnalytics();

  if (isLoading) {
    return <ProjectWidgetPlaceholder />;
  }

  return (
    <Widget
      {...props}
      title="Postgres configuration"
    >
      <WidgetBody>
        <div className={classNames(styles.row, styles.row_pg_version)}>
          <CodeBlock>
            PostgreSQL version:
            {' '}
            <b>{project ? project.pg_version : <Loader />}</b>
          </CodeBlock>
        </div>
        <div className={classNames(styles.row, styles.row_actions)}>
          <div className={styles.action}>
            <Button
              as={Link}
              to={generatePath(ConsoleRoutes.ProjectsItemSettingsDatabases, { projectId })}
              icon="database_40"
              appearance="default"
              onClick={() => (
                trackUiInteraction(AnalyticsAction.PostgresWidgetManageDatabasesClicked)
              )}
            >
              Manage databases
            </Button>
          </div>
          <div className={styles.action}>
            <Button
              as={Link}
              to={generatePath(ConsoleRoutes.ProjectsItemRoles, { projectId })}
              icon="person_40"
              appearance="default"
              onClick={() => trackUiInteraction(AnalyticsAction.PostgresWidgetManageUsersClicked)}
            >
              Manage roles
            </Button>
          </div>
        </div>
      </WidgetBody>
    </Widget>
  );
};
