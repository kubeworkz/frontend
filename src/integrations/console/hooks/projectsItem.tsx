import React, {
  createContext, PropsWithChildren, useCallback, useState,
} from 'react';
import { Project, apiService } from '../../../api/publicv2';
import { debounceApiRequest } from '../../../api/utils';
import { getNewestData, useSubscription, UseSubscriptionReturns } from '../../../hooks/actionCable';
import { createUseContext } from '../../../hooks/utils';
// import { Loader } from '../../../components/Loader/Loader';
// import { Text } from '../../../components/Text/Text';
import { BranchesProvider } from '../../../hooks/projectBranches';
import { SelectedBranchProvider } from './selectedBranchProvider';
import { ProjectEndpointsProvider } from './projectEndpoints';
import { useProjectsContext } from './projectsContext';

interface ProjectsItemContextInterface extends UseSubscriptionReturns {
  projectId: Project['id'];
  project?: Project;
  isLoading: boolean;
  error?: string;
  delete: () => Promise<Project>;
  get(): void;
}

const ProjectsItemContext = createContext<ProjectsItemContextInterface | null>(null);

const useProjectsItemContext = createUseContext(ProjectsItemContext);

const ERRORS: Record<any, string> = {
  404: 'Project was deleted or has not been created yet.',
  403: 'Project not found.',
  default: 'Something went wrong.',
};

const ProjectsItemProvider = (
  {
    projectId,
    children,
  }: PropsWithChildren<{ projectId: string }>,
) => {
  const { projectsById } = useProjectsContext();
  const [project, setProject] = useState<Project>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState();

  const cache = React.useRef<Record<Project['id'], Project>>({});

  const get = React.useCallback(() => apiService.getProject(
    projectId,
  ).then(({ data: { project: projectData } }) => {
    if (!project || projectData.id !== project.id) {
      setProject(projectData);
    } else if (projectData.id === project.id || projectData.updated_at !== project.updated_at) {
      setProject(
        (c) => getNewestData(c, projectData),
      );
    }
  }).finally(), [projectId]);

  const debouncedGet = React.useMemo(() => debounceApiRequest(get), []);

  const { subscribe, unsubscribe } = useSubscription(
    '/projects',
    (data) => {
      if (data.id === projectId) {
        setProject((c) => getNewestData(c, data));
      }
    },
    debouncedGet,
  );

  React.useEffect(() => {
    setProject(cache.current[projectId] || projectsById[projectId]);
    setError(undefined);

    setIsLoading(true);
    get().catch((res) => {
      setError(res.response && res.response
        ? ERRORS[res.response.status] || ERRORS.default
        : res.toString());
    }).finally(() => setIsLoading(false));

    subscribe();

    return () => {
      unsubscribe();
    };
  }, [projectId]);

  React.useEffect(() => {
    if (project && cache.current[project.id]?.updated_at !== project.updated_at) {
      cache.current[project.id] = project;
    }
  }, [project]);

  const deleteProject = useCallback(
    () => apiService.deleteProject(projectId).then(({ data }) => data.project),
    [projectId],
  );

  return (
    <ProjectsItemContext.Provider value={{
      projectId,
      project,
      isLoading: isLoading && !project,
      error,
      delete: deleteProject,
      subscribe,
      unsubscribe,
      get: debouncedGet,
    }}
    >
      <BranchesProvider projectId={projectId}>
        <ProjectEndpointsProvider projectId={projectId}>
          <SelectedBranchProvider projectId={projectId}>
            {children}
          </SelectedBranchProvider>
        </ProjectEndpointsProvider>
      </BranchesProvider>
    </ProjectsItemContext.Provider>
  );
};

export { ProjectsItemProvider, useProjectsItemContext };
