import React, { HTMLAttributes } from 'react';
import { Widget } from '../../../components/Widget/Widget';
import { WidgetBody } from '../../../components/Widget/WidgetBody';
import { WidgetTable } from '../../../components/Widget/WidgetTable';
import { generatePath, NavLink } from 'react-router-dom';
import { ConsoleRoutes } from '../../../routes/routes';
import { Button } from '../../../components/Button/Button';
import { AnalyticsAction, useAnalytics } from '../../../utils/analytics';
import { useBranches } from '../../../hooks/projectBranches';
import { BranchPrimaryBadgeConditional } from '../../../components/BranchPrimaryBadgeConditional/BranchPrimaryBadgeConditional';
import { useProjectsItemContext } from '../../../app/hooks/projectsItem';
import { ProjectWidgetPlaceholder } from '../ProjectWidgetPlaceholder/ProjectWidgetPlaceholder';
import { BranchEndpointStatus } from '../../BranchEndpointStatus/BranchEndpointStatus';
import { BranchUsedSize } from '../../BranchSize/BranchSize';

export const ProjectBranchesWidget = (props: HTMLAttributes<HTMLDivElement>) => {
  const { trackUiInteraction } = useAnalytics();
  const { projectId, project, isLoading: isProjectLoading } = useProjectsItemContext();
  const { branches, isLoading: isBranchesLoading } = useBranches();

  const isLoading = isProjectLoading || isBranchesLoading;

  if (isLoading) {
    return <ProjectWidgetPlaceholder />;
  }

  return (
    <Widget
      {...props}
      title="Branches"
      links={[
        {
          children: 'Manage',
          to: generatePath(ConsoleRoutes.ProjectsItemBranches, { projectId }),
          onClick: () => trackUiInteraction(AnalyticsAction.BranchesWidgetGoToBranchesListClicked),
        },
      ]}
    >
      <WidgetBody>
        <WidgetTable>
          <tr>
            <th style={{ width: '50%' }}>Name</th>
            <th style={{ width: '25%' }}>Compute endpoint</th>
            <th style={{ width: '25%' }}>Used space</th>
          </tr>
          {branches.slice(0, 5).map((branch) => (
            <tr key={branch.id}>
              <td>
                <Button
                  appearance="default"
                  style={{ display: 'inline-block' }}
                  as={NavLink}
                  to={generatePath(ConsoleRoutes.ProjectsItemBranchesItem, {
                    projectId,
                    branchId: branch.id,
                  })}
                  onClick={
                    () => trackUiInteraction(AnalyticsAction.BranchesWidgetGoToBranchPageClicked)
                  }
                >
                  <b>{branch.name}</b>
                  <BranchPrimaryBadgeConditional branch={branch} />
                </Button>
              </td>
              <td>
                <BranchEndpointStatus branchId={branch.id} />
              </td>
              <td>
                <BranchUsedSize branch={branch} project={project} />
              </td>
            </tr>
          ))}
        </WidgetTable>
      </WidgetBody>
    </Widget>
  );
};
