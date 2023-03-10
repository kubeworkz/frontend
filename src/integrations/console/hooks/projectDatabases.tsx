import React, {
  createContext, PropsWithChildren, useCallback,
} from 'react';
import { createUseContext } from '../../../hooks/utils';
import {
  ConfirmationPreset,
  createConfirmation,
  useConfirmation,
} from '../../../components/Confirmation/ConfirmationProvider';
import { debounceApiRequest, apiErrorToaster, createErrorText } from '../../../api/utils';
import {
  DatabaseCreateRequest,
  DatabaseResponse,
  DatabaseUpdateRequest,
  apiService,
  Database,
} from '../../../api/publicv2';
import { AxiosResponse } from 'axios';
import { useResource } from '../../../utils/useResource';
import { BranchScopeProps } from '../../../types/Props';

export interface DatabaseOption {
  database: Database;
  value: Database['name'];
  label: Database['name'];
}

interface ProjectDatabasesContextInterface {
  isLoading: boolean;
  list: Database[];
  listById: Record<Database['name'], Database>;
  selectOptions: DatabaseOption[];
  selectOptionsById: Record<Database['name'], DatabaseOption>;
  fetch(): void;
  deleteDatabase(db: Database): Promise<any> | undefined;
  createDatabase(
    branch_id: string,
    data: DatabaseCreateRequest,
  ): undefined | Promise<AxiosResponse<DatabaseResponse>>;
  updateDatabase(
    database: Database,
    data: DatabaseUpdateRequest,
  ): undefined | Promise<AxiosResponse<DatabaseResponse>>;
}

const ProjectDatabasesContext = createContext<ProjectDatabasesContextInterface | null>(null);
export const useProjectDatabases = createUseContext(ProjectDatabasesContext);

export const useProjectDatabasesState = ({
  branchId,
  projectId,
}: BranchScopeProps) => {
  const [state, setState] = useResource<{
    list: Database[],
    byId: Record<Database['id'], Database>,
    selectOptions: DatabaseOption[]
    selectOptionsById: Record<Database['id'], DatabaseOption>
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
    apiService.listProjectBranchDatabases(projectId, branchId)
      .then(({ data: respData }) => {
        const options = respData.databases.map((database) => ({
          database,
          value: database.name,
          label: database.name,
        }));
        setState({
          isLoading: false,
          data: {
            list: respData.databases,
            byId: Object.fromEntries(respData.databases.map((o) => [o.id, o])),
            selectOptions: options,
            selectOptionsById: Object.fromEntries(options.map((o) => [o.value, o])),
          },
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
    forceLoading: () => setState({ isLoading: true }),
  };
};

export const ProjectDatabasesProvider = ({
  projectId,
  branchId,
  children,
}: PropsWithChildren<BranchScopeProps>) => {
  const { confirm } = useConfirmation();
  const {
    data, isLoading, fetch, forceLoading,
  } = useProjectDatabasesState({
    projectId,
    branchId,
  });

  const deleteDatabase = React.useCallback((database: Database) => (
    confirm(createConfirmation(ConfirmationPreset.DeleteDatabase, database))
      .then(() => {
        forceLoading();
        return apiService.deleteProjectBranchDatabase(
          projectId,
          database.branch_id,
          database.name,
        );
      })
      .then((res) => {
        fetch({
          forceLoading: true,
        });
        return res;
      })
      .catch((err) => {
        fetch({
          forceLoading: true,
        });
        if (err) {
          apiErrorToaster(err);
        }
      })
  ), [projectId, branchId, fetch]);

  const createDatabase = React.useCallback((branch_id: string, formData: DatabaseCreateRequest) => {
    if (!branch_id) {
      return undefined;
    }

    return apiService.createProjectBranchDatabase(projectId, branch_id, formData)
      .then((res) => {
        fetch({
          forceLoading: true,
        });
        return res;
      });
  }, [projectId, branchId, fetch]);

  const updateDatabase = React.useCallback((
    database: Database,
    formData: DatabaseUpdateRequest,
  ) => apiService.updateProjectBranchDatabase(
    projectId,
    database.branch_id,
    database.name,
    formData,
  )
    .then((res) => {
      fetch({
        forceLoading: true,
      });
      return res;
    }), [projectId, branchId, fetch]);

  return (
    <ProjectDatabasesContext.Provider
      value={{
        list: data.list,
        listById: data.byId,
        selectOptions: data.selectOptions,
        selectOptionsById: data.selectOptionsById,
        isLoading,
        fetch,
        deleteDatabase,
        createDatabase,
        updateDatabase,
      }}
    >
      {children}
    </ProjectDatabasesContext.Provider>
  );
};
