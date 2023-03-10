import axios from 'axios';
import React, {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { apiService, StatementResult } from '#api_client/publicv2';
import { createUseContext } from '#shared/hooks/utils';

import { camelCase, CamelCase } from '#shared/utils/camelCase';
import { useCancelToken } from '#api_client/utils';
import {
  DatabaseOption,
  useProjectDatabases,
} from '../../hooks/projectDatabases';
import { useProjectsItemContext } from '../../hooks/projectsItem';

const COLUMNS_FIELDS = ['column_name', 'table_name', 'udt_name'] as const;
const COLUMNS_CAMELCASED = COLUMNS_FIELDS.map(camelCase);

type ColumnsKey = typeof COLUMNS_FIELDS[number];

export type ColumnDescription = Record<CamelCase<ColumnsKey>, string>;

const SCHEMA_QUERY = 'select schema_name from information_schema.schemata order by schema_name';

const createColumnsQuery = (schema: string) => `
select ${COLUMNS_FIELDS.join(', ')}
from information_schema.columns
where table_schema='${schema}'
order by table_name, column_name`;

const PAGE_SIZE = 100;
const createTableQuery = (schema: string, table: string, offset: number) => `
SELECT * FROM "${schema}"."${table}"
LIMIT ${PAGE_SIZE} OFFSET ${offset};
SELECT count(*) from "${schema}"."${table}";`.trim();

type SetError = (error: unknown | null) => void;

export type TablesContextInterface = {
  error: unknown | null;
  selectedDatabase?: DatabaseOption;
  schemas: string[];
  selectedSchema: string;
  tables: string[];
  columnsByTable: Record<string, ColumnDescription[]>;
  selectedTable: string | undefined;
  isLoading: boolean;
  isTableDataLoading: boolean;
  tableData: StatementResult | undefined;
  offset: number;
  limit: number;
  total: number;

  onSelectSchema: (s: string) => void;
  onSelectDatabase: (db: DatabaseOption) => void;
  onSelectTable: (table: string) => void;
  onSetOffset: (page: number) => void;
};

const TablesContext = createContext<TablesContextInterface | null>(null);

const useDatabases = () => {
  const { isLoading } = useProjectDatabases();
  const [selectedDatabase, setSelectedDatabase] = useState<DatabaseOption>();

  return {
    selectedDatabase,
    isDbLoading: isLoading,
    onSelectDatabase: setSelectedDatabase,
  };
};

const useSchemas = (selectedDatabase: DatabaseOption | undefined, onError: SetError) => {
  const { project, projectId } = useProjectsItemContext();

  const [schemas, setSchemas] = useState<string[]>([]);
  const [selectedSchema, setSelectedSchema] = useState('public');
  const { cancel, create } = useCancelToken();

  useEffect(() => {
    if (!selectedDatabase || !project) {
      return;
    }

    cancel();

    apiService
      .runProjectQuery(projectId, {
        branch_id: selectedDatabase.database.branch_id,
        db_name: selectedDatabase.value,
        role_name: project?.store_passwords ? selectedDatabase.database.owner_name : undefined,
        query: SCHEMA_QUERY,
        skip_history: true,
      }, {
        cancelToken: create(),
      })
      .then(({ data }) => {
        const rows = data?.response?.[0]?.data?.rows?.map(([name]) => name);
        if (rows) {
          setSchemas(rows);
        }
        onError(null);
      })
      .catch(onError);
  }, [selectedDatabase, projectId]);

  return {
    selectedSchema,
    schemas,
    setSelectedSchema,
  };
};

const useColumns = (
  selectedDatabase: DatabaseOption | undefined,
  selectedSchema: string,
  onError: SetError,
) => {
  const { project, projectId } = useProjectsItemContext();
  const [columns, setColumns] = useState<ColumnDescription[]>([]);
  const [columnsLoading, setColumnsLoading] = useState(false);
  const { cancel, create } = useCancelToken();

  useEffect(() => {
    if (!selectedDatabase || !project) {
      return;
    }

    cancel();

    setColumnsLoading(true);
    apiService
      .runProjectQuery(projectId, {
        branch_id: selectedDatabase.database.branch_id,
        db_name: selectedDatabase.value,
        role_name: project?.store_passwords ? selectedDatabase.database.owner_name : undefined,
        query: createColumnsQuery(selectedSchema),
        skip_history: true,
      }, {
        cancelToken: create(),
      })
      .then(({ data }) => {
        const rows = data?.response?.[0]?.data?.rows;
        setColumns(
          rows?.map(
            (row) => Object.fromEntries(
              row.map((v, idx) => [COLUMNS_CAMELCASED[idx], v]),
            ) as ColumnDescription,
          ) ?? [],
        );
        onError(null);
      })
      .catch(onError)
      .finally(() => {
        setColumnsLoading(false);
      });
  }, [selectedDatabase, projectId, selectedSchema]);

  const { tables, columnsByTable } = useMemo(() => {
    const tablesSet = new Set<string>();
    const columnsByTableRes: Record<string, ColumnDescription[]> = {};
    columns.forEach((column) => {
      const { tableName } = column;
      tablesSet.add(tableName);
      if (!columnsByTableRes[tableName]) {
        columnsByTableRes[tableName] = [];
      }
      columnsByTableRes[tableName].push(column);
    });

    return {
      tables: Array.from(tablesSet),
      columnsByTable: columnsByTableRes,
    };
  }, [columns]);

  return {
    tables,
    columnsByTable,
    columnsLoading,
  };
};

const useTablesData = (
  selectedDatabase: DatabaseOption | undefined,
  selectedSchema: string,
  onError: SetError,
) => {
  const { projectId, project } = useProjectsItemContext();
  const [selectedTable, setSelectedTable] = useState<string>();
  const [isTableDataLoading, setIsTableDataLoading] = useState(false);
  const [tableData, setTableData] = useState<StatementResult>();
  const [offset, setOffset] = useState(0);
  const [total, setTotal] = useState(0);
  const { cancel, create } = useCancelToken();

  useEffect(() => {
    setOffset(0);
  }, [selectedTable]);

  useEffect(() => {
    if (!selectedDatabase || !selectedTable) {
      return;
    }

    cancel();

    setIsTableDataLoading(true);
    apiService
      .runProjectQuery(projectId, {
        branch_id: selectedDatabase.database.branch_id,
        db_name: selectedDatabase.value,
        role_name: project?.store_passwords ? selectedDatabase.database.owner_name : undefined,
        query: createTableQuery(selectedSchema, selectedTable, offset),
        skip_history: true,
      }, {
        cancelToken: create(),
      })
      .then(({ data }) => {
        const [tableDataResponse, totalResponse] = data.response ?? [];
        setTableData(tableDataResponse);
        setTotal(Number(totalResponse?.data?.rows?.[0][0]) || 0);
        onError(null);
      })
      .catch(onError)
      .finally(() => {
        setIsTableDataLoading(false);
      });
  }, [selectedDatabase, projectId, selectedSchema, selectedTable, offset]);

  return {
    selectedTable,
    tableData,
    total,
    offset,
    isTableDataLoading,
    onSetOffset: setOffset,
    onSelectTable: setSelectedTable,
  };
};

export const TablesProvider = ({ children }: { children: ReactNode }) => {
  const [error, setError] = useState<unknown>(null);
  const onError = useCallback((err: unknown) => {
    if (axios.isCancel(err)) {
      return;
    }
    setError(err);
  }, [setError]);

  const { selectedDatabase, isDbLoading, onSelectDatabase } = useDatabases();
  const { selectedSchema, schemas, setSelectedSchema } = useSchemas(selectedDatabase, onError);
  const { tables, columnsLoading, columnsByTable } = useColumns(
    selectedDatabase,
    selectedSchema,
    onError,
  );
  const {
    tableData,
    selectedTable,
    isTableDataLoading,
    total,
    offset,
    onSetOffset,
    onSelectTable,
  } = useTablesData(selectedDatabase, selectedSchema, onError);

  return (
    <TablesContext.Provider
      value={{
        error,
        selectedDatabase,
        schemas,
        tables,
        columnsByTable,
        isLoading: isDbLoading || columnsLoading,
        selectedSchema,
        selectedTable,
        isTableDataLoading,
        tableData,
        total,
        offset,
        limit: PAGE_SIZE,

        onSelectSchema: useCallback((schema) => {
          onSelectTable(undefined);
          setSelectedSchema(schema);
        }, [setSelectedSchema, onSelectTable]),
        onSelectDatabase,
        onSelectTable,
        onSetOffset,
      }}
    >
      {children}
    </TablesContext.Provider>
  );
};

export const useTables = createUseContext(TablesContext);
