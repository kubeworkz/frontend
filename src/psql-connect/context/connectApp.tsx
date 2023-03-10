import React, { createContext, PropsWithChildren, useState } from 'react';
import { createUseContext } from '../../hooks/utils';
import { Project, Endpoint, apiService } from '../../api/publicv2';
import { useHistory } from 'react-router-dom';
import { PsqlConnectRoutes } from '../config/routes';

type ConnectAppProject = Pick<Project, 'id' | 'name'>;

interface ConnectAppContextInterface {
  projects: Project[];
  psqlSessionId: string;
  connectedProject?: ConnectAppProject;
  connectedEndpoint?: Endpoint;
  onConnectEndpoint(endpoint: Endpoint, project: Project): void;
}

export const ConnectAppContext = createContext<ConnectAppContextInterface | null>(null);

export const useConnectAppContext = createUseContext(ConnectAppContext);

export const ConnectAppProvider = ({
  children,
  psqlSessionId,
  projects,
}: PropsWithChildren<{ psqlSessionId: string, projects: Project[] }>) => {
  const [connectedProject, setConnectedProject] = useState<ConnectAppProject | undefined>();
  const [connectedEndpoint, setConnectedEndpoint] = useState<Endpoint | undefined>();
  const history = useHistory();

  const onConnectEndpoint = React.useCallback((endpoint: Endpoint, project: Project) => {
    setConnectedEndpoint(endpoint);
    setConnectedProject(project); // we need this for troubleshooting
    apiService.authProjectEndpointPasswordlessSession(
      endpoint.project_id,
      endpoint.id,
      {
        session_id: psqlSessionId,
      },
    ).then(() => {
      history.push(PsqlConnectRoutes.Success); // success callback
    }).catch(() => {
      history.push(PsqlConnectRoutes.Error); // callback for any errors
    });
  }, []);

  return (
    <ConnectAppContext.Provider value={{
      projects,
      psqlSessionId,
      connectedProject,
      connectedEndpoint,
      onConnectEndpoint,
    }}
    >
      {children}
    </ConnectAppContext.Provider>
  );
};
