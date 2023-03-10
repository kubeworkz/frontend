import React, { createContext, useCallback, useMemo } from 'react';

import { createUseContext } from '../../hooks/utils';
import {
  apiService,
  ExternalIntegration,
  OAuthApplication,
} from '../../api/publicv2';
import { useRequest } from '../../hooks/request';
import {
  ConfirmationPreset,
  createConfirmation,
  useConfirmation,
} from '../../components/Confirmation/ConfirmationProvider';
import { apiErrorToaster } from '../../api/utils';

export type ProjectIntegrations = {
  integrations: (OAuthApplication | ExternalIntegration)[];
  isLoading: boolean;
  error: Error | undefined;
  revokeIntegration: (app: OAuthApplication | ExternalIntegration) => Promise<void>;
};
const ProjectIntegrationsContext = createContext<ProjectIntegrations | null>(
  null,
);

export const useProjectIntegrations = createUseContext(
  ProjectIntegrationsContext,
);

export type ProjectIntegrationsProviderProps = {
  projectId: string;
  children: React.ReactNode;
};
export const ProjectIntegrationsProvider = ({
  children,
  projectId,
}: ProjectIntegrationsProviderProps) => {
  const integrationsResponse = useRequest(
    () => apiService.listUserAvailableApplications({ project_id: projectId }),
    [projectId],
  );

  const integrations = useMemo(
    () => integrationsResponse.data?.data.applications.filter(
      ({ active }) => active,
    ) ?? [],
    [integrationsResponse.data],
  );

  const { confirm } = useConfirmation();

  const onRevokeIntegration = useCallback(
    async (app: OAuthApplication | ExternalIntegration) => {
      if ('client_type' in app && app.vercel) {
        confirm(createConfirmation(ConfirmationPreset.RevokeIntegration))
          .then(() => apiService.unlinkProjectFromVercelIntegrations(projectId))
          .then(() => {
            integrationsResponse.reload();
          })
          .catch(apiErrorToaster);
      }
    },
    [confirm, projectId, integrationsResponse.reload],
  );

  return (
    <ProjectIntegrationsContext.Provider
      value={{
        integrations,
        isLoading: integrationsResponse.isLoading,
        error: integrationsResponse.error,
        revokeIntegration: onRevokeIntegration,
      }}
    >
      {children}
    </ProjectIntegrationsContext.Provider>
  );
};
