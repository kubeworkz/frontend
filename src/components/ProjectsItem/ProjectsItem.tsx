import React from 'react';
import { PageHeader } from '#shared/components/PageHeader/PageHeader';
import { Text } from '#shared/components/Text/Text';
import { Button } from '#shared/components/Button/Button';
import { generatePath, Link } from 'react-router-dom';
import { AdminProject } from '#api_client/internal';
import { humanReadableBytes, secondsToHours } from '#shared/utils/units';
import { Safekeeper } from '../types';
import { AdminRoutes } from '../../config/routes';
import {
  createTimelineLogsUrl,
  GrafanaLink,
} from '../GrafanaLink/GrafanaLink';
import { ProjectsItemFormModal } from '../ProjectsItemForm/ProjectsItemFormModal';
import { SafekeeperLink } from '../SafekeeperLink/SafekeeperLink';
import { PageserverLink } from '../PageserverLink/PageserverLink';
import { UserLink } from '../UserLink/UserLink';
import { GrafanaConfig } from '../AdminApp/types';

interface ProjectsItemProps {
  project: AdminProject;
  grafana: GrafanaConfig;
}

export const ProjectsItem = ({ project, grafana }: ProjectsItemProps) => {
  const [isEditing, setIsEditing] = React.useState(false);

  if (!project) {
    return null;
  }

  return (
    <>
      { isEditing
        && (
        <ProjectsItemFormModal
          project={project}
          onDecline={() => setIsEditing(false)}
          onSubmit={() => {
            window.location.reload();
          }}
        />
        )}
      <PageHeader
        header={`Project id: ${project.id}`}
      />
      <table>
        <tbody>
          {Object.entries(project).map(([key, value]) => {
            let inner: React.ReactNode = typeof value === 'string' ? value : JSON.stringify(value);

            if (key === 'user_id') {
              inner = (
                <UserLink id={value}>
                  <Text
                    as={Link}
                    to={generatePath(AdminRoutes.UsersItem, { userId: value })}
                  >
                    {value}
                  </Text>
                </UserLink>
              );
            } else if (key === 'pageserver_id') {
              inner = (
                <PageserverLink id={value}>
                  <Text
                    as={Link}
                    to={generatePath(AdminRoutes.PageserversItem, { pageserverId: value })}
                  >
                    {value}
                  </Text>
                </PageserverLink>
              );
            } else if (key === 'safekeepers') {
              inner = value ? value.map((s: Safekeeper & { link: string }, index: number) => (
                <React.Fragment key={`safekeeper_${s.id}`}>
                  <SafekeeperLink id={s.id}>
                    <Text
                      as={Link}
                      to={generatePath(AdminRoutes.SafekeepersItem, { safekeeperId: s.id })}
                    >
                      {s.id}
                    </Text>
                  </SafekeeperLink>
                  {index < value.length - 1 && ', '}
                </React.Fragment>
              )) : null;
            } else if (key === 'timeline_id') {
              inner = !!value && (
                <>
                  {value}
                  {' '}
                  <GrafanaLink href={createTimelineLogsUrl(grafana, value)}>
                    Logs
                  </GrafanaLink>
                </>
              );
            } else if (['compute_time', 'active_time'].indexOf(key) !== -1) {
              inner = (
                <Text title={value}>
                  {secondsToHours(value)}
                  {' '}
                  hour(s)
                </Text>
              );
            } else if (['resident_size', 'logical_size', 'remote_storage_size', 'synthetic_storage_size', 'data_transfer'].indexOf(key) !== -1) {
              inner = (
                <Text title={value}>
                  {humanReadableBytes(value)}
                </Text>
              );
            } else if (key === 'data_storage') {
              inner = (
                <Text title="data_storage">
                  {humanReadableBytes(value)}
                  -Hours
                </Text>
              );
            } else if (['metrics_collected_at'].includes(key)) {
              inner = (
                <Text>
                  <pre style={{ whiteSpace: 'pre-wrap', maxWidth: '100%' }}>{JSON.stringify(value, null, 2)}</pre>
                </Text>
              );
            } else if (key === 'max_project_size') {
              inner = (
                <Text>
                  {`${value} MB`}
                </Text>
              );
            }

            return (
              <tr key={key}>
                <th align="right">{key}</th>
                <td>{inner}</td>
              </tr>
            );
          })}
          <tr>
            <td />
            <td>
              <Text
                as={Link}
                to={`${AdminRoutes.OperationsList}?project_id=${project.id}`}
              >
                operations
              </Text>
              <br />
              <Text
                as={Link}
                to={`${AdminRoutes.BranchesList}?project_id=${project.id}`}
              >
                branches
              </Text>
              <br />
              <Text
                as={Link}
                to={`${AdminRoutes.EndpointsList}?project_id=${project.id}`}
              >
                endpoints
              </Text>
            </td>
          </tr>
          <tr>
            <td />
            <td>
              <Button
                appearance="secondary"
                onClick={() => setIsEditing(true)}
              >
                Edit
              </Button>
            </td>
          </tr>
        </tbody>
      </table>
    </>
  );
};
