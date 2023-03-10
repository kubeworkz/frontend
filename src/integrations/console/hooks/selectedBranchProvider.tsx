import React, { createContext, PropsWithChildren, useState } from 'react';
import { Branch, Endpoint } from '../../../api/generated/api_public_v2';
import { createUseContext } from '../../../hooks/utils';
import { useBranches } from '../../../hooks/projectBranches';
import { useLocation } from 'react-router-dom';
import { parse } from 'query-string';
import { ProjectDatabasesProvider } from './projectDatabases';
import { ProjectRolesProvider } from './projectRoles';
import { OperationsProvider } from './operationsContext';
import { useProjectEndpoints } from './projectEndpoints';

// this context should be used to render per branch resources such as users, databases, roles, etc.

interface SelectedBranchContextI {
  branch?: Branch;
  endpoints: Endpoint[];
  setBranch(b: Branch): void;
}

const SelectedBranchContext = createContext<SelectedBranchContextI | null>(null);
SelectedBranchContext.displayName = 'SelectedBranchContext';

const useSelectedBranch = createUseContext(SelectedBranchContext);

const SelectedBranchProvider = (
  {
    projectId,
    children,
  }: PropsWithChildren<{ projectId: string }>,
) => {
  const { branches, branchesById } = useBranches();
  const { endpointsByBranchId } = useProjectEndpoints();
  const [branch, setBranch] = useState<Branch>();
  const { search } = useLocation();
  const query = React.useMemo(() => parse(search), [search]);

  const endpoints: Endpoint[] = React.useMemo(() => {
    if (!branch) {
      return [];
    }
    return endpointsByBranchId[branch.id] || [];
  }, [endpointsByBranchId, branch]);

  // todo: we can add here same caching to store branches data
  React.useEffect(() => {
    if (branchesById && typeof query.branch_id === 'string' && branchesById[query.branch_id]) {
      setBranch(branchesById[query.branch_id]);
      return;
    }
    if (!branch || !branchesById[branch.id]) {
      const root = branches.find((b) => !b.parent_id);
      setBranch(root);
    }
  }, [branches, projectId, query]);

  return (
    <SelectedBranchContext.Provider value={{
      branch,
      endpoints,
      setBranch,
    }}
    >
      <ProjectRolesProvider projectId={projectId} branchId={branch?.id}>
        <ProjectDatabasesProvider
          projectId={projectId}
          branchId={branch?.id}
        >
          <OperationsProvider projectId={projectId}>
            {children}
          </OperationsProvider>
        </ProjectDatabasesProvider>
      </ProjectRolesProvider>
    </SelectedBranchContext.Provider>
  );
};

export { SelectedBranchProvider, useSelectedBranch };
