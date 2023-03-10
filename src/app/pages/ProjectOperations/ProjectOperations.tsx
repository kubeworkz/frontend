import React from 'react';
import { DataTable } from '../../../components/DataTable/DataTable';
import { Text } from '../../../components/Text/Text';
import { PageError } from '../../../components/PageError/PageError';
import { OperationStatusBadge } from '../../../components/OperationStatusBadge/OperationStatusBadge';
import { OperationStatus, Operation } from '../../../api/publicv2';
import { formatDate } from '../../../utils/formatDate';
import emptyImg from '/images/error_elephant_light.webp';
import { generatePath, NavLink } from 'react-router-dom';
import { ConsoleRoutes } from '../../../routes/routes';
import { AnalyticsAction, useAnalytics } from '../../../utils/analytics';
import { useBranches } from '../../../hooks/projectBranches';
import { Button } from '../../../components/Button/Button';
import { formatOpDuration } from '../../../utils/units';
import { useOperationsContext } from '../../hooks/operationsContext';
import { useProjectsItemContext } from '../../hooks/projectsItem';
import { formatOperationAction } from '../../utils/formatOperationAction';

export const ProjectOperations = () => {
  const { projectId } = useProjectsItemContext();
  const {
    state: { operations, isLoading, error },
  } = useOperationsContext();
  const { branchesById } = useBranches();
  const { trackUiInteraction } = useAnalytics();

  if ((!operations || !operations.length) && !isLoading) {
    return (
      <PageError
        title="You don’t have any operations yet"
        imgSrc={emptyImg}
      />
    );
  }

  return (
    <>
      <DataTable
        isLoading={isLoading || typeof operations === 'undefined'}
        error={error}
        cols={[
          { key: 'action', label: 'Action', renderValue: formatOperationAction },
          {
            key: 'branch_id',
            label: 'Branch',
            renderValue: (op: Operation) => (
              op.branch_id
                ? (
                  <Button
                    appearance="default"
                    as={NavLink}
                    to={generatePath(ConsoleRoutes.ProjectsItemBranchesItem, {
                      projectId,
                      branchId: op.branch_id,
                    })}
                    onClick={
                      () => trackUiInteraction(AnalyticsAction.ProjectOperationsBranchLinkClicked)
                    }
                  >
                    <b>{branchesById[op.branch_id]?.name}</b>
                  </Button>
                )
                : '-'
            ),
          },
          {
            key: 'status',
            label: 'Status',
            renderValue: (op) => (
              <OperationStatusBadge status={op.status} />
            ),
          },
          {
            key: 'id',
            label: 'Duration',
            renderValue: (op) => (
              [OperationStatus.Finished, OperationStatus.Failed].includes(op.status)
              && (
              <Text>
                {formatOpDuration(op)}
              </Text>
              )
            ),
          },
          {
            key: 'created_at',
            label: 'Date',
            renderValue: (op) => (
              <Text
                appearance="secondary"
              >
                {formatDate(op.created_at)}
              </Text>
            ),
          },
        ]}
        data={operations}
      />
    </>
  );
};
