import React from 'react';
import { PageHeader } from '../../components/PageHeader/PageHeader';
import { Text } from '../../components/Text/Text';
import { Link } from 'react-router-dom';
import { AdminPageserver } from '../../api/generated/api';
import { AdminRoutes } from '../../admin/config/routes';
import {
  createPageserverInstanceLogsUrl,
  GrafanaLink,
} from '../GrafanaLink/GrafanaLink';
import { GrafanaConfig } from '../AdminApp/types';

interface PageserversItemProps {
  pageserver: AdminPageserver;
  grafana: GrafanaConfig;
}

export const PageserversItem = ({ pageserver, grafana }: PageserversItemProps) => {
  if (!pageserver) {
    return null;
  }

  return (
    <>
      <PageHeader
        header={`Pageserver id: ${pageserver.id}`}
      />
      <table>
        {Object.entries(pageserver).map(([key, value]) => (
          <tr>
            <th align="right">{key}</th>
            <td>{typeof value === 'string' ? value : JSON.stringify(value)}</td>
          </tr>
        ))}
        <tr>
          <th />
          <td>
            <Text as={Link} to={`${AdminRoutes.ProjectsList}?pageserver_id=${pageserver.id}`}>Projects</Text>
          </td>
        </tr>
        <tr>
          <th />
          <td>
            <GrafanaLink href={createPageserverInstanceLogsUrl(grafana, pageserver.host)}>
              Logs
            </GrafanaLink>
          </td>
        </tr>
      </table>
    </>
  );
};
