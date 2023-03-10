import React from 'react';
import { Loader } from '#shared/components/Loader/Loader';
import { useBranches } from '#shared/hooks/projectBranches';
import { useRouteMatch } from 'react-router-dom';
import { ConsoleRoutes } from '#shared/routes';

export const BranchItemBreadcrumbLabel = () => {
  const { isLoading, branchesById } = useBranches();
  const match = useRouteMatch<{ branchId?: string }>(ConsoleRoutes.ProjectsItemBranchesItem);

  if (isLoading) {
    return <Loader />;
  }

  if (!match || !match.params.branchId) {
    return <></>;
  }

  if (branchesById[match.params.branchId]) {
    return <>{branchesById[match.params.branchId].name}</>;
  }

  return <>{match.params.branchId}</>;
};
