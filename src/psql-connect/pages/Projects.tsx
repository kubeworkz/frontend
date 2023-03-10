import React from 'react';
import { ProjectsList } from '../components/ProjectsList/ProjectsList';
import { useConnectAppContext } from '../context/connectApp';

export const Projects = () => {
  const { projects } = useConnectAppContext();

  return (
    <ProjectsList
      projects={projects}
    />
  );
};
