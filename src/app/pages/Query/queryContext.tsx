import React, {
  createContext, PropsWithChildren, useCallback, useEffect, useMemo, useRef, useState,
} from 'react';
import axios, { CancelTokenSource } from 'axios';
import { toast } from 'react-toastify';
import { apiErrorToaster } from '../../../api/utils';
import {
  SavedQuery, QueryHistoryItem, apiService, Role, QueryResponse, Branch,
} from '../../../api/publicv2';
import { AnalyticsAction, useAnalytics } from '../../../utils/analytics';
import { ToastError } from '../../../components/Toast/Toast';
import { createUseContext } from '../../../hooks/utils';
import { ConfirmationPreset, createConfirmation, useConfirmation } from '../../../components/Confirmation/ConfirmationProvider';
import { getQueryFromStore } from '../../utils/queryStorage';
import { DatabaseOption, useProjectDatabases } from '../../hooks/projectDatabases';
import { useProjectsItemContext } from '../../hooks/projectsItem';
import { useSelectedBranch } from '../../hooks/selectedBranchProvider';

export const QUERY_URL_KEY = 'query';

export enum QueryLayout {
  Cols = 'cols',
  Rows = 'rows',
}

export const QUERY_LAYOUT_OPTIONS = [
  { value: QueryLayout.Cols, label: 'Column view' },
  { value: QueryLayout.Rows, label: 'Row view' },
];

export interface Credentials {
  user: Role;
  password: string;
}

export type Result = QueryResponse;

interface QueryContextInterface {
  state: {
    isDisabled: boolean;
    layout: QueryLayout;
    branch?: Branch;
    branchHasEndpoints: boolean;
    database?: DatabaseOption;
    credentials?: Credentials;
    query: string;
    result?: Result;
    isQueryRunning: boolean;
    queriesHistory?: QueryHistoryItem[];
    queriesSaved?: SavedQuery[];
    selectedQueryId: number | null;
    selectedQueryName: string | null;
    queryChanged: boolean;
    queryOptions: {
      explain?: boolean;
      analyze?: boolean;
    },
  };
  actions: {
    run(o?: { explain?: boolean, analyze?: boolean }): void;
    cancel(): void;
    saveQuery(id: number | null, name: string): Promise<void>;
    renameQuery(id: number, newName: string): Promise<void>;
    selectQuery(name: string | null): Promise<boolean>;
    deleteSavedQuery(id: number): void;
    setLayout(l: QueryLayout): void;
    onChangeQuery(q: string): void;
    onChangeQuerySelection(q?: string): void;
    onChangeBranch(b: Branch): void;
    onChangeDatabase(db?: DatabaseOption): void;
    onChangeCredentials(creds?: Credentials): void;
  };
  editorRef?: React.MutableRefObject<{ focus(): void } | undefined>;
}

export const QueryContext = createContext<QueryContextInterface | null>(null);

const useQueryContext = createUseContext(QueryContext);

