import React, { ReactNode } from 'react';
import { generatePath, Link } from 'react-router-dom';

import { AdminEndpoint } from '../../api/internal';
import { PageHeader } from '../../components/PageHeader/PageHeader';
import { Text } from '../../components/Text/Text';

import { humanReadableBytes, secondsToHours } from '../../utils/units';
import { AdminRoutes } from '../../admin/config/routes';

interface EndpointItemProps {
  endpoint: AdminEndpoint;
}

export const EndpointsItem = ({ endpoint }: EndpointItemProps) => {
  if (!endpoint) {
    return null;
  }

  return (
    <>
      <PageHeader
        header={`Endpoint id: ${endpoint.id}`}
      />
      <table>
        <tbody>
          {Object.entries(endpoint).map(([key, value]) => {
            let inner: ReactNode = typeof value === 'string' ? value : JSON.stringify(value);

            if (key === 'project_id') {
              inner = (
                <Text
                  as={Link}
                  to={generatePath(AdminRoutes.ProjectsItem, { projectId: value })}
                >
                  {value}
                </Text>
              );
            } else if (key === 'branch_id') {
              inner = (
                <Text
                  as={Link}
                  to={generatePath(AdminRoutes.BranchesItem, { branchId: value })}
                >
                  {value}
                </Text>
              );
            } else if (['compute_time', 'active_time'].includes(key)) {
              inner = (
                <Text title={value}>
                  {secondsToHours(value)}
                  {' '}
                  hour(s)
                </Text>
              );
            } else if (['data_transfer'].includes(key)) {
              inner = (
                <Text title={value}>
                  {humanReadableBytes(value)}
                </Text>
              );
            } else if (key === 'metrics_collected_at') {
              inner = (
                <Text>
                  <pre style={{ whiteSpace: 'pre-wrap', maxWidth: '100%' }}>{JSON.stringify(value, null, 2)}</pre>
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
                to={`${AdminRoutes.OperationsList}?endpoint_id=${endpoint.id}`}
              >
                operations
              </Text>
            </td>
          </tr>
        </tbody>
      </table>
    </>
  );
};
