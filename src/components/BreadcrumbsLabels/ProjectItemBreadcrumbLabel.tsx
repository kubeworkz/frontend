import React from 'react';
import { Loader } from '../../components/Loader/Loader';
import { useProjectsItemContext } from '../../app/hooks/projectsItem';

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
