/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
import React, {
  createContext, useCallback, useEffect, useState,
} from 'react';
import { apiErrorToaster, debounceApiRequest } from '../../../api/utils';
import { apiService, Project } from '../../../api/publicv2';
import { getNewestData, useSubscription } from '../../../hooks/actionCable';
import { createUseContext } from '../../../hooks/utils';
import { useCurrentUser } from '../../../hooks/currentUser';

interface ProjectsContextInterface {
  list: Project[],
  owned: Project[],
  sharedWithMe: Project[],
  isLoading: boolean;
  userProjectsLimitsExceeded: boolean;
  projectsById: Record<Project['id'], Project>;
  get(opts?: { withOperations: boolean }): Promise<void | string>,
  deleteProject(projectId: Project['id']): void,
}

const ProjectsContext = createContext<ProjectsContextInterface | null>(null);

const useProjectsContext = createUseContext(ProjectsContext);

const ProjectsProvider = ({ children }: React.PropsWithChildren<{}>) => {
  const [ids, setIds] = useState<Array<Project['id']>>([]);
  const [projectsById, setProjectsById] = useState<Record<Project['id'], Project>>({});
  const [isLoading, setIsLoading] = useState(true);
  const { user: { id: userId, projectsLimit }, isLoading: isUserLoading } = useCurrentUser();
  const [
    projectCreationDisabled,
    setProjectCreationDisabled,
  ] = useState(false);

  const get: ProjectsContextInterface['get'] = debounceApiRequest(() => new Promise<void | string>((resolve, reject) => {
    apiService.listProjects({ limit: 100 })
      .then(({ data: { projects } }) => {
        setIds(projects.map(({ id }) => id));
        setProjectsById(
          (s) => (
            projects
              .reduce((acc, project) => {
                acc[project.id] = getNewestData(project, s[project.id]);
                return acc;
              }, {} as Record<Project['id'], Project>)
          ),
        );
        setIsLoading(false);
        resolve();
      })
      .catch(() => reject());
  }));

  const { subscribe, unsubscribe } = useSubscription('/projects', (data) => {
    setProjectsById((prev) => ({
      ...prev,
      [data.id]: getNewestData(prev[data.id], data),
    }));

    if (data.deleted || !ids.includes(data.id)) {
      get();
    }
  }, get);

  useEffect(() => {
    get();
    subscribe();
    return () => {
      unsubscribe();
    };
  }, []);

  const deleteProject = useCallback((projectId: Project['id']) => apiService.deleteProject(projectId).catch(apiErrorToaster), []);

  const lists: Pick<ProjectsContextInterface, 'list' | 'sharedWithMe' | 'owned'> = React.useMemo(
    () => {
      const res: Pick<ProjectsContextInterface, 'list' | 'sharedWithMe' | 'owned'> = {
        list: [],
        sharedWithMe: [],
        owned: [],
      };

      if (isLoading || isUserLoading) {
        return res;
      }

      ids.forEach((id) => {
        if (!projectsById[id]) {
          return;
        }
        res.list.push(projectsById[id]);
        if (projectsById[id].owner_id === userId) {
          res.owned.push(projectsById[id]);
        } else {
          res.sharedWithMe.push(projectsById[id]);
        }
      });

      return res;
    },
    [ids, projectsById, isLoading, isUserLoading],
  );

  useEffect(() => {
    setProjectCreationDisabled(typeof projectsLimit === 'number'
      && projectsLimit >= 0 && lists.owned.length >= projectsLimit);
  }, [lists, projectsLimit]);

  return (
    <ProjectsContext.Provider value={{
      ...lists,
      projectsById,
      userProjectsLimitsExceeded: projectCreationDisabled,
      isLoading: isLoading || isUserLoading,
      get,
      deleteProject,
    }}
    >
      {children}
    </ProjectsContext.Provider>
  );
};

export { ProjectsProvider, useProjectsContext };
