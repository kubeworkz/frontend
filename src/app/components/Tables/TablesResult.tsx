import React from 'react';

import { useTables } from '../../pages/Tables/tablesContext';
import { QueryResult } from '../QueryResult/QueryResult';
import { QueryResultProvider } from '../QueryResult/queryResultContext';

export const TablesResult = () => {
  const { isTableDataLoading, tableData, offset } = useTables();

  const queryResult = { success: true, response: tableData ? [tableData] : [] };
  return (
    <QueryResultProvider>
      <QueryResult
        isQueryRunning={isTableDataLoading}
        offset={offset}
        result={queryResult}
      />
    </QueryResultProvider>
  );
};
