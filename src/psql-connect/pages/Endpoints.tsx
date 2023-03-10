import React from 'react';
import { useLocation } from 'react-router-dom';

import { Project } from '#api_client/publicv2';
import { BranchesProvider } from '#shared/hooks/projectBranches';
import { PageError } from '#shared/components/PageError/PageError';

import { EndpointsList } from '../components/EndpointsList/EndpointsList';
import { useConnectAppContext } from '../context/connectApp';

export const Endpoints = () => {
  const { onConnectEndpoint } = useConnectAppContext();
  const location = useLocation<{ project: Project | undefined }>();
  const project = location.state?.project;

  return (
    <>
      {project ? (
        <BranchesProvider projectId={project?.id}>
          <EndpointsList
            project={project}
            onSubmit={onConnectEndpoint}
          />
        </BranchesProvider>
      ) : <PageError />}
    </>
  );
};
