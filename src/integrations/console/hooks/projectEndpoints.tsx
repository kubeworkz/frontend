import React, {
  createContext, useCallback, useEffect,
} from 'react';

import { createUseContext } from '../../../hooks/utils';

import {
  apiService, Branch, Endpoint, Project,
} from '../../../api/publicv2';
import { createErrorText, useThrottledApiRequest } from '../../../api/utils';
import { useBranches } from '../../../hooks/projectBranches';
import { useResource } from '../../../utils/useResource';
import { useSubscription } from '../../../hooks/actionCable';

export interface EndpointOption {
  value: Endpoint['id'];
  label: string;
  endpoint: Endpoint;
  branch?: Branch;
}

export type ProjectEndpointsContextData = {
  endpoints: Endpoint[];
  endpointsCount: number;
  endpointsByBranchId: Record<Branch['id'], Endpoint[]>;
  selectOptions: EndpointOption[];
  selectOptionsById: Record<Endpoint['id'], EndpointOption>;

  isLoading: boolean;
  error?: string;

  fetch(o?: { forceLoading?: boolean }): void;
  onDeleteEndpoint(id: Endpoint['id']): void;
};
const ProjectEndpointsContext = createContext<ProjectEndpointsContextData | null>(null);

export const useProjectEndpoints = createUseContext(ProjectEndpointsContext);

export const ProjectEndpointsProvider = ({
  projectId,
  children,
}: {
  children: React.ReactNode;
  projectId: Project['id'],
}) => {
  const [state, setState] = useResource<{ endpoints: Endpoint[], count: number }>();
  const { branchesById } = useBranches();

  const endpoints = React.useMemo(() => state.data?.endpoints ?? [],
    [state.data]);

  const selectOptions: EndpointOption[] = React.useMemo(
    () => endpoints.map(
      (endpoint) => ({
        value: endpoint.id,
        label: branchesById[endpoint.branch_id]
          ? branchesById[endpoint.branch_id].name
          : endpoint.branch_id,
        endpoint,
        branch: branchesById[endpoint.branch_id],
      }),
    ), [endpoints, branchesById],
  );

  const selectOptionsById: Record<Endpoint['id'], EndpointOption> = React.useMemo(
    () => Object.fromEntries(
      selectOptions.map((option) => ([option.endpoint.id, option])),
    ),
    [selectOptions],
  );

  const endpointsByBranchId = React.useMemo(() => {
    const res: Record<Branch['id'], Endpoint[]> = {
    };
    endpoints.forEach((endpoint) => {
      if (!res[endpoint.branch_id]) {
        res[endpoint.branch_id] = [];
      }

      res[endpoint.branch_id].push(endpoint);
    });
    return res;
  }, [endpoints]);

  const fetchEndpoints = useCallback((o = {}) => {
    if (o.forceLoading) {
      setState({ isLoading: true });
    }
    apiService.listProjectEndpoints(projectId)
      .then(({ data }) => {
        setState({
          data: {
            endpoints: data.endpoints,
            count: data.endpoints.length,
          },
          isLoading: false,
        });
      })
      .catch((err) => {
        setState({
          isLoading: false,
          error: createErrorText(err),
        });
      });
  }, [projectId]);

  const onDeleteEndpoint = useCallback(() => {
    // todo
  }, []);

  const throttledFetch = useThrottledApiRequest(fetchEndpoints);

  const { subscribe, unsubscribe } = useSubscription('/endpoints', () => {
    throttledFetch();
  }, fetchEndpoints);

  useEffect(() => {
    fetchEndpoints({ forceLoading: true });
    subscribe();
    // looks like some messages are lost during the cable switch
    setTimeout(() => {
      throttledFetch();
    }, 1000);
    return unsubscribe;
  }, [fetchEndpoints]);

  return (
    <ProjectEndpointsContext.Provider
      value={{
        endpoints: state.data ? state.data.endpoints : [],
        endpointsCount: state.data ? state.data.count : 0,
        endpointsByBranchId,
        selectOptions,
        selectOptionsById,
        isLoading: state.isLoading,
        error: state.error,
        fetch: fetchEndpoints,
        onDeleteEndpoint,
      }}
    >
      {children}
    </ProjectEndpointsContext.Provider>
  );
};
