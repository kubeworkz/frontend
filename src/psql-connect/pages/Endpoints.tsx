import { useLocation } from 'react-router-dom';

import { Project } from '../../api/publicv2';
import { BranchesProvider } from '../../hooks/projectBranches';
import { PageError } from '../../components/PageError/PageError';

import { EndpointsList } from '../../components/EndpointsList/EndpointsList';
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
