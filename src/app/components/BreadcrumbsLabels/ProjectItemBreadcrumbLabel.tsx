import React from 'react';
import { Loader } from '#shared/components/Loader/Loader';
import { useProjectsItemContext } from '../../hooks/projectsItem';

export const ProjectItemBreadcrumbLabel = () => {
  const { isLoading, project } = useProjectsItemContext();

  if (isLoading) {
    return <Loader />;
  }

  if (project) {
    return <>{project.name}</>;
  }

  return <></>;
};
