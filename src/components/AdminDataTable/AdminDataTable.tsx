import React from 'react';
import { useLocation } from 'react-router-dom';

import { DataTable, DataTableOrder, DataTableProps } from '../../components/DataTable/DataTable';
import { parse, stringify } from 'query-string';

export function AdminDataTable<T extends Record<string, any>>(props: DataTableProps<T>) {
  const { search } = useLocation();
  const query = parse(search);
  return (
    <DataTable
      onChangeSort={(sort) => {
        if (window) {
          window.location.search = stringify({
            ...parse(window.location.search),
            ...sort,
          });
        }
      }}
      sort={String(query.sort)}
      order={['asc', 'desc'].includes(String(query.order)) ? query.order as DataTableOrder : undefined}
      {...props}
    />
  );
}
