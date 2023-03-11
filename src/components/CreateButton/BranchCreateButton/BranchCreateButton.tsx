import React from 'react';
import { Button, ButtonProps } from '../../../components/Button/Button';
import { AnyLink } from '../../../components/AnyLink/AnyLink';
import { ConsoleRoutes } from '../../../routes/routes';
import { generatePath } from 'react-router-dom';
import { AnalyticsAction } from '../../../utils/analytics';
import { Tippy } from '../../../components/Tippy/Tippy';
import { Branch } from '../../../api/publicv2';
import { useProjectsItemContext } from '../../../app/hooks/projectsItem';
import { getLimitsLabel, useUserBranchesLimit } from '../../../app/hooks/userLimits';

interface BranchCreateButtonProps extends ButtonProps {
  parentId?: Branch['id']
}

export const BranchCreateButton = ({ children = 'New Branch', parentId, ...props }: BranchCreateButtonProps) => {
  const { projectId } = useProjectsItemContext();
  const limitsData = useUserBranchesLimit();

  if (limitsData.isLoading) {
    return null;
  }

  const limitsLabel = getLimitsLabel(limitsData);

  const path = generatePath(ConsoleRoutes.ProjectsItemBranchesNew, { projectId });

  const button = (
    <Button
      {...props}
      disabled={limitsData.isLimitExceeded}
    >
      {children}
      {limitsLabel ? ` ${limitsLabel}` : ''}
    </Button>
  );

  return (
    <Tippy
      content={limitsData.message}
      placement="bottom"
      disabled={!limitsData.message}
    >
      <div style={{ display: 'inline-block' }}>
        {
          limitsData.isLimitExceeded
            ? button
            : (
              <AnyLink
                to={parentId ? `${path}?parentId=${parentId}` : path}
                trackClick={AnalyticsAction.CreateBranchButtonClicked}
              >
                {button}
              </AnyLink>
            )
        }
      </div>
    </Tippy>
  );
};
