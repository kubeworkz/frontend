import React, { createContext, useCallback, useEffect } from 'react';

import { createUseContext } from '#shared/hooks/utils';

import {
  apiService, Branch, Project,
} from '#api_client/publicv2';
import { createErrorText, useThrottledApiRequest } from '#api_client/utils';
import { useResource } from '#shared/utils/useResource';
import { useSubscription } from './actionCable';

export interface BranchSelectOption {
  value: Branch['id'];
  label: string;
  branch: Branch;
  disabled?: boolean;
}

export type BranchesContextData = {
  branches: Branch[];
  branchesById: Record<Branch['id'], Branch>;
  selectOptions: BranchSelectOption[];
  selectOptionsById: Record<Branch['id'], BranchSelectOption>;
  isLoading: boolean;
  error?: string;
  branchesCount: number;

  fetch(): void;
};
const BranchesContext = createContext<BranchesContextData | null>(null);

export const useBranches = createUseContext(BranchesContext);

export const BranchesProvider = ({
  projectId,
  children,
}: {
  children: React.ReactNode;
  projectId: Project['id'],
}) => {
  const [state, setState] = useResource<{
    branches: Branch[];
    total: number;
  }>();

  const branchesById: Record<Branch['id'], Branch> = React.useMemo(() => (
    Object.fromEntries((state.data?.branches || []).map((branch) => ([branch.id, branch])))
  ), [state.data]);
  const selectOptions: { list: BranchSelectOption[], byId: Record<Branch['id'], BranchSelectOption> } = React.useMemo(() => {
    const list: BranchSelectOption[] = [];
    const byId: Record<Branch['id'], BranchSelectOption> = {};

    (state.data?.branches || []).forEach((branch) => {
      const option = {
        label: branch.name,
        value: branch.id,
        branch,
      };

      list.push(option);
      byId[branch.id] = option;
    });

    return { list, byId };
  }, [state.data]);

  const fetchBranches = useCallback((pId: string) => apiService.listProjectBranches(pId)
    .then(({ data }) => {
      setState({
        isLoading: false,
        data: {
          branches: data.branches.sort((a, b) => (+b.primary - +a.primary)),
          total: data.branches.length,
        },
      });
    })
    .catch((err) => {
      setState({
        isLoading: false,
        error: createErrorText(err),
      });
    }),
  []);

  const fetchCurrentBranches = useCallback(({
    forceLoading,
  }: { forceLoading: boolean } = { forceLoading: false }) => {
    if (forceLoading) {
      setState({ isLoading: true });
    }
    fetchBranches(projectId);
  }, [projectId]);

  const { subscribe, unsubscribe } = useSubscription(
    '/endpoints',
    useThrottledApiRequest(() => fetchCurrentBranches()),
    fetchCurrentBranches,
  );

  useEffect(() => {
    fetchCurrentBranches({ forceLoading: true });
    subscribe();
    return unsubscribe;
  }, [projectId]);

  return (
    <BranchesContext.Provider
      value={{
        branches: state.data?.branches || [],
        branchesCount: state.data?.total || 0,
        branchesById,
        selectOptions: selectOptions.list,
        selectOptionsById: selectOptions.byId,
        isLoading: state.isLoading,
        error: state.error,
        fetch: fetchCurrentBranches,
      }}
    >
      {children}
    </BranchesContext.Provider>
  );
};
