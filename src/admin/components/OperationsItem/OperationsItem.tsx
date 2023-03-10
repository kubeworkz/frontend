import React from 'react';
import { generatePath, Link } from 'react-router-dom';
import { PageHeader } from '#shared/components/PageHeader/PageHeader';
import { Text } from '#shared/components/Text/Text';
import { Operation } from '../types';
import { AdminRoutes } from '../../config/routes';
import { createOpsLogsUrl, GrafanaLink } from '../GrafanaLink/GrafanaLink';
import { AdminAppProps } from '../AdminApp/types';

interface OperationsItemProps extends AdminAppProps {
  operation: Operation;
}

export const OperationsItem = ({ operation, grafana, consoleEnv }: OperationsItemProps) => {
  if (!operation) {
    return null;
  }

  return (
    <>
      <PageHeader
        header={(
          <>
            Operation id:
            {' '}
            {operation.id}
            ,
            <GrafanaLink
              href={createOpsLogsUrl(grafana, consoleEnv, operation)}
              style={{ marginLeft: '5px' }}
            >
              logs
            </GrafanaLink>
          </>
)}
      />
      <table>
        <tbody>
          {Object.entries(operation).map(([key, value]) => {
            let inner: React.ReactNode = typeof value === 'string'
              ? value : JSON.stringify(value, null, 2);

            if (key === 'project_id') {
              inner = (
                <Text
                  as={Link}
                  to={generatePath(AdminRoutes.ProjectsItem,
                    { projectId: operation.project_id.toString() })}
                >
                  {operation.project_id}
                </Text>
              );
            } else if (key === 'branch_id' && operation.branch_id) {
              inner = (
                <Text
                  as={Link}
                  to={generatePath(AdminRoutes.BranchesItem,
                    { branchId: operation.branch_id.toString() })}
                >
                  {operation.branch_id}
                </Text>
              );
            } else if (key === 'endpoint_id' && operation.endpoint_id) {
              inner = (
                <Text
                  as={Link}
                  to={generatePath(AdminRoutes.EndpointsItem,
                    { endpointId: operation.endpoint_id.toString() })}
                >
                  {operation.endpoint_id}
                </Text>
              );
            }

            return (
              <tr key={key}>
                <th align="right">{key}</th>
                <td><pre style={{ whiteSpace: 'pre-wrap', maxWidth: '100%' }}>{inner}</pre></td>
              </tr>
            );
          })}
          <tr>
            <th />
            <td />
          </tr>
        </tbody>
      </table>
    </>
  );
};
