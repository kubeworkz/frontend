import React, { ReactNode } from 'react';
import { generatePath, Link } from 'react-router-dom';

import { AdminBranch } from '#api_client/internal';
import { PageHeader } from '#shared/components/PageHeader/PageHeader';
import { Text } from '#shared/components/Text/Text';

import { humanReadableBytes, secondsToHours } from '#shared/utils/units';
import { AdminRoutes } from '../../config/routes';

interface BranchesItemProps {
  branch: AdminBranch;
}

export const BranchesItem = ({ branch }: BranchesItemProps) => {
  if (!branch) {
    return null;
  }

  return (
    <>
      <PageHeader
        header={`Branch id: ${branch.id}`}
      />
      <table>
        <tbody>
          {Object.entries(branch).map(([key, value]) => {
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
            } else if (['compute_time', 'active_time'].includes(key)) {
              inner = (
                <Text title={value}>
                  {secondsToHours(value)}
                  {' '}
                  hour(s)
                </Text>
              );
            } else if (['written_size', 'logical_size', 'physical_size', 'data_transfer'].includes(key)) {
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
                to={`${AdminRoutes.OperationsList}?branch_id=${branch.id}`}
              >
                operations
              </Text>
              <br />
              <Text
                as={Link}
                to={`${AdminRoutes.EndpointsList}?branch_id=${branch.id}`}
              >
                endpoints
              </Text>
            </td>
          </tr>
        </tbody>
      </table>
    </>
  );
};
