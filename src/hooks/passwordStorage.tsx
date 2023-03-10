import React, {
  createContext, PropsWithChildren, useCallback, useContext, useState,
} from 'react';

import { Role, apiService } from '../api/publicv2';

interface PasswordStorageContextInterface {
  getPassword(projectId: string, branchId: string, roleName: string): string | undefined;
  setPassword(projectId: string, rolesOrRole: Array<Role> | Role): void;
  clearPasswords(projectId: string, branchId?: string, roleName?: string): void;
  revealPassword(projectId: string, role: Role): Promise<void>;
}

const ProjectDatabasesContext = createContext<PasswordStorageContextInterface>({
  getPassword: () => undefined,
  setPassword() {},
  clearPasswords() {},
  revealPassword() { return Promise.resolve(); },
});

interface PasswordStorageState {
  [key: string]: string;
}

export const PasswordStorageProvider = ({ children }: PropsWithChildren<{}>) => {
  const [state, setState] = useState<PasswordStorageState>({});

  const getKey = (projectId: string, branchId: string, role: string) => `${projectId}_${branchId}_${role}`;
  const rolesToPasswordStorageState: (
    projectId: string, roles: Role[],
  ) => PasswordStorageState = useCallback((
    projectId, roles,
  ) => Object.fromEntries(roles
    .filter((r) => (!r.protected && r.password))
    .map((r) => ([
      getKey(projectId, r.branch_id, r.name),
      (r as Role & { password: string }).password,
    ]))), []);

  const getPassword: PasswordStorageContextInterface['getPassword'] = React.useCallback(
    (projectId, branchId, roleName) => state[getKey(projectId, branchId, roleName)],
    [state],
  );
  const setPassword: PasswordStorageContextInterface['setPassword'] = React.useCallback((projectId, rolesOrRole) => {
    const newDataArray = rolesToPasswordStorageState(
      projectId,
      Array.isArray(rolesOrRole) ? rolesOrRole : [rolesOrRole],
    );
    if (!Object.keys(newDataArray).length) {
      return;
    }
    setState((s) => ({
      ...s,
      ...newDataArray,
    }));
  }, [rolesToPasswordStorageState]);
  const clearPasswords: PasswordStorageContextInterface['clearPasswords'] = (projectId, branchId, roleName) => {
    setState((s) => {
      if (branchId && roleName) {
        const sCopy = { ...s };
        delete sCopy[getKey(projectId, branchId, roleName)];

        return sCopy;
      }

      return Object.fromEntries(Object.entries(s).filter(([key]) => {
        if (branchId) {
          return !key.startsWith(`${projectId}_${branchId}`);
        }
        return !key.startsWith(projectId);
      }) || []);
    });
  };

  const revealPassword = useCallback(
    (projectId: string, role: Role) => apiService.getProjectBranchRolePassword(
      projectId,
      role.branch_id,
      role.name,
    ).then(({ data: { password } }) => {
      const roleWithPassword = { ...role, password };
      setPassword(projectId, roleWithPassword);
    }),
    [setPassword],
  );

  return (
    <ProjectDatabasesContext.Provider value={{
      getPassword,
      setPassword,
      clearPasswords,
      revealPassword,
    }}
    >
      {children}
    </ProjectDatabasesContext.Provider>
  );
};

export const usePasswordStorage = () => useContext(ProjectDatabasesContext);