const QueryProvider = React.memo((
  {
    children,
  }: PropsWithChildren<{}>,
) => {
  const { projectId, project } = useProjectsItemContext();

  const [layout, setLayout] = useState<QueryLayout>(QueryLayout.Rows);

  const { branch, endpoints, setBranch } = useSelectedBranch();
  const [database, setDatabase] = useState<DatabaseOption>();
  const [credentials, setCredentials] = useState<Credentials>();

  const [query, setQuery] = useState(getQueryFromStore(projectId) || '');
  const [querySelection, setQuerySelection] = useState<string | undefined>('');

  const [queryResult, setQueryResult] = useState<Result>();
  const [isQueryRunning, setIsQueryRunning] = useState(false);
  const [queryOptions, setQueryOptions] = useState({});

  const { trackUiInteraction } = useAnalytics();
  const { confirm } = useConfirmation();

  const editorRef = useRef<{ focus(): void }>();

  const {
    selectOptions: databases,
    isLoading: isDbLoading,
    fetch: fetchDatabases,
  } = useProjectDatabases();

  // todo: use useCancelToken here
  const controller = useRef<CancelTokenSource>();

  const focusEditor = useCallback(() => {
    editorRef.current?.focus();
  }, []);

  const [queriesHistory, setQueriesHistory] = useState<QueryHistoryItem[]>();
  const tryFetchQueryHistory = useCallback(() => {
    if (projectId && database) {
      apiService.getProjectQueryHistory({
        projectId,
        database_id: database.database.id,
      }).then(({ data: res }) => {
        setQueriesHistory(res.history ?? []);
      }, apiErrorToaster);
    }
  }, [projectId, database]);

  const [queriesSaved, setQueriesSaved] = React.useState<SavedQuery[]>();
  const initialSelectedSet = useRef(false);
  const [selectedQueryName, setSelectedQueryName] = React.useState<string | null>(null);
  const tryFetchQueriesSaved = useCallback(async () => {
    if (projectId) {
      return apiService.listProjectSavedQueries(projectId).then(({ data }) => {
        setQueriesSaved(data);

        const url = new URL(window.location.href);
        const queryFromUrl = url.searchParams.get('query');
        if (queryFromUrl) {
          const found = data.find((record) => record.name === queryFromUrl);
          if (found?.query) {
            if (!query) {
              setQuery(found.query);
            }
            setSelectedQueryName(queryFromUrl);
          }
        }
        initialSelectedSet.current = true;
      }).catch(apiErrorToaster);
    }
    return [];
  }, [projectId]);

  const run = (options: { explain?: boolean, analyze?: boolean } = {}) => {
    focusEditor();
    if (!database) {
      toast(<ToastError body={"You haven't selected a database"} />);
      return;
    }

    const cancelToken = axios.CancelToken.source();
    controller.current = cancelToken;

    setIsQueryRunning(true);
    setQueryOptions(options);
    const creds: { user_id?: string; password?: string; } = credentials ? {
      user_id: credentials.user.name,
      password: credentials.password,
    } : {};

    apiService.runProjectQuery(projectId, {
      ...creds,
      db_name: database.database.name,
      branch_id: database.database.branch_id,
      query: querySelection || query,
      role_name: project?.store_passwords ? database.database.owner_name : undefined,
      options,
    }, {
      cancelToken: cancelToken.token,
    })
      .then(({ data }) => {
        setQueryResult(data);
      }).catch((res) => {
        if (axios.isCancel(res)) {
          return;
        }
        apiErrorToaster(res);
      })
      .finally(() => {
        tryFetchQueryHistory();
        setIsQueryRunning(false);
      });
  };

  const cancel = () => {
    focusEditor();
    controller.current?.cancel();
  };

  const onChangeDatabase = (db: DatabaseOption) => {
    focusEditor();
    setDatabase(db);
  };

  useEffect(() => {
    setCredentials(undefined);
    setQuery(getQueryFromStore(projectId) || '');
    setQueryResult(undefined);
    setIsQueryRunning(false);
    setQueryOptions({});
    // setQuerySelection('');
    if (controller.current) {
      controller.current.cancel();
    }
    fetchDatabases();
  }, [projectId]);

  useEffect(() => {
    tryFetchQueryHistory();
  }, [tryFetchQueryHistory]);

  useEffect(() => {
    tryFetchQueriesSaved();
  }, [tryFetchQueriesSaved]);

  const queryChanged = useMemo(
    () => queriesSaved?.find(
      (record) => record.name === selectedQueryName,
    )?.query !== query,
    [queriesSaved, selectedQueryName, query],
  );

  const confirmChangeQuery = useCallback(async () => {
    if (query === '' || !selectedQueryName) {
      return true;
    }
    try {
      const currentSavedQuery = queriesSaved?.find((q) => q.name === selectedQueryName);
      if (currentSavedQuery?.query !== query) {
        await confirm(createConfirmation(ConfirmationPreset.ResetQuery));
      }
    } catch (e) {
      return false;
    }
    return true;
  }, [confirm, createConfirmation, queriesSaved, selectedQueryName, query]);

  useEffect(() => {
    if (!initialSelectedSet.current) {
      return;
    }
    const url = new URL(window.location.toString());
    if (selectedQueryName === null) {
      url.searchParams.delete(QUERY_URL_KEY);
    } else {
      url.searchParams.set(QUERY_URL_KEY, selectedQueryName);
    }
    window.history.replaceState({}, '', url);
    const queryItem = queriesSaved?.find((record) => record.name === selectedQueryName);
    setQuery(queryItem?.query ?? '');
    trackUiInteraction(AnalyticsAction.PlaygroundSavedSelect);
  }, [selectedQueryName]);

  const selectQuery = React.useCallback(async (value: string | null) => {
    if (!(await confirmChangeQuery())) {
      return false;
    }
    setSelectedQueryName(value);
    return true;
  }, [confirmChangeQuery]);

  const saveQuery = useCallback((id: number | null, name: string) => {
    if (!database) {
      throw Error('database id should not be empty');
    }
    return (id === null
      ? apiService.createSavedQuery(projectId, {
        query,
        name,
        database_id: database.database.id,
      })
      : apiService.updateProjectSavedQuery(id, {
        name,
        query,
      })).then(tryFetchQueriesSaved)
      .then(() => setSelectedQueryName(name));
  },
  [projectId, query, selectQuery, database?.database.id]);

  const renameQuery = useCallback((id: number, newName: string) => {
    const queryItem = queriesSaved?.find((record) => record.id === id);
    return apiService.updateProjectSavedQuery(id, {
      name: newName,
    })
      .then(tryFetchQueriesSaved)
      .then(() => {
        if (queryItem?.name === selectedQueryName) {
          setSelectedQueryName(newName);
        }
      });
  }, [projectId, tryFetchQueriesSaved, queriesSaved, selectedQueryName]);

  const deleteSavedQuery = React.useCallback((id: number) => {
    const found = queriesSaved?.find((record) => record.id === id);
    if (found?.id) {
      apiService.deleteSavedQuery(found.id)
        .then(() => {
          if (found.name === selectedQueryName) { selectQuery(null); }
          tryFetchQueriesSaved();
        })
        .catch(apiErrorToaster);
    }
  }, [queriesSaved, projectId, tryFetchQueriesSaved, selectedQueryName]);

  const selectedQueryId = useMemo(() => {
    const queryItem = queriesSaved?.find((record) => record.name === selectedQueryName);
    return queryItem?.id ?? null;
  }, [queriesSaved, selectedQueryName]);

  return (
    <QueryContext.Provider value={{
      state: {
        isDisabled: !query || isDbLoading || (!isDbLoading && !databases.length),
        layout,
        credentials,
        branch,
        branchHasEndpoints: !!endpoints.length,
        database,
        query,
        queryChanged,
        queriesSaved,
        selectedQueryName,
        selectedQueryId,
        queriesHistory,
        isQueryRunning,
        queryOptions,
        result: queryResult,
      },
      actions: {
        run,
        cancel,
        saveQuery,
        renameQuery,
        selectQuery,
        deleteSavedQuery,
        onChangeQuery: setQuery,
        onChangeBranch: setBranch,
        setLayout,
        onChangeDatabase,
        onChangeCredentials: setCredentials,
        onChangeQuerySelection: setQuerySelection,
      },
      editorRef,
    }}
    >
      {children}
    </QueryContext.Provider>
  );
});
QueryProvider.displayName = 'QueryProvider';

export { QueryProvider, useQueryContext };
