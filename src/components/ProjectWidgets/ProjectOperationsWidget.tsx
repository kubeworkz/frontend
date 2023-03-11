import React, { HTMLAttributes } from 'react';
import { Widget } from '../../components/Widget/Widget';
import { WidgetBody } from '../../components/Widget/WidgetBody';
import { WidgetTable } from '../../components/Widget/WidgetTable';
import { OperationStatusBadge } from '../../components/OperationStatusBadge/OperationStatusBadge';
import { generatePath, NavLink } from 'react-router-dom';
import { Text } from '../../components/Text/Text';
import { formatDate } from '../../utils/formatDate';
import { ConsoleRoutes } from '../../routes/routes';
import { AnalyticsAction, useAnalytics } from '../../utils/analytics';
import { useBranches } from '../../hooks/projectBranches';
import { Button } from '../../components/Button/Button';
import { useOperationsContext } from '../../app/hooks/operationsContext';
import { useProjectsItemContext } from '../../app/hooks/projectsItem';
import { formatOperationAction } from '../../utils/formatOperationAction';
import { ProjectWidgetPlaceholder } from './ProjectWidgetPlaceholder/ProjectWidgetPlaceholder';

export const ProjectOperationsWidget = (props: HTMLAttributes<HTMLDivElement>) => {
  const { projectId, isLoading: isProjectLoading } = useProjectsItemContext();
  const { state: { operations, isLoading: isOperationsLoading, error } } = useOperationsContext();
  const { trackUiInteraction } = useAnalytics();
  const { branchesById } = useBranches();

  const isLoading = isProjectLoading || isOperationsLoading;

  let inner = <Text appearance="secondary">Something went wrong</Text>;

  if (isLoading) {
    return <ProjectWidgetPlaceholder />;
  }

  if (error) {
    inner = (
      <Text appearance="secondary">
        {error}
      </Text>
    );
  } else if (!operations || !operations.length) {
    inner = (
      <Text appearance="secondary">
        There are no operations yet
      </Text>
    );
  } else if (operations.length) {
    inner = (
      <WidgetTable>
        <tr>
          <th>
            Action
          </th>
          <th>
            Branch
          </th>
          <th>
            Date
          </th>
          <th style={{ textAlign: 'left' }}>
            Status
          </th>
        </tr>
        {operations.slice(0, 5).map((op) => (
          <tr key={op.id}>
            <td>
              <b>{formatOperationAction(op)}</b>
            </td>
            <td>
              {op.branch_id ? (
                <Button
                  appearance="default"
                  as={NavLink}
                  to={generatePath(ConsoleRoutes.ProjectsItemBranchesItem, {
                    projectId,
                    branchId: op.branch_id,
                  })}
                  onClick={
                    () => trackUiInteraction(AnalyticsAction.OperationsWidgetBranchLinkClicked)
                  }
                >
                  <b>{branchesById[op.branch_id]?.name}</b>
                </Button>
              ) : '-'}
            </td>
            <td>
              {formatDate(op.created_at)}
            </td>
            <td style={{ textAlign: 'left' }}>
              <OperationStatusBadge status={op.status} />
            </td>
          </tr>
        ))}
      </WidgetTable>
    );
  }

  return (
    <Widget
      {...props}
      title="Operations"
      links={[
        {
          children: 'Show all',
          to: generatePath(ConsoleRoutes.ProjectsItemOperations, { projectId }),
          onClick: () => trackUiInteraction(AnalyticsAction.OperationsWidgetShowAllClicked),
        },
      ]}
    >
      <WidgetBody>
        {inner}
      </WidgetBody>
    </Widget>
  );
};
