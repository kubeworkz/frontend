import React from 'react';
import { PageHeader } from '#shared/components/PageHeader/PageHeader';
import { Text } from '#shared/components/Text/Text';
import { Link } from 'react-router-dom';
import { AdminSafekeeper } from '#api_client/generated/api';
import { AdminRoutes } from '../../config/routes';
import {
  createSafekeeperInstanceLogsUrl,
  GrafanaLink,
} from '../GrafanaLink/GrafanaLink';
import { GrafanaConfig } from '../AdminApp/types';

interface SafekeepersItemProps {
  safekeeper: AdminSafekeeper;
  grafana: GrafanaConfig;
}

export const SafekeepersItem = ({ safekeeper, grafana }: SafekeepersItemProps) => {
  if (!safekeeper) {
    return null;
  }

  return (
    <>
      <PageHeader
        header={`Safekeeper id: ${safekeeper.id}`}
      />
      <table>
        {Object.entries(safekeeper).map(([key, value]) => {
          const inner: React.ReactNode = typeof value === 'string' ? value : JSON.stringify(value);

          return (
            <tr key={key}>
              <th align="right">{key}</th>
              <td>{inner}</td>
            </tr>
          );
        })}
        <tr>
          <th />
          <td>
            <Text
              as={Link}
              to={{
                pathname: AdminRoutes.ProjectsList,
                search: `?safekeeper_id=${safekeeper.id}`,
              }}
            >
              projects
            </Text>
          </td>
        </tr>
        <tr>
          <th />
          <td>
            <GrafanaLink href={createSafekeeperInstanceLogsUrl(grafana, safekeeper.host)}>
              Logs
            </GrafanaLink>
          </td>
        </tr>
      </table>
    </>
  );
};
