import React, { useMemo } from 'react';

import { generatePath } from 'react-router-dom';
import { ConsoleRoutes } from '../../../routes/routes';
import { useHistory } from 'react-router';
import { useGoBack } from '../../../hooks/useGoBack';
import { useProjectsItemContext } from '../../hooks/projectsItem';
import { BranchForm } from '../../../components/BranchForm/BranchForm';

export const ProjectsBranchesNew = () => {
  const { projectId } = useProjectsItemContext();
  const history = useHistory();
  const parentId = useMemo(() => (new URLSearchParams(history.location.search)).get('parentId') ?? undefined,
    []);

  const goBack = useGoBack(generatePath(ConsoleRoutes.ProjectsItemBranches, {
    projectId,
  }));

  return (
    <BranchForm
      parentId={parentId}
      onSuccess={(branch) => history.replace(
        generatePath(ConsoleRoutes.ProjectsItemBranchesItem, {
          projectId,
          branchId: branch.id,
        }),
      )}
      onCancel={goBack}
    />
  );
};
