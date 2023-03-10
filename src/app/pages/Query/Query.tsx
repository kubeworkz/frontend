import React from 'react';

import { CenteredLoader } from '#shared/components/Loader/Loader';
import { QueryLayout } from '../../components/QueryLayout/QueryLayout';
import { QueryResultProvider } from '../../components/QueryResult/queryResultContext';

import { useProjectsItemContext } from '../../hooks/projectsItem';
import {
  QueryProvider,
} from './queryContext';

export const Query = React.memo(() => {
  const { isLoading } = useProjectsItemContext();

  if (isLoading) {
    return <CenteredLoader />;
  }

  return (
    <QueryProvider>
      <QueryResultProvider>
        <QueryLayout />
      </QueryResultProvider>
    </QueryProvider>
  );
});

Query.displayName = 'Query';
