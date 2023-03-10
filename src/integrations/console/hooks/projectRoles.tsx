import React, {
  createContext, PropsWithChildren, useCallback,
} from 'react';
import {
  Role,
  apiService,
  RoleCreateRequest,
  RoleResponse,
} from '../../../api/publicv2';
import { createUseContext } from '../../../hooks/utils';
import {
  ConfirmationPreset,
  createConfirmation,
  useConfirmation,
} from '../../../components/Confirmation/ConfirmationProvider';
import { debounceApiRequest, apiErrorToaster, createErrorText } from '../../../api/utils';
import { AxiosResponse } from 'axios';
import { BranchScopeProps } from '../../../types/Props';
import { useResource } from '../../../utils/useResource';
import { useNewItemsCallbacks } from '../../../hooks/useNewItem';

export interface RoleOption {
  role: Role;
  value: Role['name'];
  label: Role['name'];
}

interface ProjectRolesContextInterface {
  isLoading: boolean;
  list: Role[];
  listById: Record<Role['name'], Role>;
  selectOptions: RoleOption[];
  selectOptionsById: Record<Role['name'], RoleOption>;
  fetch(): void;
  deleteRole(role: Role): Promise<any> | undefined;
  createRole(data: RoleCreateRequest): Promise<AxiosResponse<RoleResponse>> | undefined;
}

const ProjectRolesContext = createContext<ProjectRolesContextInterface | null>(null);
export const useProjectRoles = createUseContext(ProjectRolesContext);

// todo: consider creating useBranchScopeResource({projectId, branchId}, fetch) or smth like this.
// A lot of copy-paste with the databases hook
export const useProjectRolesState = ({ projectId, branchId }: BranchScopeProps) => {
  const [state, setState] = useResource<{
    list: Role[];
    byId: Record<Role['name'], Role>;
    selectOptions: RoleOption[];
    selectOptionsById: Record<Role['name'], RoleOption>;
  }>();

  const fetch = useCallback(debounceApiRequest(({
    forceLoading,
  }: { forceLoading: boolean } = { forceLoading: false }) => {
    if (!branchId) {
      return;
    }
    if (forceLoading) {
      setState({
        isLoading: true,
      });
    }
    apiService.listProjectBranchRoles(projectId, branchId)
      .then(({ data }) => {
        const options = data.roles.map((role) => ({
          role,
          value: role.name,
          label: role.name,
        }));
        setState({
          data: {
            list: data.roles,
            byId: Object.fromEntries(data.roles.map((o) => [o.name, o])),
            selectOptions: options,
            selectOptionsById: Object.fromEntries(options.map((o) => [o.value, o])),
          },
          isLoading: false,
        });
      }).catch((err) => {
        setState({
          isLoading: false,
          error: createErrorText(err),
        });
      });
  }), [projectId, branchId]);

  React.useEffect(() => {
    if (!branchId) {
      setState({
        error: 'Please select a branch first',
        isLoading: false,
      });
    } else {
      fetch({
        forceLoading: true,
      });
    }
  }, [projectId, branchId]);

  return {
    isLoading: state.isLoading,
    error: state.error,
    data: state.data || {
      list: [],
      selectOptions: [],
      byId: {},
      selectOptionsById: {},
    },
    fetch,
  };
};

export const ProjectRolesProvider = ({
  projectId,
  branchId,
  children,
}: PropsWithChildren<BranchScopeProps>) => {
  const { confirm } = useConfirmation();
  const { data: roles, isLoading, fetch } = useProjectRolesState({ projectId, branchId });
  const { onRoleCreate } = useNewItemsCallbacks();

  const deleteRole = React.useCallback((role: Role) => {
    if (!branchId) {
      return undefined;
    }
    return (
      confirm(createConfirmation(ConfirmationPreset.DeleteRole, role))
        .then(() => apiService.deleteProjectBranchRole(
          projectId,
          branchId,
          encodeURIComponent(role.name),
        ))
        .then((res) => {
          fetch();
          return res;
        }).catch((error) => {
          if (error) {
            apiErrorToaster(error);
          }
        }));
  }, [projectId, branchId, fetch]);

  const createRole = React.useCallback((data: RoleCreateRequest) => {
    if (!branchId) {
      return undefined;
    }

    return apiService.createProjectBranchRole(projectId, branchId, data)
      .then((res) => {
        fetch();
        onRoleCreate(res.data);
        return res;
      });
  }, [projectId, branchId, fetch]);

  return (
    <ProjectRolesContext.Provider
      value={{
        list: roles.list,
        listById: roles.byId,
        selectOptions: roles.selectOptions,
        selectOptionsById: roles.selectOptionsById,
        isLoading,
        fetch,
        deleteRole,
        createRole,
      }}
    >
      {children}
    </ProjectRolesContext.Provider>
  );
};
